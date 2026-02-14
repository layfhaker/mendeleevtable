#!/usr/bin/env python3
"""Convert video into BadApplePlayer JSON payload."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Convert video frames into compact 18x10 payload for js/bad-apple.js "
            "(binary or 16-level grayscale)."
        )
    )
    parser.add_argument("input", type=Path, help="Path to source video.")
    parser.add_argument("output", type=Path, help="Path to output payload JSON.")
    parser.add_argument("--width", type=int, default=18, help="Output width. Default: 18.")
    parser.add_argument("--height", type=int, default=10, help="Output height. Default: 10.")
    parser.add_argument("--fps", type=float, default=12.0, help="Target fps. Default: 12.")
    parser.add_argument(
        "--mode",
        choices=("bw", "gray"),
        default="bw",
        help="bw = 1-bit, gray = 16-level grayscale. Default: bw.",
    )
    parser.add_argument(
        "--threshold",
        type=int,
        default=128,
        help="Threshold for bw mode (0..255). Darker pixels are on. Default: 128.",
    )
    parser.add_argument(
        "--invert",
        action="store_true",
        help="Invert polarity (light pixels become on).",
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=0,
        help="Stop after this many frames (0 = no limit).",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Write pretty JSON instead of compact JSON.",
    )
    parser.add_argument(
        "--output-format",
        choices=("json", "js"),
        default="json",
        help="json = raw payload, js = window variable assignment. Default: json.",
    )
    parser.add_argument(
        "--var-name",
        default="BAD_APPLE_PAYLOAD",
        help="Window variable name for --output-format js. Default: BAD_APPLE_PAYLOAD.",
    )
    return parser.parse_args()


def encode_bw_hex_bitset(gray_frame, threshold: int, invert: bool) -> str:
    flat = gray_frame.reshape(-1)
    bits = (flat < threshold).astype("uint8")
    if invert:
        bits = 1 - bits

    chars = []
    total = len(bits)
    for i in range(0, total, 4):
        b0 = int(bits[i]) if i < total else 0
        b1 = int(bits[i + 1]) if i + 1 < total else 0
        b2 = int(bits[i + 2]) if i + 2 < total else 0
        b3 = int(bits[i + 3]) if i + 3 < total else 0
        chars.append(format((b0 << 3) | (b1 << 2) | (b2 << 1) | b3, "x"))
    return "".join(chars)


def encode_gray_hex_nibbles(gray_frame, invert: bool) -> str:
    # 0 -> offColor, 15 -> onColor in BadApplePlayer.
    levels = ((255 - gray_frame) * 15.0 / 255.0).round().astype("uint8")
    if invert:
        levels = 15 - levels
    return "".join(format(int(value) & 0xF, "x") for value in levels.reshape(-1))


def convert_video(
    *,
    input_path: Path,
    width: int,
    height: int,
    target_fps: float,
    mode: str,
    threshold: int,
    invert: bool,
    max_frames: int,
) -> tuple[dict, int]:
    try:
        import cv2
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "opencv-python is required. Install with: pip install opencv-python"
        ) from exc

    capture = cv2.VideoCapture(str(input_path))
    if not capture.isOpened():
        raise RuntimeError(f"Cannot open video: {input_path}")

    source_fps = float(capture.get(cv2.CAP_PROP_FPS) or 0.0)
    if source_fps <= 0:
        source_fps = target_fps if target_fps > 0 else 25.0
    if target_fps <= 0:
        target_fps = source_fps

    frames: list[str] = []
    frame_index = 0
    next_emit_time = 0.0
    emit_step = 1.0 / target_fps
    encoding = "hex-bitset-v1"

    while True:
        ok, frame_bgr = capture.read()
        if not ok:
            break

        current_time = frame_index / source_fps
        frame_index += 1

        if current_time + 1e-9 < next_emit_time:
            continue

        frame_gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(frame_gray, (width, height), interpolation=cv2.INTER_AREA)

        if mode == "gray":
            frames.append(encode_gray_hex_nibbles(resized, invert=invert))
            encoding = "hex-nibbles-v1"
        else:
            frames.append(
                encode_bw_hex_bitset(
                    resized,
                    threshold=threshold,
                    invert=invert,
                )
            )
            encoding = "hex-bitset-v1"

        next_emit_time += emit_step

        if max_frames > 0 and len(frames) >= max_frames:
            break

    capture.release()

    payload = {
        "encoding": encoding,
        "width": width,
        "height": height,
        "fps": target_fps,
        "frames": frames,
        "meta": {
            "source_video": input_path.name,
            "source_fps": source_fps,
            "mode": mode,
            "threshold": threshold if mode == "bw" else None,
            "invert": invert,
        },
    }
    return payload, frame_index


def main() -> int:
    args = parse_args()

    if args.width <= 0 or args.height <= 0:
        print("Width and height must be positive.", file=sys.stderr)
        return 2
    if args.fps <= 0:
        print("FPS must be greater than zero.", file=sys.stderr)
        return 2
    if args.mode == "bw" and not (0 <= args.threshold <= 255):
        print("Threshold must be in range 0..255.", file=sys.stderr)
        return 2
    if not args.input.exists():
        print(f"Input file not found: {args.input}", file=sys.stderr)
        return 2
    if args.output_format == "js" and not args.var_name.strip():
        print("Variable name must not be empty.", file=sys.stderr)
        return 2

    try:
        payload, decoded_frames = convert_video(
            input_path=args.input,
            width=args.width,
            height=args.height,
            target_fps=args.fps,
            mode=args.mode,
            threshold=args.threshold,
            invert=args.invert,
            max_frames=max(0, args.max_frames),
        )
    except Exception as exc:
        print(f"Conversion failed: {exc}", file=sys.stderr)
        return 1

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as out_file:
        if args.output_format == "js":
            if args.pretty:
                payload_json = json.dumps(payload, ensure_ascii=False, indent=2)
            else:
                payload_json = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
            out_file.write(f"window.{args.var_name.strip()} = {payload_json};\n")
        else:
            if args.pretty:
                json.dump(payload, out_file, ensure_ascii=False, indent=2)
            else:
                json.dump(payload, out_file, ensure_ascii=False, separators=(",", ":"))

    print(
        "Done: wrote",
        len(payload["frames"]),
        "frames to",
        str(args.output),
        f"(decoded input frames: {decoded_frames})",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

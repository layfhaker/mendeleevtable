
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from pathlib import Path
from datetime import datetime

# ================= CONFIG =================

EXT_TO_CATEGORY = {
    ".html": "HTML", ".htm": "HTML",
    ".css": "CSS", ".scss": "CSS", ".sass": "CSS", ".less": "CSS",
    ".js": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
    ".ts": "TypeScript", ".tsx": "TypeScript", ".jsx": "JavaScript",
    ".py": "Python", ".pyi": "Python",
    ".tex": "LaTeX", ".sty": "LaTeX", ".cls": "LaTeX", ".bib": "LaTeX",
    ".md": "Markdown",
    ".json": "Data", ".yaml": "Data", ".yml": "Data", ".csv": "Data",
    ".toml": "Config", ".ini": "Config", ".cfg": "Config",
}

EXCLUDE_DIRS = {
    ".git", "node_modules", "dist", "build",
    ".venv", "venv", "__pycache__",
    ".idea", ".vscode"
}

OUTPUT_MD_NAME = "code_breakdown.md"

# ==========================================

def detect_category(path: Path) -> str:
    return EXT_TO_CATEGORY.get(path.suffix.lower(), "Other")

def count_nonempty_lines(text: str) -> int:
    return sum(1 for line in text.splitlines() if line.strip())

def iter_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fname in filenames:
            yield Path(dirpath) / fname

def main():
    # Folder where THIS script is located
    script_dir = Path(__file__).resolve().parent

    stats = {}

    for file in iter_files(script_dir):
        if file == Path(__file__):
            continue

        try:
            text = file.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        lines = count_nonempty_lines(text)
        if lines == 0:
            continue

        category = detect_category(file)
        stats[category] = stats.get(category, 0) + lines

    total = sum(stats.values()) or 1
    rows = sorted(stats.items(), key=lambda x: x[1], reverse=True)

    output_path = script_dir / OUTPUT_MD_NAME

    with output_path.open("w", encoding="utf-8") as md:
        md.write("# Code breakdown report\n\n")
        md.write(f"**Project folder:** `{script_dir}`  \n")
        md.write(f"**Generated:** {datetime.now().isoformat(timespec='seconds')}\n\n")
        md.write("| Category | Lines | Percent |\n")
        md.write("|---------|-------|---------|\n")

        for category, lines in rows:
            percent = lines / total * 100
            md.write(f"| {category} | {lines} | {percent:.2f}% |\n")

        md.write(f"\n**Total lines:** {total}\n")

    # Windows-friendly: show message in console if launched from terminal
    print(f"Markdown report created: {output_path}")

if __name__ == "__main__":
    main()

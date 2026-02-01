/**
 * FlipModalAnimator
 * Reusable, interruptible FLIP(shared-element) modal animation core.
 *
 * - Uses WAAPI (element.animate) with commitStyles() + computed-style fallback.
 * - Supports retarget (switch source button while open/opening).
 * - Backdrop blur can be animated via WAAPI if supported, or via CSS transition.
 *
 * Minimal requirements:
 * - containerEl: fixed-size "phone screen" container (position: relative; overflow: hidden)
 * - overlayEl: full-bleed element inside container (position:absolute; inset:0; transform-origin: top left)
 * - backdropEl: full-bleed element inside container (position:absolute; inset:0)
 *
 * See usage example at bottom.
 */
export class FlipModalAnimator {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.containerEl
   * @param {HTMLElement} opts.overlayEl
   * @param {HTMLElement} opts.backdropEl
   * @param {Record<string, HTMLElement>} opts.sources - key -> source button element
   * @param {(key:string|null)=>void} [opts.onActiveChange] - update theme/content when key changes
   * @param {HTMLElement|null} [opts.contentEl] - optional inner content to animate (opacity/transform)
   * @param {object} [opts.timing]
   * @param {number} [opts.timing.moveMs=360]
   * @param {number} [opts.timing.radiusMs=360]
   * @param {number} [opts.timing.backdropMs=260]
   * @param {string} [opts.timing.ease='cubic-bezier(0.2, 0.0, 0.0, 1)']
   * @param {string} [opts.timing.backdropEase='cubic-bezier(0.2, 0.0, 0.0, 1)']
   * @param {object} [opts.visual]
   * @param {number} [opts.visual.closedRadius=14]
   * @param {number} [opts.visual.blurPx=10]
   * @param {boolean} [opts.visual.animateBackdropFilter=false] - if true, animate backdrop-filter via WAAPI (may be flaky on some Android)
   * @param {boolean} [opts.visual.useCommitStyles=true]
   */
  constructor(opts) {
    if (!opts?.containerEl || !opts?.overlayEl || !opts?.backdropEl || !opts?.sources) {
      throw new Error("FlipModalAnimator: containerEl, overlayEl, backdropEl, sources are required");
    }

    this.containerEl = opts.containerEl;
    this.overlayEl = opts.overlayEl;
    this.backdropEl = opts.backdropEl;
    this.sources = opts.sources;
    this.contentEl = opts.contentEl ?? null;
    this.onActiveChange = opts.onActiveChange ?? (() => {});

    const t = opts.timing ?? {};
    this.timing = {
      moveMs: t.moveMs ?? 360,
      radiusMs: t.radiusMs ?? 360,
      backdropMs: t.backdropMs ?? 260,
      ease: t.ease ?? "cubic-bezier(0.2, 0.0, 0.0, 1)",
      backdropEase: t.backdropEase ?? "cubic-bezier(0.2, 0.0, 0.0, 1)",
    };

    const v = opts.visual ?? {};
    this.visual = {
      closedRadius: v.closedRadius ?? 14,
      blurPx: v.blurPx ?? 10,
      animateBackdropFilter: v.animateBackdropFilter ?? false,
      useCommitStyles: v.useCommitStyles ?? true,
    };

    this.activeKey = null;
    this.isOpen = false;

    /** @type {Animation|null} */ this.aMove = null;
    /** @type {Animation|null} */ this.aRadius = null;
    /** @type {Animation|null} */ this.aBackdrop = null;
    /** @type {Animation|null} */ this.aContent = null;

    // Initial state
    this._ensureHidden();
    this.backdropEl.style.opacity = "0";
    this.backdropEl.style.pointerEvents = "none";
    this.backdropEl.style.backdropFilter = "blur(0px)";
    this.backdropEl.style.webkitBackdropFilter = "blur(0px)";

    this.overlayEl.style.transformOrigin = "top left";
    this.overlayEl.style.transform = "translate(0px,0px) scale(1,1)";
    this.overlayEl.style.borderRadius = "0px";
  }

  /** Public API */
  openFrom(key) { this._openFrom(key); }
  close() { this._closeToActive(); }
  toggleFrom(key) {
    if (this.isOpen && this.activeKey === key) this._closeToActive();
    else this._openFrom(key);
  }
  retarget(key) { this._openFrom(key); } // same as openFrom, but keeps overlay visible
  getState() { return { activeKey: this.activeKey, isOpen: this.isOpen, visible: this._isVisible() }; }

  /** Helpers */
  _getSourceEl(key) { return this.sources[key] ?? null; }

  _isVisible() { return this.overlayEl.style.display === "block"; }
  _ensureVisible() {
    this.overlayEl.style.display = "block";
    this.backdropEl.style.pointerEvents = "auto";
  }
  _ensureHidden() {
    this.overlayEl.style.display = "none";
    this.backdropEl.style.pointerEvents = "none";
  }

  _freeze() {
    const el = this.overlayEl;
    const bd = this.backdropEl;
    const ct = this.contentEl;

    const anims = [this.aMove, this.aRadius, this.aBackdrop, this.aContent].filter(Boolean);

    if (this.visual.useCommitStyles) {
      for (const a of anims) {
        if (a && typeof a.commitStyles === "function") {
          try { a.commitStyles(); } catch {}
        }
      }
    }

    // Fallback: always pin current computed styles (more robust across browsers)
    const csO = getComputedStyle(el);
    el.style.transform = csO.transform === "none" ? "translate(0px,0px) scale(1,1)" : csO.transform;
    el.style.borderRadius = csO.borderRadius;

    const csB = getComputedStyle(bd);
    bd.style.opacity = csB.opacity;
    bd.style.backdropFilter = csB.backdropFilter;
    bd.style.webkitBackdropFilter = csB.webkitBackdropFilter;

    if (ct) {
      const csC = getComputedStyle(ct);
      ct.style.opacity = csC.opacity;
      ct.style.transform = csC.transform;
    }

    for (const a of anims) {
      try { a.cancel(); } catch {}
    }
    this.aMove = this.aRadius = this.aBackdrop = this.aContent = null;
  }

  _containerRect() { return this.containerEl.getBoundingClientRect(); }

  _rectToTransform(containerRect, targetRect) {
    const tx = targetRect.left - containerRect.left;
    const ty = targetRect.top - containerRect.top;
    const sx = targetRect.width / containerRect.width;
    const sy = targetRect.height / containerRect.height;
    return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
  }

  _animateOverlayTo(transformTo, radiusToPx) {
    const el = this.overlayEl;
    const curT = getComputedStyle(el).transform;
    const curR = getComputedStyle(el).borderRadius;

    this.aMove = el.animate(
      [{ transform: curT }, { transform: transformTo }],
      { duration: this.timing.moveMs, easing: this.timing.ease, fill: "forwards" }
    );

    this.aRadius = el.animate(
      [{ borderRadius: curR }, { borderRadius: `${radiusToPx}px` }],
      { duration: this.timing.radiusMs, easing: this.timing.ease, fill: "forwards" }
    );

    return this.aMove;
  }

  _animateBackdrop(on) {
    const bd = this.backdropEl;
    const from = getComputedStyle(bd).opacity;
    const to = on ? "1" : "0";

    // blur handling
    const blurTo = on ? `blur(${this.visual.blurPx}px)` : "blur(0px)";
    if (this.visual.animateBackdropFilter) {
      // WAAPI keyframes can be flaky on some Android browsers
      const blurFrom = getComputedStyle(bd).backdropFilter;
      this.aBackdrop = bd.animate(
        [
          { opacity: from, backdropFilter: blurFrom, webkitBackdropFilter: blurFrom },
          { opacity: to, backdropFilter: blurTo, webkitBackdropFilter: blurTo },
        ],
        { duration: this.timing.backdropMs, easing: this.timing.backdropEase, fill: "forwards" }
      );
      return;
    }

    // Compatible: animate opacity via WAAPI, blur via style (CSS transition if present)
    bd.style.backdropFilter = blurTo;
    bd.style.webkitBackdropFilter = blurTo;
    this.aBackdrop = bd.animate(
      [{ opacity: from }, { opacity: to }],
      { duration: this.timing.backdropMs, easing: this.timing.backdropEase, fill: "forwards" }
    );
  }

  _animateContent(opening) {
    const ct = this.contentEl;
    if (!ct) return;

    const curO = getComputedStyle(ct).opacity;
    const curT = getComputedStyle(ct).transform;

    const toOpacity = opening ? 1 : 0;
    const toTransform = opening
      ? "translateY(0px) scale(1)"
      : "translateY(10px) scale(0.985)";

    const dur = opening ? Math.min(220, this.timing.moveMs) : Math.min(180, this.timing.moveMs);

    this.aContent = ct.animate(
      [{ opacity: curO, transform: curT }, { opacity: String(toOpacity), transform: toTransform }],
      { duration: dur, easing: this.timing.ease, fill: "forwards" }
    );
  }

  _openFrom(key) {
    const src = this._getSourceEl(key);
    if (!src) return;

    this._freeze();

    const wasVisible = this._isVisible();
    this.activeKey = key;
    this.onActiveChange(key);

    this._ensureVisible();

    const containerRect = this._containerRect();

    // If it was fully hidden/closed, snap overlay to source rect first (no animation)
    if (!this.isOpen && !wasVisible) {
      const b = src.getBoundingClientRect();
      this.overlayEl.style.transform = this._rectToTransform(containerRect, b);
      this.overlayEl.style.borderRadius = `${this.visual.closedRadius}px`;

      // content starts tucked
      if (this.contentEl) {
        this.contentEl.style.opacity = "0";
        this.contentEl.style.transform = "translateY(10px) scale(0.985)";
      }

      // backdrop starts off
      this.backdropEl.style.opacity = "0";
      this.backdropEl.style.backdropFilter = "blur(0px)";
      this.backdropEl.style.webkitBackdropFilter = "blur(0px)";
    }

    // Animate to full
    const c = containerRect;
    const fullRect = { left: c.left, top: c.top, width: c.width, height: c.height };
    const toT = this._rectToTransform(containerRect, fullRect); // effectively identity

    this._animateBackdrop(true);
    this._animateContent(true);

    const a = this._animateOverlayTo(toT, 0);
    const thisMove = a;
    a.finished.then(() => {
      if (this.aMove !== thisMove) return; // interrupted
      this.isOpen = true;
    }).catch(() => {});
  }

  _closeToActive() {
    if (!this.activeKey) return;
    if (!this._isVisible()) return;

    const src = this._getSourceEl(this.activeKey);
    if (!src) return;

    this._freeze();

    const containerRect = this._containerRect();
    const b = src.getBoundingClientRect();
    const toT = this._rectToTransform(containerRect, b);

    this._animateBackdrop(false);
    this._animateContent(false);

    const a = this._animateOverlayTo(toT, this.visual.closedRadius);
    const thisMove = a;
    a.finished.then(() => {
      if (this.aMove !== thisMove) return; // interrupted
      this.isOpen = false;
      this._ensureHidden();
      // keep activeKey (useful for fast toggle); user can null it manually if desired:
      // this.activeKey = null;
      // this.onActiveChange(null);
    }).catch(() => {});
  }
}

/* ---------------------------
   Minimal usage example
   ---------------------------

import { FlipModalAnimator } from "./flip-modal-animator.js";

const animator = new FlipModalAnimator({
  containerEl: document.querySelector(".screen"),
  overlayEl: document.querySelector("#overlay"),
  backdropEl: document.querySelector("#backdrop"),
  contentEl: document.querySelector("#content"), // optional
  sources: {
    uran: document.querySelector("#btn-uran"),
    pluton: document.querySelector("#btn-pluton"),
  },
  onActiveChange: (key) => {
    // update theme classes
    const overlay = document.querySelector("#overlay");
    overlay.classList.toggle("p-uran", key === "uran");
    overlay.classList.toggle("p-pluton", key === "pluton");
    document.querySelector("#title").textContent = key === "uran" ? "Уран" : key === "pluton" ? "Плутон" : "";
  },
  timing: { moveMs: 360, radiusMs: 360, backdropMs: 260, ease: "cubic-bezier(0.2,0,0,1)" },
  visual: { closedRadius: 14, blurPx: 10, animateBackdropFilter: false },
});

document.querySelector("#btn-uran").addEventListener("click", () => animator.toggleFrom("uran"));
document.querySelector("#btn-pluton").addEventListener("click", () => animator.toggleFrom("pluton"));
document.querySelector("#close").addEventListener("click", () => animator.close());
document.querySelector("#backdrop").addEventListener("click", () => animator.close());
window.addEventListener("keydown", (e) => e.key === "Escape" && animator.close());

*/

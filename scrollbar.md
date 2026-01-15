# 🎨 Task: Implement Beautiful Cross-Browser Scrollbars for Chrome

## 📋 Project Context

**Project:** Interactive Periodic Table ("Химический Ассистант")
**Stack:** Vanilla HTML, CSS, JavaScript (no frameworks, no build tools)
**Environment:** Works via `file://` protocol and GitHub Pages
**Constraints:** No ES6 modules (CORS issues), all code in global scope

## 🎯 Goal

Make all scrollbars in Chrome look beautiful and consistent, matching the styling that Firefox already displays via `scrollbar-width` and `scrollbar-color` properties. Currently, Chrome renders ugly default gray scrollbars in some areas.

## 📁 Project Structure

CSS files location:
- `css/style.css` - main styles
- `css/base.css` - base/reset styles
- `css/theme.css` - theme switching (light/dark)
- `css/solubility.css` - solubility table modal
- `css/modal.css` - element modals
- `css/advanced-modal.css` - advanced element modal
- `css/calculator.css` - molar mass calculator
- `css/nodemap.css` - NodeMap visualization
- `css/fab.css` - floating action button menu
- `css/filters.css` - filter panels
- `css/scroll-collapse.css` - scroll behavior
- `css/balancer.css` - equation balancer

## 🔍 Current State Analysis

The project already has partial scrollbar styling scattered across files:
- `scrollbar-width: thin` and `scrollbar-color` for Firefox
- `::-webkit-scrollbar` pseudo-elements for Chrome/Safari
- BUT: styling is inconsistent and some scrollable areas are missing custom scrollbars

**Existing scrollbar locations (from grep):**
```
css/advanced-modal.css: .advanced-tabs, .advanced-content
css/balancer.css: .balancer-content
css/base.css: body (light/dark themes)
css/solubility.css: .solubility-wrapper
css/nodemap.css: .nodemap-sidebar
css/scroll-collapse.css: body.scroll-unlocked
css/style.css: .periodic-table-container
css/theme.css: body.dark-theme
css/modal.css: #element-info, .group-content
```

## ✅ Requirements

### 1. Create CSS Variables for Scrollbar Colors

In `css/base.css` or `css/theme.css`, define reusable CSS custom properties:
```css
:root {
    /* Light theme scrollbar */
    --scrollbar-width: 8px;
    --scrollbar-thumb: #2196F3;
    --scrollbar-thumb-hover: #1976D2;
    --scrollbar-track: rgba(0, 0, 0, 0.05);
    --scrollbar-radius: 4px;
}

body.dark-theme {
    /* Dark theme scrollbar */
    --scrollbar-thumb: #64B5F6;
    --scrollbar-thumb-hover: #90CAF9;
    --scrollbar-track: rgba(255, 255, 255, 0.05);
}
```

### 2. Create a Reusable Scrollbar Mixin/Class

Since we can't use SCSS, create a utility approach. Add a base scrollbar style that can be applied globally:
```css
/* Universal scrollbar styles - add to css/base.css */

/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

/* Chrome/Safari/Edge */
::-webkit-scrollbar {
    width: var(--scrollbar-width);
    height: var(--scrollbar-width);
}

::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: var(--scrollbar-radius);
}

::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: var(--scrollbar-radius);
    border: 2px solid transparent;
    background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
    background-clip: padding-box;
}

::-webkit-scrollbar-corner {
    background: transparent;
}
```

### 3. Handle Specific Scrollable Containers

Some elements need special treatment (hidden scrollbars, thin scrollbars, etc.):

**Elements that should HIDE scrollbars:**
- `.periodic-table-container` (horizontal scroll on mobile)
- `.advanced-tabs` (horizontal tab scroll)

**Elements that should have THIN elegant scrollbars:**
- `.solubility-wrapper` (main table scroll)
- `.advanced-content` (modal content)
- `.nodemap-sidebar` (sidebar scroll)
- `#element-info` (element details)
- `.group-content` (collapsible groups)
- `.balancer-content` (equation balancer)
- `.filters-panel` (filter sidebar)

### 4. Mobile Considerations

On mobile (touch devices), scrollbars should be hidden for cleaner UX:
```css
@media (max-width: 768px), (pointer: coarse) {
    .solubility-wrapper,
    .periodic-table-container {
        scrollbar-width: none;
    }
    
    .solubility-wrapper::-webkit-scrollbar,
    .periodic-table-container::-webkit-scrollbar {
        display: none;
    }
}
```

### 5. Theme Transition

Ensure scrollbar colors transition smoothly when theme changes:
```css
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
    transition: background-color 0.3s ease;
}
```

## ⚠️ Important Notes

1. **Specificity:** Some existing styles may need to be removed or have higher specificity. Check for conflicts.

2. **Testing:** Test on:
   - Chrome (Windows/Mac)
   - Firefox
   - Safari
   - Edge
   - Mobile Chrome/Safari

3. **File Protocol:** Ensure all changes work with `file://` protocol (no external dependencies).

4. **Surgical Changes:** Do NOT rewrite entire files. Make minimal, targeted edits. Provide exact line numbers or selectors to modify.

## 📝 Deliverables

1. **List of files to modify** with exact changes (find/replace format)
2. **New CSS to add** (if creating new sections)
3. **CSS to remove** (duplicate or conflicting styles)
4. **Order of changes** (which file first)

## 🧪 Verification

After changes, verify:
- [ ] Chrome shows styled scrollbars (blue thumb, light track)
- [ ] Firefox still works correctly
- [ ] Dark theme scrollbars are lighter blue
- [ ] Theme switch animates scrollbar colors
- [ ] No double scrollbars appear
- [ ] Mobile devices hide scrollbars where appropriate
- [ ] Horizontal scrollbars (where present) are also styled

## 📎 Reference Colors

Based on current project theme:
- Primary Blue: `#2196F3`
- Primary Blue Dark: `#1976D2`
- Primary Blue Light: `#64B5F6`
- Primary Blue Lighter: `#90CAF9`
- Dark Background: `#1a1a2e`
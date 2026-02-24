# Language and Stack Audit


<!-- DOC_SYNC_START -->
> Doc sync: `2026-02-24`
> Full technical audit references:
> - [`COMMIT_HISTORY_FULL.md`](COMMIT_HISTORY_FULL.md)
> - [`FUNCTION_INDEX_FULL.md`](FUNCTION_INDEX_FULL.md)
> - [`LANGUAGE_STACK_FULL.md`](LANGUAGE_STACK_FULL.md)
<!-- DOC_SYNC_END -->
Updated: `2026-02-24`

## File Count by Extension
| Extension | Language/Type | Files | Lines (text-readable) |
|---|---|---:|---:|
| `.md` | Markdown | 57 | 3189 |
| `.js` | JavaScript | 52 | 28755 |
| `.css` | CSS | 22 | 12247 |
| `.json` | JSON | 16 | 12100 |
| `.svg` | SVG | 11 | 77 |
| `.docx` | Word DOCX | 5 | 8286 |
| `.txt` | Text | 5 | 40925 |
| `<no_ext>` | No extension | 4 | 63 |
| `.png` | .png | 3 | 1870 |
| `.py` | Python | 3 | 394 |
| `.pdf` | PDF | 2 | 15392 |
| `.pptx` | PowerPoint PPTX | 2 | 16312 |
| `.tex` | LaTeX | 2 | 245 |
| `.yml` | YAML | 2 | 254 |
| `.canvas` | .canvas | 1 | 21 |
| `.html` | HTML | 1 | 1278 |
| `.jsx` | JavaScript (JSX) | 1 | 1993 |
| `.mp4` | .mp4 | 1 | 90537 |

## Runtime and Tooling (from repository)
- Main frontend runtime: browser (HTML/CSS/JavaScript).
- Optional desktop runtime: Electron (`electron-app/`).
- Service worker present: `sw.js`.
- Python helper scripts present (`scripts/`, root `*.py`).
- Package management: npm (`package.json`, `package-lock.json`).

## Dependency Snapshot


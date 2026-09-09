# Rool-Studio — Design Guidelines

## Stance
Underground game-studio dark. Cinematic void-black ground with violet-to-pink gradient as the sole accent system. No warm tones, no gray SaaS neutrals. Fully committed dark palette — everything lives against near-black.

## Typography
- **Display:** Clash Display (fontshare) — bold headers, hero title, section titles
- **Body:** General Sans (fontshare) — all prose, labels, UI copy
- **Mono:** system monospace for code snippets only (not used in main UI)

## Color Tokens
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#07070d` | Page background |
| `--bg-panel` | `#0f0f1a` | Cards, modals |
| `--bg-panel-2` | `#14141f` | Nested surfaces |
| `--violet` | `#8b5cf6` | Primary accent |
| `--pink` | `#ec4899` | Secondary accent |
| `--grad` | `135deg violet→pink` | CTAs, stat values, badges |
| `--text` | `#f2f0f8` | Primary text |
| `--text-muted` | `#8f8ca6` | Secondary text |
| `--text-faint` | `#5c5972` | Hints, captions |
| `--line` | `rgba(255,255,255,0.09)` | Borders |

## Spacing Scale
Use multiples of 4px. Section padding: 80px vertical, 32px horizontal. Cards: 18–22px padding.

## Components
- **Cards:** `var(--bg-panel)` + `var(--line)` border + `var(--radius-lg)` (18px). Hover: violet border, subtle lift + shadow.
- **Buttons Primary:** gradient background, white text, 12px radius, lift on hover.
- **Buttons Ghost:** `rgba(255,255,255,0.05)` + line border.
- **Modals:** glassmorphism backdrop (`blur(10px)`), scaleIn animation on content.
- **Toasts:** left-colored border (green/red/violet), slide-in from bottom-right.

## Effects
- Background: blurred image + film grain + violet radial gradient overlay
- Floating particles: canvas-based, subtle violet/pink/amber dots with faint connection lines
- Scroll reveal: `.reveal` → `.reveal.visible` via IntersectionObserver
- Stat counters: count-up animation triggered on scroll-into-view

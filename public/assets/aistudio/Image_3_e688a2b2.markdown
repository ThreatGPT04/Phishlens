---
name: Retro-Modern Arcade HUD
colors:
  surface: '#0f1221'
  surface-dim: '#0f1221'
  surface-bright: '#353849'
  surface-container-lowest: '#0a0d1c'
  surface-container-low: '#181b2a'
  surface-container: '#1c1f2e'
  surface-container-high: '#262939'
  surface-container-highest: '#313444'
  on-surface: '#e0e1f7'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e0e1f7'
  inverse-on-surface: '#2d2f40'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ffb2b9'
  on-secondary: '#67001e'
  secondary-container: '#e2044d'
  on-secondary-container: '#fff6f6'
  tertiary: '#ffeacb'
  on-tertiary: '#412d00'
  tertiary-container: '#ffc860'
  on-tertiary-container: '#755300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#40000f'
  on-secondary-fixed-variant: '#91002e'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#0f1221'
  on-background: '#e0e1f7'
  surface-variant: '#313444'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the electrifying energy of classic arcade interfaces fused with high-density modern telemetry. The target audience consists of power users, gamers, and developers who appreciate high-information-density layouts with a kinetic edge. The emotional response is one of adrenaline-fueled focus, precision, and immersive engagement. 

The aesthetic synthesizes high-contrast neon accents, razor-sharp geometry, and deep dark voids to create a futuristic heads-up display. It treats data like high-score logs and system health like arcade cabinet diagnostics.

## Colors

The palette is anchored by a deep obsidian arcade cabinet background (`#090A10`), layered with elevated dark card panels (`#121524`). 

Interactive controls pulse with Electric Cyan (`#00E5FF`), while semantic states leverage high-voltage arcade hues: Crimson Red (`#FF2A5F`) for critical alerts and red flags, Arcade Amber (`#FFB800`) for warnings and suspicious states, and Phosphor Green (`#00E676`) for operational success and green flags.

## Typography

Typography pairs clean, modern geometric grotesques for narrative readability with fixed-width terminal fonts for telemetry, code, and numerical scores. 

Headers command attention with tight tracking, while body copy remains legible and grounded. Monospaced type is strictly reserved for status readouts, telemetry timestamps, and interactive identifiers to reinforce the HUD diagnostic feel.

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid system engineered for high-density data displays. Spacing is mathematically consistent, adhering to a strict 4px/8px baseline grid to maintain structural alignment across all dashboard modules.

On mobile form factors, margins collapse to 1rem while multi-column telemetry panels stack vertically into single-column inspection feeds. Section containers maintain rigid alignment, mimicking physical arcade cabinet control boards.

## Elevation & Depth

Depth is conveyed through crisp low-contrast outlines and tonal surface stratification rather than heavy drop shadows. Elevated card panels (`#121524`) sit cleanly atop the deep void background (`#090A10`), bounded by precise 1px-2px structural borders. 

Active focus states and hovered interactive elements project a sharp, low-opacity neon glow, casting a localized aura that heightens spatial hierarchy without relying on traditional skeuomorphic elevation.

## Shapes

The design system embraces absolute geometric precision with sharp `0px` roundedness across all primary containers, buttons, and input fields. 

This brutalist, engineering-first corner geometry honors classic arcade CRT frames and diagnostic HUD readouts, projecting uncompromising speed and tactical efficiency.

## Components

### Buttons
Action triggers must feature sharp 0px corners, utilizing solid Electric Cyan (`#00E5FF`) for primary triggers with high-contrast dark text. Secondary buttons employ ghost borders with transparent fills and cyan text outlines, reacting to hover states with an immediate solid fill inversion and subtle glow.

### Chips & Badges
Status indicators use compact pill or sharp-edged rectangular badges mapped directly to semantic arcade colors: Crimson Red for errors/flags, Arcade Amber for warnings, and Phosphor Green for verified operational statuses. Monospaced text is mandatory for badge labels.

### Lists & Telemetry Feeds
Data rows are cleanly separated by 1px neutral dividers. Alternating row opacities provide scannability in high-density logs, with hover states illuminating the entire row index with a faint cyan ambient stroke.

### Checkboxes & Radio Buttons
Built as rigid square and diamond vector frames. Unchecked states show a dim hollow border; checked states snap instantly to a fully saturated neon fill featuring a crisp inner tick mark.

### Input Fields
Inputs feature solid elevated backgrounds (`#121524`) encased in a 1px structural border. Upon focus, the border transitions instantly to Electric Cyan with an accompanying monospaced placeholder style, echoing active terminal command lines.

### Cards
Dashboard cards act as modular telemetry units. They feature a solid surface fill, a sharp 1px border, and optionally display a top-left diagnostic label set in `JetBrains Mono` to establish clear structural ownership of the enclosed data.
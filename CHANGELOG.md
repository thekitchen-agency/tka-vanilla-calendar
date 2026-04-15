## [1.1.1](https://github.com/thekitchen-agency/tka-vanilla-calendar/compare/v1.1.0...v1.1.1) (2026-04-15)


### Bug Fixes

* use relative paths in vite.config.js for ESM compatibility ([be8228a](https://github.com/thekitchen-agency/tka-vanilla-calendar/commit/be8228a4d49792f50865386ea6bd18b1dd198e1b))

# [1.1.0](https://github.com/thekitchen-agency/tka-vanilla-calendar/compare/v1.0.7...v1.1.0) (2026-04-15)


### Features

* add interactive playground, premium options, and gh-pages deployment ([38b0950](https://github.com/thekitchen-agency/tka-vanilla-calendar/commit/38b0950902276c2ae6bc4e1e2cb3403e02440c85))

## [1.0.7](https://github.com/thekitchen-agency/tka-vanilla-calendar/compare/v1.0.6...v1.0.7) (2026-04-15)


### Bug Fixes

* test ([801c05d](https://github.com/thekitchen-agency/tka-vanilla-calendar/commit/801c05d1d10afb0c66822deca15b2bf10de0d574))

# 1.0.0 (2026-04-15)


### Bug Fixes

* added semantic release ([4f7dc6a](https://github.com/thekitchen-agency/tka-vanilla-calendar/commit/4f7dc6a59d134d6a68abd42643552028efdc7656))
* fix semantic ([881cffe](https://github.com/thekitchen-agency/tka-vanilla-calendar/commit/881cffe01e5d115e9410870db4c767642584111c))

# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-04-14

### Fixed
- **Root Clipping Escaped**: Extracted the Tooltip DOM injection loop from `calendar.container` directly to `document.body`. This resolves edge cases where users placed the calendar inside custom `overflow: hidden` or `max-height` containers that mathematically chopped off the boundaries of absolute positioned modals.
- **Scroll Freezing**: Re-calculated Desktop Tooltip absolute positioning to map to `window.scrollY`. The Tooltip now automatically locks global `.body` scrollbars (`overflow: hidden`) whenever it is opened to block page bleeding.

## [1.0.3] - 2026-04-14

### Fixed
- Fixed critical CSS configuration where `tka-tooltip` container had infinite height, forcing internal lists `tka-tooltip-scrollable` out-of-bounds instead of activating native overflow scrollbars. Tooltips now appropriately scale up to `60vh` vertically max on Desktop, and `85vh` on Mobile.

## [1.0.2] - 2026-04-14

### Added
- Implemented smart-sampling for event `dots` rendering. If a day contains over 6 events, the core engine now isolates unique event types (`backgroundColor` definitions) to visually populate the preview dots *before* inserting duplicates. Ensures different categories of events are never fully visually hidden.
- If a specific day breaks past the 6-event maximum limit, clicking any dot on Desktop will now uniquely bypass the single-item hover view, and automatically open the full Bottom-Sheet Card List view spanning the parent day's items instead. Ensures Desktop users can view mathematically hidden UI rows just like Mobile.

## [1.0.1] - 2026-04-14

### Changed
- Complete structural overhaul of the Mobile Tooltip / Bottom Modal framework.
- Removed stacked hero-image styling for events, replacing it with a dense `flex-row` card format featuring `56x56` rounded preview thumbnails, right-aligned event tags, clamped content excerpts, and integrated hyperlinked chevrons `>`.
- Reconstructed the close button `(X)` into a semantic, static header component positioned via flex-flow, solving absolute positioning overlap glitches.

## [1.0.0] - 2026-04-14

### Added
- Initial build and release.
- Pure Javascript calendar engine bootstrapped with vanilla `.css`.
- Support for arrays full of highly-nested distinct event objects.
- `isMultiDay` continuous spanning ribbons calculating overlap depths.
- Mobile `<640px` breakpoint grid adjustments mutating rows, scaling single-day indicators, and compressing multi-day ribbons into micro-bars.
- Library Mode export system configured for NPM release formatting (`import`, `require`, and CSS extraction support).

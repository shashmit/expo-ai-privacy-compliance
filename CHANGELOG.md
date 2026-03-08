# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3] - 2026-03-09

### Changed
- Updated `integration-guide.md` to document the `ConsentGateProvider` + `useConsentGate()` integration flow.
- Added optional direct `ConsentFlow` usage guidance for manual sheet control.
- Clarified runtime prop references for `ConsentGateProvider`, `useConsentGate()`, and `ConsentFlow`.

## [0.1.2] - 2026-03-09

### Added
- Added `agreeButtonLabel` prop to `ConsentFlow` for custom button text.

### Changed
- Refactored `ConsentFlow` to remove redundant native alert confirmation for a smoother UX.
- Improved accessibility in `ConsentDisclosureCard` with better roles and labels.
- Centralized theme management in `src/theme.ts`.

## [0.1.1] - 2026-03-09

### Fixed
- Resolved peer dependency conflicts by moving `react` and `react-native` to `peerDependencies` only.
- Fixed `npm install` errors by pinning `devDependencies` versions for `react` and `react-native`.

## [0.1.0] - 2026-03-08

### Added
- Initial Expo React Native AI privacy compliance toolkit release
- Consent flow UI components
- Provider disclosure configuration utilities

### Changed
- Added publish configuration for npm public package release
- Added prepublish verification script
- Added repository .gitignore defaults
- Removed Vitest configuration and dependency

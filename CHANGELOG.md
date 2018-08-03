# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- #14: Improve performance when adding content to issues pages

## [0.2.1] - 2018-07-30
### Fixed
- #9: Only make requests to Bugzilla API on issues pages with Bugzilla links

## [0.2.0] - 2018-07-28
### Added
- Hoist Bugzilla links to top of issues page

### Changed
- Renamed to APT GitHub Improvements: it is simpler to maintain in one addon
and it's easier for the APT team to get new updates in one add-on.
  - Code for previous releases can be found at https://github.com/mcomella/github-story-points
- Requires `bugzilla.mozilla.org/rest` webRequest permission
- Relicensed from X11 to MPLv2

## [0.1.0] - 2018-05-30

### Added
- "Unlabeled" and "multiple label" counts

### Removed
- Unused api.github.com permission

## [0.0.1] - 2018-05-12
### Added
- Released as GitHub Story Points on addons.mozilla.org.
- Count the number of size S, M, and L labels

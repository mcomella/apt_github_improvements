# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Feature to adds links between PRs and the issues they reference (#4)
- Options page
- Ability to use GitHub access tokens for GitHub API calls

### Changed
- Requires storage permission to cache data from GitHub.
- Requires api.github.com webRequest permission to fetch data from GitHub.

## [0.3.0] - 2018-08-07
### Added
- #10: Add links to issue numbers in Pull Request titles on the PR page

### Fixed
- #13: Bugzilla bugs whose info could not be fetched will appear with the
correct bug number
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

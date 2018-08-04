# APT GitHub Improvements
The Android Product Team (APT) at Mozilla uses GitHub to develop their products and faces challenges with GitHub, both due to GitHub's existing functionality and the specifics of the APT workflow. APT GitHub Improvements is a browser extension that adds to the GitHub interface in order to address these problems.

[Available on addons.mozilla.org][AMO]

For an overview of how we decide which features make it into the project, see [Feature Philosophy].

Features for general GitHub users:
- [Link Issue Numbers in Pull Request titles](docs/features/link_issues_in_pr_titles.md)

Features for APT/Mozilla specifically (these will generally not appear when the user is not on APT/Mozilla repositories):
- [Story Points](docs/features/story_points.md)
- [Hoist Bugzilla bug links to the top of the issue](docs/features/hoist_bugzilla_bugs_to_top_of_issue.md)

### Project Resources
* Open issues: https://github.com/mcomella/apt_github_improvements/issues
* Documentation: https://github.com/mcomella/apt_github_improvements/tree/master/docs

## Differences from other solutions
This extension adds unique functionality for Mozilla/APT so there are no existing solutions for this functionality. However, when considering this extension's features that address a general GitHub audience, there is some overlap.

[Refined GitHub][rg] is a "browser extension that simplifies the GitHub interface and adds useful features" but has features that contradict APT GitHub Improvement's [Feature Philosophy]. Additionally, Refined GitHub requires you to be logged in and [has many dependencies][rg deps].

There are other solutions that add/change GitHub functionality but they generally address a single user problem that does not overlap in scope with APT GitHub Improvements.

## Development
Install the typescript compiler, `tsc`, with `npm` and build with:
```sh
tsc
```

Add the `-w` argument for continuous compilation. To run your add-on in Firefox,
you can load [a temporary add-on][temp addon].

Development with Visual Studio Code is recommended, given its awareness of Typescript types.

### Tests
The tests can be found in the `./spec` directory.

Install `jasmine` globally with `npm`. To build and run the tests:
```sh
tsc -p spec && jasmine
```

### Publishing
`dist/bundle.xpi` will be created after:
```sh
./publish.sh
```

## License
```
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
```

[hoister]: https://github.com/mcomella/github-issue-hoister
[typed]: https://github.com/DefinitelyTyped/DefinitelyTyped
[temp addon]: https://developer.mozilla.org/en-US/docs/Tools/about:debugging#Enabling_add-on_debugging
[AMO]: https://addons.mozilla.org/en-US/firefox/addon/apt-github-improvements/
[rg]: https://github.com/sindresorhus/refined-github/
[Feature Philosophy]: docs/feature_philosophy.md
[rg deps]: https://gist.github.com/mcomella/d99838853cffb22347cc34a1b553d6ba

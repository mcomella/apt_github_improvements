# APT GitHub Improvements
Soon available on addons.mozilla.org.

It comes with several features including:
- [Story Points](docs/feature_story_points.md)
- Hoist Bugzilla links in comments to the top of the issue

### Resources
* Open issues: https://github.com/mcomella/apt_github_improvements/issues
* Documentation: https://github.com/mcomella/apt_github_improvements/tree/master/docs

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

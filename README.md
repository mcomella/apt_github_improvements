# APT GitHub Improvements
Soon available on addons.mozilla.org.

It comes with several features including:
- Issue Hoister
- Story Points

## Development
Install the typescript compiler (through `npm`) and build with:
```sh
tsc
```

Add the `-w` argument for continuous compilation.

To test your code in Firefox, you can load [a temporary add-on][temp addon].

Development with Visual Studio Code is recommended, given its awareness of Typescript types.

### Publishing
`dist/bundle.xpi` will be created after:
```sh
./publish.sh
```

## License
This repository is licensed under the Mozilla Public License, version 2.0: see
`./LICENSE`.

[hoister]: https://github.com/mcomella/github-issue-hoister
[typed]: https://github.com/DefinitelyTyped/DefinitelyTyped
[temp addon]: https://developer.mozilla.org/en-US/docs/Tools/about:debugging#Enabling_add-on_debugging

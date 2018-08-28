#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# via https://unix.stackexchange.com/a/155077
if output=$(git status --porcelain) && [ -n "$output" ]; then
    # Uncommitted changes
    echo "Uncommited changes: exiting."
    exit 1
fi

rm -rf dist/
mkdir dist/

# test also runs build.
npm test && \
    zip -r -FS dist/bundle.xpi \
        dist/src/ \
        LICENSE \
        README.md \
        manifest.json

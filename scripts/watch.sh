#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# via https://unix.stackexchange.com/a/107405
trap killgroup SIGINT

killgroup() {
    kill 0
}

./scripts/build_supplement.sh
tsc -p src/contentScript -w &
tsc -p src/options -w &
wait

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

namespace Log {
    const LOGTAG = 'apt_github_improvements';

    export function d(msg: string) { _log(msg, console.debug); }
    export function l(msg: string) { _log(msg, console.log); }
    export function w(msg: string) { _log(msg, console.warn); }
    export function e(msg: string) { _log(msg, console.error); }

    function _log(msg: string, fn: Function) {
        fn(`${LOGTAG}: ${msg}`);
    }
}

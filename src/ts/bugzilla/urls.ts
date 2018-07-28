/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

namespace BugzillaURLs {

    const REGEX_BZ_URL = /^https?:\/\/bugzilla\.mozilla\.org/
    // sample: https://bugzilla.mozilla.org/show_bug.cgi?id=1471868
    const REGEX_BZ_URL_BUG_NUMBER = /^https?:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=([0-9]+)/

    export function is(url: string): boolean {
        return REGEX_BZ_URL.test(url);
    }

    export function getBugNumber(url: string): number | null {
        const match = url.match(REGEX_BZ_URL_BUG_NUMBER);
        if (match && match[1]) {
            return parseInt(match[1]);
        }

        return null;
    }
}

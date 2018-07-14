/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

namespace GithubPage {

    const MILESTONE_REGEX = '^/.+/.+/milestone/[0-9]+'
    export function isMilestone(location: Location): boolean {
        return !!location.pathname.match(MILESTONE_REGEX);
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The GithubPage namespace', () => {

    it('can identify milestone pages', () => {
        const location = { pathname: '/mozilla-mobile/firefox-tv/milestone/13' } as Location;
        expect(GithubPage.isMilestone(location)).toBeTruthy();
    });

    it('will not identify the issues list as a milestone page', () => {
        const location = { pathname: '/mozilla-mobile/firefox-tv/issues' } as Location;
        expect(GithubPage.isMilestone(location)).toBeFalsy();
    });

});

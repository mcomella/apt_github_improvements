/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The Bugzilla namespace', () => {

    it('can identify bugzilla urls', () => {
        [
            'https://bugzilla.mozilla.org',
            'http://bugzilla.mozilla.org',
            'https://bugzilla.mozilla.org/show_bug.cgi?id=1471868#c0'
        ].forEach(url => {
            expect(BugzillaURLs.is(url)).toBeTruthy(url);
        });
    });

    it('can identify non-bugzilla urls', () => {
        [
            'https://mozilla.org',
            'https://bugzilla.org',
            'https://fsf.org',
        ].forEach(url => {
            expect(BugzillaURLs.is(url)).toBeFalsy(url);
        });
    });

    it('can extract bug numbers from bugzilla urls', () => {
        [
            'https://bugzilla.mozilla.org/show_bug.cgi?id=1471868',
            'https://bugzilla.mozilla.org/show_bug.cgi?id=1471868#c0',
        ].forEach(url => {
            expect(BugzillaURLs.getBugNumber(url)).toBe(1471868);
        });
    });

    it('gets null when extracting bug numbers from non-bugzilla urls', () => {
        [
            'https://bugzilla.mozilla.org/',
            'https://fsf.org',
            'https://bugzilla.mozilla.org/buglist.cgi?quicksearch=firefox',
        ].forEach(url => {
            expect(BugzillaURLs.getBugNumber(url)).toBeFalsy(url);
        });
    });
});

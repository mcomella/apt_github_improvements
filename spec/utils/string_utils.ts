/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('StringUtils', () => {

    it('can identify blank strings', () => {
        [
            '   ',
            '',
        ].forEach(str => {
            expect(StringUtils.isBlank(str)).toBeTruthy(str);
        });
    });

    it('can identify non-blank strings', () => {
        [
            'https://mozilla.org',
            'https://bugzilla.org',
            'https://fsf.org',
            ' http ',
            ' h ',
            ' . ',
        ].forEach(str => {
            expect(StringUtils.isBlank(str)).toBeFalsy(str);
        });
    });
});

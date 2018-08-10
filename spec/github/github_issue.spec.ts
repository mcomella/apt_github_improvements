/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The GitHubIssue namespace', () => {

    describe('has an issue number regex that', () => {
        it('can identify if an issue number is present or not', () => {
            const regexResult = GithubIssue.REGEX_NUMBER.test('Issue #10: Open issue');
            expect(regexResult).toBeTruthy();
        });

        it('can find the index of an issue number (starting at #)', () => {
            const regexResult = 'Issue #10: Open issue'.search(GithubIssue.REGEX_NUMBER);
            expect(regexResult).toBe(6);
        });

        it('can capture', () => {
            const regexResult = 'Issue #10: Open issue'.match(GithubIssue.REGEX_NUMBER);
            expect(regexResult).toBeTruthy();
            expect(regexResult!.length).toBeGreaterThanOrEqual(2);
            expect(regexResult![0]).toBe('#10');
            expect(regexResult![1]).toBe('10');
        });

        it('will not match a number without a #', () => {
            const regexResult = GithubIssue.REGEX_NUMBER.test('Issue 10: Open issue');
            expect(regexResult).toBeFalsy()
        });
    });

    describe('will extract issue numbers from a string', () => {
        it('unsuccessfully if there are no numbers', () => {
            const titles = [
                'Title',
                'A simple title',
                'This is cool #hashtag',
                'ABC easy as 123',
                'This is #e3 right?'
            ];
            titles.forEach(title => {
                const actualValue = GithubIssue.getNumsFromStr(title);
                expect(actualValue.size).toEqual(0);
            })
            expect(GithubIssue.getNumsFromStr(''))
        });

        it('successfully with "Issue" notation', () => {
            const actualValue = GithubIssue.getNumsFromStr('Issue #345: Add readme.');
            expect(actualValue.size).toEqual(1);
            expect(actualValue).toContain(345)
        });

        it('successfully with "Closes" notation', () => {
            const actualValue = GithubIssue.getNumsFromStr('Closes #345: Add readme.');
            expect(actualValue.size).toEqual(1);
        ;   expect(actualValue).toContain(345)
        });

        it('successfully with trailing notation', () => {
            const actualValue = GithubIssue.getNumsFromStr('Add readme. (#345)');
            expect(actualValue.size).toEqual(1);
            expect(actualValue).toContain(345);
        });

        it('successfully for multiple issue numbers', () => {
            const actualValue = GithubIssue.getNumsFromStr('Closes #345, Closes #567: Add readme.');
            expect(actualValue.size).toEqual(2);
            expect(actualValue).toContain(345);
            expect(actualValue).toContain(567);
        })
    });
});

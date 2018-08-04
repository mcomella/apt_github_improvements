/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The GitHubURLs namespace', () => {

    it('can create a url from an issue number', () => {
        const owner = 'mozilla';
        const repo = 'firefox';
        const issueNumber = 10;
        const expected = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;

        const actual = GithubURLs.issueFromNumber(owner, repo, issueNumber);
        expect(actual).toBe(expected);
    });
});

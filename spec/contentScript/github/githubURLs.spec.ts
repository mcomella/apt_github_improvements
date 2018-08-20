/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface Location {
    pathname: string;
}

describe('The GitHubURLs namespace', () => {

    it('can create a url from an issue number', () => {
        const owner = 'mozilla';
        const repo = 'firefox';
        const issueNumber = 10;
        const expected = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;

        const actual = GithubURLs.issueFromNumber(owner, repo, issueNumber);
        expect(actual).toBe(expected);
    });

    it('can create a url from a pr number', () => {
        const owner = 'mozilla';
        const repo = 'firefox';
        const prNumber = 10;
        const expected = `https://github.com/${owner}/${repo}/pull/${prNumber}`;

        const actual = GithubURLs.prFromNumber(owner, repo, prNumber);
        expect(actual).toBe(expected);
    });

    describe('when getting a PR number from a URL', () => {
        it('will get a number for a PR URL', () => {
            const location = {pathname: '/mozilla-mobile/focus-android/pull/3091'} as Location;
            const actual = GithubURLs.getPRNumberFromURL(location);
            expect(actual).toBe(3091);
        });

        it('will get null for an issue URL', () => {
            const location = {pathname: '/mozilla-mobile/focus-android/issues/3108'} as Location;
            const actual = GithubURLs.getPRNumberFromURL(location);
            expect(actual).toBeNull();
        });
    });

    describe('when getting an issue number from a URL', () => {
        it('will get a number for an issue Location', () => {
            const location = {pathname: '/mozilla-mobile/focus-android/issues/3108'} as Location;
            const actual = GithubURLs.getIssueNumberFromLocation(location);
            expect(actual).toBe(3108);
        });

        it('will get null for a PR Location', () => {
            const location = {pathname: '/mozilla-mobile/focus-android/pull/3091'} as Location;
            const actual = GithubURLs.getIssueNumberFromLocation(location);
            expect(actual).toBeNull();
        });

        it('will get a number for an issue element', () => {
            const element = {
                pathname: '/mozilla-mobile/focus-android/issues/3108',
            } as HTMLAnchorElement;
            const actual = GithubURLs.getIssueNumberFromAnchor(element);
            expect(actual).toBe(3108);
        });

        it('will get null for a PR element', () => {
            const element = {
                pathname: '/mozilla-mobile/focus-android/pull/3091',
            } as HTMLAnchorElement;
            const actual = GithubURLs.getIssueNumberFromAnchor(element);
            expect(actual).toBeNull();
        });
    });
});

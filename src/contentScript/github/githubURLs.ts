/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Helpers for manipulating GitHub URLs. */
namespace GithubURLs {

    const RE_ISSUE_URL = /issues\/(\d+)$/;
    const RE_PR_URL = /pull\/(\d+)$/;

    export function issueFromNumber(owner: string, repo: string, issueNumber: number): string {
        return `${getBaseURL(owner, repo)}/issues/${issueNumber}`;
    }

    export function prFromNumber(owner: string, repo: string, prNum: number): string {
        return `${getBaseURL(owner, repo)}/pull/${prNum}`;
    }

    function getBaseURL(owner: string, repo: string): string {
        return `https://github.com/${owner}/${repo}`;
    }

    // sample: https://github.com/mcomella/apt_github_improvements/issues/4
    export function getIssueNumberFromLocation(url: Location): number | null {
        return getIssueNumberFromPathname(url.pathname);
    }

    export function getIssueNumberFromAnchor(anchorElement: HTMLAnchorElement): number | null {
        return getIssueNumberFromPathname(anchorElement.pathname);
    }

    function getIssueNumberFromPathname(pathname: string): number | null {
        const match = pathname.match(RE_ISSUE_URL);
        if (!match) { return null; }
        return parseInt(match[1]);
    }

    // sample: https://github.com/mozilla-mobile/focus-android/pull/3091
    export function getPRNumberFromURL(url: Location): number | null {
        const match = url.pathname.match(RE_PR_URL);
        if (!match) { return null; }
        return parseInt(match[1]);
    }
}

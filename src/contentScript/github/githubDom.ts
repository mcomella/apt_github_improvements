/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Helpers for manipulating GitHub's issues DOM.
 */
namespace GithubDOMIssue {

    export const SELECTOR_ISSUE_TITLE = '.js-issue-title';

    // Some intuitive selectors will include non-visible comments like the
    // new comment field or the comment edit box.
    export const SELECTOR_COMMENT_VISIBLE = '.unminimized-comment';
    export const SELECTOR_COMMENT_BODY_VISIBLE = `${SELECTOR_COMMENT_VISIBLE} .comment-body`;

    export function getTitleElement() {
        return document.querySelector(SELECTOR_ISSUE_TITLE) as HTMLSpanElement | null;
    }
}

namespace GithubDOMPR {

    export function getCommitMsgElements() {
        return document.querySelectorAll('.commit-message') as NodeListOf<HTMLDivElement> | null;
    }

    export function extractReferencedIssues(): Set<number> {
        const titleIssues = extractIssuesFromTitle();
        const commitIssues = extractIssuesFromCommits();

        titleIssues.unionMutate(commitIssues);
        return titleIssues;
    }

    function extractIssuesFromTitle(): Set<number> {
        const titleElement = GithubDOMIssue.getTitleElement();
        if (!titleElement) { return new Set(); }
        return GithubParser.getNumsFromStr(titleElement.innerText);
    }

    function extractIssuesFromCommits(): Set<number> {
        const commitMsgElements = getCommitMsgElements();
        if (!commitMsgElements) { return new Set(); }

        let issueNums = new Set();
        commitMsgElements.forEach(e => {
            const issueNumsInCommit = GithubParser.getNumsFromStr(e.innerText);
            issueNums.unionMutate(issueNumsInCommit);
        });
        return issueNums;
    }
}

namespace GithubDOMIssueList {

    export const SELECTOR_EMPTY_CONTAINER = '.blankslate';

    export const SELECTOR_ISSUE_ROW = '.js-issue-row';
    export const SELECTOR_ISSUE_ROW_LINK = '.js-navigation-open';

    export function forEachIssue(block: (issueElement: HTMLLIElement) => void) {
        document.querySelectorAll(SELECTOR_ISSUE_ROW).forEach(e => {
            block(e as HTMLLIElement);
        });
    }
}

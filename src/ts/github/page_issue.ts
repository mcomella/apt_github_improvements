/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Helpers for manipulating GitHub's issues pages.
 */
namespace GithubPageIssue {

    export const SELECTOR_ISSUE_TITLE = '.js-issue-title';

    // Some intuitive selectors will include non-visible comments like the
    // new comment field or the comment edit box.
    export const SELECTOR_COMMENT_VISIBLE = '.unminimized-comment';
    export const SELECTOR_COMMENT_BODY_VISIBLE = `${SELECTOR_COMMENT_VISIBLE} .comment-body`;

    export function getTitleElement() {
        return document.querySelector(SELECTOR_ISSUE_TITLE) as HTMLSpanElement;
    }
}

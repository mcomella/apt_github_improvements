/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Encapsulates functionality for blocking until page is ready. */
namespace GithubPageReadyWaiter {

    type PageReadyGetter = (() => boolean)

    export async function await(): Promise<void> {
        let isPageReadyGetter: PageReadyGetter | undefined = undefined;
        if (PageDetect.isMilestone()) {
            isPageReadyGetter = isMilestoneReady;
        }

        if (!isPageReadyGetter) {
            return Promise.resolve();
        }

        return awaitPageReady(isPageReadyGetter);
    }

    function awaitPageReady(isPageReadyGetter: PageReadyGetter): Promise<void> {
        return new Promise<void>(resolve => {
            let intervalID = window.setInterval(() => {
                if (isPageReadyGetter) {
                    window.clearInterval(intervalID);
                    resolve();
                }
            }, 1000);
        });
    }

    function isMilestoneReady(): boolean {
        return document.querySelector(GithubDOMIssueList.SELECTOR_ISSUE_ROW) != undefined || // issues loaded
                document.querySelector(GithubDOMIssueList.SELECTOR_EMPTY_CONTAINER) != undefined; // or empty.
    }
}

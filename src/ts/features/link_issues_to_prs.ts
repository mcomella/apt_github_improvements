/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * todo
 */
namespace FeatureLinkIssuesToPRs {

    export function inject(containerElement: HTMLDivElement, referencedIssuesInPR: Set<number>) {
        if (PageDetect.isPR()) {
            injectPRPage(referencedIssuesInPR);
        } else if (PageDetect.isIssue()) {
            injectIssuePage();
        }
    }

    function injectPRPage(referencedIssue: Set<number>) {
    }

    function injectIssuePage() {

    }
}

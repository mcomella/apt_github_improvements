/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * todo
 */
namespace FeatureLinkIssuesToPRs {

    export function inject(containerElement: HTMLDivElement) {
        if (PageDetect.isPR()) {
            injectPRPage();
        } else if (PageDetect.isIssue()) {
            injectIssuePage();
        }
    }

    function injectPRPage() {
        GithubDOMPR.extractReferencedIssues();
        // store in DB
        // inject in dom
    }

    function injectIssuePage() {

    }
}

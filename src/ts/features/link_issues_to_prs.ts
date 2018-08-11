/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * todo
 */
namespace FeatureLinkIssuesToPRs {

    export function inject(containerElement: HTMLDivElement, referencedIssuesInPR: Set<number>) {
        if (PageDetect.isPR()) {
            injectPRPage(containerElement, referencedIssuesInPR);
        } else if (PageDetect.isIssue()) {
            injectIssuePage();
        }
    }

    function injectPRPage(containerElement: HTMLDivElement, referencedIssues: Set<number>) {
        if (referencedIssues.size <= 0) { return; }

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const title = 'Issues referenced in this PR:';
        const issues = Array.from(referencedIssues);
        const docFrag = DOM.getTitleLinkList(title, issues, (linkElement: HTMLAnchorElement, issueNum: number) => {
            linkElement.text = '#' + issueNum;
            linkElement.href = GithubURLs.issueFromNumber(ownerName, repoName, issueNum);
        });

        containerElement.appendChild(docFrag);
    }

    function injectIssuePage() {

    }
}

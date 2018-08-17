/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * todo
 */
namespace FeatureLinkIssuesToPRs {

    export async function inject(containerElement: HTMLDivElement, referencedIssuesInPR: Set<number>): Promise<void> {
        if (PageDetect.isPR()) {
            injectPRPage(containerElement, referencedIssuesInPR);
        } else if (PageDetect.isIssue()) {
            await injectIssuePage(containerElement);
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

    async function injectIssuePage(containerElement: HTMLDivElement) {
        const pageIssueNum = GithubURLs.getIssueNumberFromURL(window.location);
        if (!pageIssueNum) {
            Log.e('Unable to get issue number from URL');
            return;
        }

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const store = await GithubStore.get(ownerName, repoName);
        const prsForIssue = await store.getIssueToPRs(pageIssueNum);
        if (prsForIssue.size <= 0) { return; }

        const prsArray = Array.from(prsForIssue);
        const docFrag = DOM.getTitleLinkList('PRs which reference this issue:', prsArray, (linkElement: HTMLAnchorElement, prNum: number) => {
            linkElement.text = `#${prNum}`;
            linkElement.href = GithubURLs.prFromNumber(ownerName, repoName, prNum);
        });

        containerElement.appendChild(docFrag);
    }
}

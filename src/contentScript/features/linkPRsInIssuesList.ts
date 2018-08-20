/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * If a PR references an issue, creates a reference to that PR
 * on that issue in an issues list.
 */
namespace FeatureLinkPRsInIssuesList {

    export async function inject() {
        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const store = await GithubStore.get(ownerName, repoName);
        GithubDOMIssueList.forEachIssue(async issueElement => {
            const issueNum = getIssueNumFromIssueElement(issueElement);
            const prs = await store.getIssueToPRs(issueNum);
            if (prs.size >= 1) {
                addPRLinkToIssue(ownerName, repoName, issueElement, prs);
            }
        });
    }

    function getIssueNumFromIssueElement(issueElement: HTMLElement): number {
        const issueLinkElement = issueElement.querySelector(
            GithubDOMIssueList.SELECTOR_ISSUE_ROW_LINK) as HTMLAnchorElement;
        return GithubURLs.getIssueNumberFromAnchor(issueLinkElement)!;
    }

    function addPRLinkToIssue(owner: string, repo: string, issueElement: HTMLLIElement,
            prNums: Set<number>) {
        var prOne: number = 0;
        for (let prNum of prNums) {
            prOne = prNum;
        }

        const prLinkElement = document.createElement('a');
        prLinkElement.href = GithubURLs.prFromNumber(owner, repo, prOne);
        prLinkElement.text = `PR #${prOne}`;

        const prLinkContainer = document.createElement('div');
        prLinkContainer.appendChild(prLinkElement);

        const injectElement = issueElement.querySelector('.float-right .float-right') as HTMLDivElement;
        injectElement.appendChild(prLinkContainer);
    }
}

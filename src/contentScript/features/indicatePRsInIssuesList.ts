/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * If a PR references an issue, creates a reference to that PR
 * on that issue in an issues list.
 */
namespace FeatureIndicatePRsInIssuesList {

    const CLASS_CONTAINER = `${Main.CLASS_CONTAINER_PREFIX}_prLinks`;

    export async function inject() {
        removeAddedContainers();

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const store = await GithubStore.get(ownerName, repoName);
        GithubDOMIssueList.forEachIssue(async issueElement => {
            const issueNum = getIssueNumFromIssueElement(issueElement);
            const prs = await store.getIssueToPRs(issueNum);
            addPRLinkToIssue(ownerName, repoName, issueElement, prs);
        });
    }

    function removeAddedContainers() {
        document.querySelectorAll(`.${CLASS_CONTAINER}`).forEach(e => e.remove());
    }

    function getIssueNumFromIssueElement(issueElement: HTMLElement): number {
        const issueLinkElement = issueElement.querySelector(
            GithubDOMIssueList.SELECTOR_ISSUE_ROW_LINK) as HTMLAnchorElement;
        return GithubURLs.getIssueNumberFromAnchor(issueLinkElement)!;
    }

    function addPRLinkToIssue(owner: string, repo: string, issueElement: HTMLLIElement,
            prNums: Set<number>) {
        if (prNums.size === 0) {
            return;
        }

        let prElement: HTMLElement;
        if (prNums.size === 1) {
            const prNum = prNums.values().next().value;
            const prLinkElement = document.createElement('a');
            prLinkElement.href = GithubURLs.prFromNumber(owner, repo, prNum);
            prLinkElement.text = `PR #${prNum}`;
            prElement = prLinkElement;
        } else {
            prElement = document.createElement('span');
            prElement.textContent = 'PR > 1';
        }

        const prLinkContainer = document.createElement('div');
        prLinkContainer.classList.add(CLASS_CONTAINER);
        prLinkContainer.appendChild(prElement);

        // This is the element on the right that displays the number of comments.
        const injectElement = issueElement.querySelector('.float-right .float-right') as HTMLDivElement;
        injectElement.appendChild(prLinkContainer);
    }
}

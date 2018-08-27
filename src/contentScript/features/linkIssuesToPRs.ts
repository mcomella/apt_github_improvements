/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Creates a link from PRs to the issues they reference and vice versa.
 */
namespace FeatureLinkIssuesToPRs {

    export async function inject(containerElement: HTMLDivElement, referencedIssuesInPR: Set<number>): Promise<void> {
        if (PageDetect.isPR()) {
            injectPRPage(containerElement, referencedIssuesInPR);
        } else if (PageDetect.isIssue()) {
            await injectIssuePage(containerElement);
        }
    }

    async function injectPRPage(containerElement: HTMLDivElement, referencedIssues: Set<number>) {
        if (referencedIssues.size <= 0) { return; }

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const title = 'Issues addressed in this PR';
        const issues = Array.from(referencedIssues);
        const docFrag = DOM.getTitleLinkList(title, issues, (linkElement: HTMLAnchorElement, issueNum: number) => {
            linkElement.text = '#' + issueNum;
            linkElement.href = GithubURLs.issueFromNumber(ownerName, repoName, issueNum);
        }, await newAnnotation());

        containerElement.appendChild(docFrag);
    }

    async function injectIssuePage(containerElement: HTMLDivElement) {
        const pageIssueNum = GithubURLs.getIssueNumberFromLocation(window.location);
        if (!pageIssueNum) {
            Log.e('Unable to get issue number from URL');
            return;
        }

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const store = await GithubStore.get(ownerName, repoName);
        const prsForIssue = await store.getIssueToPRs(pageIssueNum);
        if (prsForIssue.size <= 0) { return; }

        const prsArray = Array.from(prsForIssue);
        const docFrag = DOM.getTitleLinkList('PRs which address this issue', prsArray, (linkElement: HTMLAnchorElement, prNum: number) => {
            linkElement.text = `#${prNum}`;
            linkElement.href = GithubURLs.prFromNumber(ownerName, repoName, prNum);
        }, await newAnnotation());

        containerElement.appendChild(docFrag);
    }

    async function newAnnotation(): Promise<DocumentFragment> {
        const frag = document.createDocumentFragment();

        const howElement = document.createElement('a');
        howElement.innerText = 'how?';
        howElement.href = 'https://github.com/mcomella/apt_github_improvements/blob/master/docs/features/link_issues_to_prs.md#criteria-for-prs-that-address-issues';
        frag.appendChild(howElement);

        const accessToken = await OptionsStore.getPersonalAccessToken();
        if (!accessToken.trim()) {
            frag.appendChild(document.createTextNode(', '));

            const tokenElement = document.createElement('a');
            tokenElement.innerText = 'tip - add an access token';
            tokenElement.href = 'https://github.com/mcomella/apt_github_improvements/blob/master/docs/add_an_access_token.md';
            frag.appendChild(tokenElement);
        }

        return frag;
    }
}

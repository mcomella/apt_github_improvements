/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function onPageLoad() { // Called by github_navigation.js.
    Main.onPageLoad();
}

namespace Main {
    const ID_CONTAINER = 'webext-apt_github_improvements_container';

    export async function onPageLoad() {
        // The DOM doesn't refresh on reload so we have to
        // manually remove added nodes ourselves.
        removeAnyAddonContainers();

        const Page = PageDetect;
        let referencedIssuesInPR = new Set<number>();
        if (Page.isPR()) {
            referencedIssuesInPR = GithubDOMPR.extractReferencedIssues();
            await storeReferencedIssuesInPR(referencedIssuesInPR); // synchronous so later calls can use DB.

            FeatureLinkIssuesInPRTitles.inject()
        }

        if (Page.isIssue() || Page.isPR()) {
            const preDiscussionsContainer = createContainer();
            FeatureLinkIssuesToPRs.inject(preDiscussionsContainer, referencedIssuesInPR);
            await FeatureBugzillaHoistBugLinks.inject(preDiscussionsContainer);
            injectPreDiscussionsContainer(preDiscussionsContainer);
        }

        if (Page.isMilestone()) {
            FeatureStoryPoints.inject();
        }
    }

    async function storeReferencedIssuesInPR(referencedIssuesInPR: Set<number>): Promise<void> {
        const prNumber = GithubURLs.getPRNumberFromURL(window.location);
        if (!prNumber) {
            Log.e('Unable to retrieve PR number from URL');
            return;
        }

        const issuesToPRs = {} as NumToNumSet;
        referencedIssuesInPR.forEach(issueNum => {
            issuesToPRs[issueNum] = new Set([prNumber]);
        });

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const store = await GithubStore.getStore(ownerName, repoName);
        return store.mergeIssueToPRs(issuesToPRs);
    }

    function removeAnyAddonContainers() {
        const container = document.getElementById(ID_CONTAINER);
        if (container) {
            container.remove();
        }
    }

    function createContainer() {
        const container = document.createElement('div');
        container.id = ID_CONTAINER;
        return container;
    }

    function injectPreDiscussionsContainer(container: HTMLDivElement) {
        const discussionsElement = document.querySelector('#discussion_bucket') as HTMLDivElement | null;
        if (discussionsElement && discussionsElement.parentNode) {
            discussionsElement.parentNode.insertBefore(container, discussionsElement);
        }
    }
}

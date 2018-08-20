/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function onPageLoad() { // Called by github_navigation.js.
    Main.onPageLoad();
}

interface PageState {
    referencedIssuesInPR: Set<number>;
}

namespace Main {
    const ID_CONTAINER = 'webext-apt_github_improvements_container';
    export const CLASS_CONTAINER_PREFIX = 'webext-apt_github_improvements';

    export async function onPageLoad() {
        // The DOM doesn't refresh on reload so we have to
        // manually remove added nodes ourselves.
        removeAnyAddonContainers();

        const pageState = await synchronizeState();
        await GithubPageReadyWaiter.await();
        injectFeatures(pageState);
    }

    async function injectFeatures(pageState: PageState) {
        if (PageDetect.isPR()) {
            FeatureLinkIssuesInPRTitles.inject();

        } else if (PageDetect.isMilestone()) {
            FeatureStoryPoints.inject();
        }

        if (PageDetect.isIssue() || PageDetect.isPR()) {
            const preDiscussionsContainer = createContainer();

            FeatureLinkIssuesToPRs.inject(preDiscussionsContainer, pageState.referencedIssuesInPR);
            await FeatureBugzillaHoistBugLinks.inject(preDiscussionsContainer);

            injectPreDiscussionsContainer(preDiscussionsContainer);
        }

        if (PageDetect.isIssueList() || PageDetect.isMilestone()) {
            FeatureIndicatePRsInIssuesList.inject();
        }
    }

    /**
     * Synchronizes add-on state with GitHub's internal state, e.g.
     * by scraping pages or making requests to the GitHub API.
     */
    async function synchronizeState(): Promise<PageState> {
        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        let referencedIssuesInPR = new Set<number>();
        if (PageDetect.isPR()) {
            referencedIssuesInPR = GithubDOMPR.extractReferencedIssues();
            await storeReferencedIssuesInPR(referencedIssuesInPR);

        } else if (PageDetect.isIssue() ||
                PageDetect.isIssueList() ||
                PageDetect.isMilestone()) {
            const synchronizer = await GithubSynchronizer.get(ownerName, repoName);
            await synchronizer.maybeSynchronizeOpenPRs();
        }

        return {
            referencedIssuesInPR: referencedIssuesInPR,
        };
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
        const store = await GithubStore.get(ownerName, repoName);
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

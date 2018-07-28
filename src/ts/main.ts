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
        if (Page.isIssue() || Page.isPR()) {
            const preDiscussionsContainer = injectPreDiscussionsContainer();
            await FeatureLinkBugzillaBugs.inject(preDiscussionsContainer);
        }

        if (Page.isMilestone()) {
            FeatureStoryPoints.inject();
        }
    }

    function removeAnyAddonContainers() {
        const container = document.getElementById(ID_CONTAINER);
        if (container) {
            container.remove();
        }
    }

    function injectPreDiscussionsContainer() {
        const container = document.createElement('div');
        container.id = ID_CONTAINER;

        const discussionsElement = document.querySelector('#discussion_bucket') as HTMLDivElement | null;
        if (discussionsElement && discussionsElement.parentNode) {
            discussionsElement.parentNode.insertBefore(container, discussionsElement);
        }

        return container;
    }
}

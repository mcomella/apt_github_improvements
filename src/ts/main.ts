/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function onPageLoad() { // Called by github_navigation.js.
    const Page = PageDetect;

    if (Page.isIssue() || Page.isPR()) {
        FeatureLinkBugzillaBugs.inject();
    }

    if (Page.isMilestone()) {
        FeatureStoryPoints.inject();
    }
}

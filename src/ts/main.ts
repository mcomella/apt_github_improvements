/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface Feature {
    inject: Function,
}

function onPageLoad() { // Called by github_navigation.js.
    // We define this array inside this function to ensure they've been defined
    // by now (since this function is the last to get called).
    const REGISTERED_FEATURES: [Feature] = [
        FeatureStoryPoints,
    ]

    REGISTERED_FEATURES.forEach(feature => {
        feature.inject();
    });
}

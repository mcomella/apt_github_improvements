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

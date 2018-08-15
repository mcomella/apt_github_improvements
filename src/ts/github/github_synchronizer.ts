/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Synchronizes data from GitHub with the add-on, e.g. scraping
 * pages or accessing the GitHub API.
 */
class GithubSynchronizer {

    static async get(owner: string, repo: string) {
        const store = await GithubStore.get(owner, repo);
        const fetchChecker = new GithubFetchChecker(store);
        return new GithubSynchronizer(owner, repo, store, fetchChecker);
    }

    private readonly owner: string;
    private readonly repo: string;

    private readonly store: GithubStore;
    private readonly fetchChecker: GithubFetchChecker;

    protected constructor(owner: string, repo: string, store: GithubStore, fetchChecker: GithubFetchChecker) {
        this.owner = owner;
        this.repo = repo;
        this.store = store;
        this.fetchChecker = fetchChecker;
    }

    // todo: this function will be really complex and hard to test: how to break apart?
    // todo: test githubEndpoint, especially error handling.
    async maybeSynchronizeOpenPRs(): Promise<void> {
        const now = new Date();
        if (!(await this.fetchChecker.isOpenPRsFetchReady(now))) { return; }

        let openPRs: GithubEndpoint.PR[];
        try {
            openPRs = await GithubEndpoint.fetchOpenPRs(this.owner, this.repo);
        } catch (e) {
            Log.w(`Cannot synchronize: unable to fetch open PR list. ${e}`);
            return;
        }

        const fetchReadyPRs = await this.fetchChecker.filterPRsFetchReady(openPRs, now);

        // If there are fetch errors, individual PRs may be dropped.
        const fetchedPRs = await GithubEndpoint.fetchPRsCommits(fetchReadyPRs);
        const newIssuesToPRs = this.transformFetchedPRsToIssuesToPRs(fetchedPRs);
        this.store.mergeIssueToPRs(newIssuesToPRs); // Sets last merge on PRs.

        await this.store.setRepoOpenPRLastFetchMillis(now);
    }

    private transformFetchedPRsToIssuesToPRs(prs: GithubEndpoint.PRWithCommits[]): NumToNumSet {
        const issuesToPRs = {} as NumToNumSet;
        return issuesToPRs
    }
}

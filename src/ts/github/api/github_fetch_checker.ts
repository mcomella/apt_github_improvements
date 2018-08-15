/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Checks if we're ready to fetch from the endpoint.  */
class GithubFetchChecker {

    private static readonly OPEN_PR_BETWEEN_FETCH_MILLIS = 5 /* min */ * 60 /* to sec */ * 1000; /* to millis */
    private static readonly PR_BETWEEN_UPDATE_MILLIS = 45 /* min */ * 60 /* to sec */ * 1000; /* to millis */

    private readonly store: GithubStore;

    constructor(store: GithubStore) {
        this.store = store;
    }

    async isOpenPRsFetchReady(now: Date): Promise<boolean> {
        const lastUpdateMillis = await this.store.getRepoOpenPRLastFetchMillis();
        if (!lastUpdateMillis) {
            return true;
        }
        const nextUpdateMillis = lastUpdateMillis.getTime() + GithubFetchChecker.OPEN_PR_BETWEEN_FETCH_MILLIS;
        return nextUpdateMillis <= now.getTime();
    }

    async isPRFetchReady(prNum: number, now: Date): Promise<boolean> {
        const lastUpdateMillis = await this.store.getPRLastUpdatedMillis(prNum);
        if (!lastUpdateMillis) {
            return true;
        }
        const nextUpdateMillis = lastUpdateMillis.getTime() + GithubFetchChecker.PR_BETWEEN_UPDATE_MILLIS;
        return nextUpdateMillis <= now.getTime();
    }

    async filterPRsFetchReady<T extends GithubFetchChecker.PR>(prs: T[], now: Date): Promise<T[]> {
        const isPRReadyToSyncColl = await Promise.all(prs.map(pr => this.isPRFetchReady(pr.number, now)));
        return prs.filter((_, i) => { return isPRReadyToSyncColl[i]; });
    }
}

namespace GithubFetchChecker {
    export interface PR {
        number: number,
    }
}

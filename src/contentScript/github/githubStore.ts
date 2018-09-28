/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type StorageArea = browser.storage.StorageArea;

/** Persisted data from GitHub. */
class GithubStore {

    static async get(owner: string, repo: string): Promise<GithubStore> {
        const store = new GithubStore(owner, repo, browser.storage.local);
        await store.maybeUpgrade();
        return store;
    }

    private static readonly PREFIX_KEY = 'ghs';
    private static readonly PREFIX_ISSUE_TO_PRS = `${GithubStore.PREFIX_KEY}-issue`;
    private static readonly PREFIX_PR_LAST_UPDATED = `${GithubStore.PREFIX_KEY}-prLastUpdate`;
    private static readonly PREFIX_REPO_OPEN_PR_LAST_FETCH = `${GithubStore.PREFIX_KEY}-openPRLastFetch`;

    protected static readonly DB_VERSION = 3;
    protected static readonly KEY_DB_VERSION = `${GithubStore.PREFIX_KEY}-v`

    private static readonly RE_KEY_ISSUE_TO_PR = /([0-9]+)$/

    private readonly ownerRepo: string;
    private readonly storage: StorageArea;

    protected constructor(owner: string, repo: string, storage: StorageArea) {
        this.ownerRepo = `${owner}/${repo}`;
        this.storage = storage;
    }

    protected async maybeUpgrade() { this.maybeUpgradeToVersion(GithubStore.DB_VERSION); }

    protected async maybeUpgradeToVersion(newVersion: number) {
        const keyVersion = GithubStore.KEY_DB_VERSION;
        const currentVersion = (await this.storage.get(keyVersion))[keyVersion] as number | undefined;
        if (currentVersion !== newVersion) {
            if (currentVersion) {
                await this.upgrade(currentVersion, newVersion);
            }

            await this.storeLatestDBVersion();
        }
    }

    private async storeLatestDBVersion() {
        const storageObj = {} as StrToAny;
        storageObj[GithubStore.KEY_DB_VERSION] = GithubStore.DB_VERSION;
        await this.storage.set(storageObj);
    }

    async getIssuesToPRs(issueNums: number[]): Promise<NumToNumSet> {
        const keysToFetch = issueNums.map(num => this.getKeyIssueToPR(num));
        const storedIssueToPRs = await this.storage.get(keysToFetch);
        const returnValue = {} as NumToNumSet;
        for (const key in storedIssueToPRs) {
            const issueNum = this.extractIssueNumFromKeyIssueToPR(key);
            if (!issueNum) {
                // todo: surface to user for bug report?
                Log.e(`key ${key} does not have issue number`);
            } else {
                returnValue[issueNum] = new Set(storedIssueToPRs[key]);
            }
        }
        return returnValue;
    }

    private extractIssueNumFromKeyIssueToPR(key: string): number | null {
        const matches = GithubStore.RE_KEY_ISSUE_TO_PR.exec(key);
        if (!matches) { return null; }
        return parseInt(matches[1]);
    }

    async getIssueToPRs(issueNum: number): Promise<Set<number>> {
        const issuesToPRs = await this.getIssuesToPRs([issueNum]);
        const prs = issuesToPRs[issueNum];
        if (prs) {
            return prs;
        } else {
            return new Set();
        }
    }

    async mergeIssueToPRs(remoteIssueToOpenPRs: NumToNumSet): Promise<void> {
        const issueNumsToFetch = Object.keys(remoteIssueToOpenPRs).map(parseInt);
        if (issueNumsToFetch.length <= 0) { return Promise.resolve(); }

        const now = new Date();
        const storedIssueToPRs = await this.getIssuesToPRs(issueNumsToFetch);
        const toStore = {} as StrToAny;
        for (const issueNum in remoteIssueToOpenPRs) {
            const remoteOpenPRs = remoteIssueToOpenPRs[issueNum]!;
            if (remoteOpenPRs.size <= 0) { return; }

            const storedOpenPRs = storedIssueToPRs[issueNum];
            let mergedOpenPRs: Set<number>;
            if (storedOpenPRs) {
                mergedOpenPRs = remoteOpenPRs.union(storedOpenPRs);
            } else {
                mergedOpenPRs = remoteOpenPRs;
            }

            const keyIssueToPR = this.getKeyIssueToPR(parseInt(issueNum));
            toStore[keyIssueToPR] = Array.from(mergedOpenPRs); // must store primitive or array.

            const remotePRLastUpdatedKeys = Array.from(remoteOpenPRs).map(pr => { return this.getKeyPRLastUpdated(pr); });
            remotePRLastUpdatedKeys.forEach(keyPRLastUpdated => {
                toStore[keyPRLastUpdated] = now.getTime();
            });
        }

        return this.storage.set(toStore);
    }

    async getPRLastUpdatedDate(prNum: number): Promise<Date | undefined> {
        return this.getDateFromDB(this.getKeyPRLastUpdated(prNum));
    }

    async getRepoOpenPRLastFetchDate(): Promise<Date | undefined> {
        return this.getDateFromDB(this.getKeyRepoOpenPRLastFetchDate());
    }

    private async getDateFromDB(key: string): Promise<Date | undefined> {
        const dateMillis = (await this.storage.get(key))[key] as number | undefined;
        if (!dateMillis) {
            return undefined;
        }
        return new Date(dateMillis);
    }

    async setRepoOpenPRLastFetchDate(now: Date): Promise<void> {
        const key = this.getKeyRepoOpenPRLastFetchDate();
        const toStore = {} as StrToAny;
        toStore[key] = now.getTime();
        return this.storage.set(toStore);
    }

    protected getKeyRepoOpenPRLastFetchDate(): string {
        return `${GithubStore.PREFIX_REPO_OPEN_PR_LAST_FETCH}-${this.ownerRepo}`;
    }

    private getKeyPRLastUpdated(prNum: number): string {
        return `${GithubStore.PREFIX_PR_LAST_UPDATED}-${this.ownerRepo}/${prNum}`;
    }

    private getKeyIssueToPR(issueNum: number): string {
        return `${GithubStore.PREFIX_ISSUE_TO_PRS}-${this.ownerRepo}/${issueNum}`;
    }

    private async upgrade(currentVersion: number, newVersion: number) {
        for (let i = currentVersion; i < newVersion; i++) {
            switch (currentVersion) {
                case 1: this.upgrade1To2(); break;
                case 2: this.upgrade2To3(); break;
            }
        }
    }

    // Stored date format changed from storing Date to date millis. Since the date keys don't
    // appear to be in the format we'd expect, we must delete them all.
    private async upgrade1To2() {
        await this.deleteRepoLastFetchAndPRLastUpdateDates();
    }

    // Stored issue to PRs format changed from storing Set to Array. Since the values don't
    // appear to be in the format we'd expect, we must delete them all. Since the DB is empty,
    // we should remove the dates too.
    private async upgrade2To3() {
        function keyMatchesIssueToPRs(key: string): boolean {
            return key.startsWith(GithubStore.PREFIX_ISSUE_TO_PRS);
        }

        await this.deleteRepoLastFetchAndPRLastUpdateDates();

        const storeKeyToVal = await this.storage.get() as StrToAny;
        const keysToRemove = Object.keys(storeKeyToVal).filter(keyMatchesIssueToPRs);
        await this.storage.remove(keysToRemove);
    }

    private async deleteRepoLastFetchAndPRLastUpdateDates() {
        function keyMatchesFetchDate(key: string): boolean {
            return key.startsWith(GithubStore.PREFIX_REPO_OPEN_PR_LAST_FETCH) ||
                    key.startsWith(GithubStore.PREFIX_PR_LAST_UPDATED);
        }

        const storeKeyToVal = await this.storage.get() as StrToAny;
        const keysToRemove = Object.keys(storeKeyToVal).filter(keyMatchesFetchDate);
        await this.storage.remove(keysToRemove);
    }
}

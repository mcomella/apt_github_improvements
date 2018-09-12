/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type StorageArea = browser.storage.StorageArea;

/** Persisted data from GitHub. */
class GithubStore {

    static async get(owner: string, repo: string): Promise<GithubStore> {
        const store = new GithubStore(owner, repo);
        await store.maybeUpgrade();
        return store;
    }

    private static readonly PREFIX_KEY = 'ghs';

    protected static readonly DB_VERSION = 1;
    protected static readonly KEY_DB_VERSION = `${GithubStore.PREFIX_KEY}-v`

    private static readonly RE_KEY_ISSUE_TO_PR = /([0-9]+)$/

    private readonly ownerRepo: string;
    private readonly storage: StorageArea;

    protected constructor(owner: string, repo: string, _storage?: StorageArea) {
        this.ownerRepo = `${owner}/${repo}`;
        if (!_storage) {
            this.storage = browser.storage.local;
        } else {
            this.storage = _storage;
        }
    }

    protected async maybeUpgrade(_newVersion?: number) {
        if (!_newVersion) { _newVersion = GithubStore.DB_VERSION; }

        const keyVersion = GithubStore.KEY_DB_VERSION;
        const dbVersion = (await this.storage.get(keyVersion))[keyVersion];
        if (!dbVersion) {
            const storageObj = {} as StrToAny;
            storageObj[keyVersion] = GithubStore.DB_VERSION;
            await this.storage.set(storageObj);
        } else if (dbVersion !== GithubStore.DB_VERSION) {
            // Upgrade for future versions...
        }
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
            toStore[keyIssueToPR] = mergedOpenPRs;

            const remotePRLastUpdatedKeys = Array.from(remoteOpenPRs).map(pr => { return this.getKeyPRLastUpdated(pr); });
            remotePRLastUpdatedKeys.forEach(keyPRLastUpdated => {
                toStore[keyPRLastUpdated] = now.getTime();
            });
        }

        return this.storage.set(toStore);
    }

    async getPRLastUpdatedMillis(prNum: number): Promise<Date | undefined> {
        return this.getDateFromDB(this.getKeyPRLastUpdated(prNum));
    }

    async getRepoOpenPRLastFetchMillis(): Promise<Date | undefined> {
        return this.getDateFromDB(this.getKeyRepoOpenPRLastFetchMillis());
    }

    private async getDateFromDB(key: string): Promise<Date | undefined> {
        const dateMillis = (await this.storage.get(key))[key] as number | undefined;
        if (!dateMillis) {
            return undefined;
        }
        return new Date(dateMillis);
    }

    async setRepoOpenPRLastFetchMillis(now: Date): Promise<void> {
        const key = this.getKeyRepoOpenPRLastFetchMillis();
        const toStore = {} as StrToAny;
        toStore[key] = now.getTime();
        return this.storage.set(toStore);
    }

    protected getKeyRepoOpenPRLastFetchMillis(): string {
        return `${GithubStore.PREFIX_KEY}-openPRLastFetch-${this.ownerRepo}`;
    }

    private getKeyPRLastUpdated(prNum: number): string {
        return `${GithubStore.PREFIX_KEY}-prLastUpdate-${this.ownerRepo}/${prNum}`;
    }

    private getKeyIssueToPR(issueNum: number): string {
        return `${GithubStore.PREFIX_KEY}-issue-${this.ownerRepo}/${issueNum}`;
    }
}

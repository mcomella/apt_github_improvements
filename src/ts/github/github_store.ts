/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type StorageArea = browser.storage.StorageArea;

/** Persisted data from GitHub. */
class GithubStore {

    static async getStore(owner: string, repo: string): Promise<GithubStore> {
        const store = new GithubStore(owner, repo);
        await store.maybeUpgrade();
        return store;
    }

    private static readonly PREFIX_KEY = 'ghs';

    protected static readonly DB_VERSION = 1;
    protected static readonly KEY_DB_VERSION = `${GithubStore.PREFIX_KEY}-v`

    private readonly owner: string;
    private readonly repo: string;
    private readonly ownerRepo: string;
    private readonly storage: StorageArea;

    protected constructor(owner: string, repo: string, _storage?: StorageArea) {
        this.owner = owner;
        this.repo = repo;
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

    setIssuesToPRs(issuesToPRs: NumtoNumSet): Promise<void> {
        const now = new Date();
        const toStore = {} as StrToAny;
        Object.keys(issuesToPRs).forEach(issueNumStr => {
            const issueNum = parseInt(issueNumStr);
            const prs = Array.from(issuesToPRs[issueNum]);
            if (prs.length === 0) { return; }

            const keyIssueToPRs = this.getKeyIssueToPR(issueNum);
            toStore[keyIssueToPRs] = prs;

            prs.forEach(pr => {
                const keyPRLastUpdated = this.getKeyPRLastUpdated(pr);
                toStore[keyPRLastUpdated] = now;
            });
        });
        return this.storage.set(toStore);
    }

    protected getKeyPRLastUpdated(prNum: number): string {
        return `${GithubStore.PREFIX_KEY}-prLastUpdate-${this.ownerRepo}/${prNum}`;
    }

    protected getKeyIssueToPR(issueNum: number): string {
        return `${GithubStore.PREFIX_KEY}-issue-${this.ownerRepo}/${issueNum}`;
    }
}

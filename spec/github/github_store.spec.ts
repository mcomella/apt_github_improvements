/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class MockGithubStore extends GithubStore {
    static readonly DB_VERSION = GithubStore.DB_VERSION;
    static readonly KEY_DB_VERSION = GithubStore.KEY_DB_VERSION;

    constructor(owner: string, repo: string, mockStorage: StorageArea) {
        super(owner, repo, mockStorage);
    }

    async maybeUpgrade(newVersion?: number) {
        super.maybeUpgrade(newVersion);
    }
}

describe('A GithubStore', () => {

    const Store = MockGithubStore;

    let backingData: StrToAny;
    let store: MockGithubStore;
    let mockStore: StorageArea;

    beforeEach(() => {
        const storeContainer = getMockStore();
        backingData = storeContainer.backingData;
        mockStore = storeContainer.mockStore;

        store = new MockGithubStore('mozilla-mobile', 'firefox-tv', mockStore);
    });

    it('inits the DB with the current version when empty', async () => {
        await store.maybeUpgrade()
        expect(Object.keys(backingData).length).toBe(1)
        expect(backingData[Store.KEY_DB_VERSION]).toEqual(Store.DB_VERSION)
    });

    function getMockStore() {
        const backingData = {} as StrToAny;
        const mockStore = {
            get: (inputKeys: string | string[]) => {
                let keys: string[];
                if (inputKeys.constructor === String) {
                    keys = [inputKeys] as string[];
                } else {
                    keys = inputKeys as string[];
                }

                const returnValue = {} as StrToAny;
                keys.forEach(key => {
                    returnValue[key] = backingData[key];
                });
                return Promise.resolve(returnValue);
            },
            set: (items: any) => {
                Object.keys(items).forEach(key => {
                    backingData[key] = items[key];
                });
                return Promise.resolve();
            },
        } as StorageArea;

        return {
            backingData: backingData,
            mockStore: mockStore,
        };
    }
});

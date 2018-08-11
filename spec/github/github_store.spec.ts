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

    let testStore: MockGithubStore;
    let backingData: StrToAny;
    let mockStorage: StorageArea;

    beforeEach(() => {
        const storageContainer = getMockStorage();
        backingData = storageContainer.backingData;
        mockStorage = storageContainer.mockStore;

        testStore = new MockGithubStore('moz', 'fire', mockStorage);
    });

    it('inits the DB with the current version when empty', async () => {
        await testStore.maybeUpgrade()
        expect(Object.keys(backingData).length).toBe(1)
        expect(backingData[Store.KEY_DB_VERSION]).toEqual(Store.DB_VERSION)
    });

    describe('when setting issues to PRs', () => {
        it('sets one issue to multiple PRs', async () => {
            const prs = [456, 987];
            const input = {8: new Set(prs)};
            await testStore.setIssuesToPRs(input);

            const actual = backingData['ghs-issue-moz/fire/8'] as number[];
            expect(actual.length).toEqual(2);
            prs.forEach(pr => expect(actual).toContain(pr, pr));
        });

        it('sets multiple issues to multiple PRs', async () => {
            const prsOne = [456, 987];
            const prsTwo = [700, 1010];
            const input = {
                8: new Set(prsOne),
                25: new Set(prsTwo),
            } as NumtoNumSet;
            await testStore.setIssuesToPRs(input);

            Object.keys(input).forEach(issueNum => {
                const key = `ghs-issue-moz/fire/${issueNum}`;
                const prs = input[parseInt(issueNum)];

                const actual = backingData[key];
                expect(actual.length).toBe(prs.size);
                prs.forEach(pr => expect(actual).toContain(pr, `${key} ${pr}`));
            });
        });

        it('updates the PRs\' last updated time for all PRs', async () => {
            const prsOne = [456, 987];
            const prsTwo = [456, 100];
            const input = {
                8: new Set(prsOne),
                10: new Set(prsTwo),
            };

            const before = new Date();
            await testStore.setIssuesToPRs(input);
            const after = new Date();

            prsOne.concat(prsTwo).forEach(pr => {
                const key = `ghs-prLastUpdate-moz/fire/${pr}`;
                const lastUpdate = backingData[key];
                expect(lastUpdate <= after).toBeTruthy(pr);
                expect(lastUpdate >= before).toBeTruthy(pr);
            });
        });

        it('won\'t store an empty PR list', async () => {
            await testStore.setIssuesToPRs({1: new Set()});
            expect(Object.keys(backingData).length).toBe(0);
        });
    });

    function getMockStorage() {
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

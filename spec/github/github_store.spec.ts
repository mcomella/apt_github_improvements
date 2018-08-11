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

    describe('when getting PRs from issue numbers', () => {
        it('gets the PRs for issues that are in the DB', async () => {
            const prs42 = [87, 53];
            const prs56 = [123, 451];
            backingData['ghs-issue-moz/fire/42'] = prs42;
            backingData['ghs-issue-moz/fire/56'] = prs56;
            const actual = await testStore.getIssuesToPRs([42, 56]);

            expect(Object.keys(actual).length).toBe(2);
            expect(actual[42]!.equals(new Set(prs42))).toBeTruthy();
            expect(actual[56]!.equals(new Set(prs56))).toBeTruthy();
        });

        it('gets the PRs for issues that are in the DB but does not get PRs for issues that aren\'t', async () => {
            const prs = [123, 654];
            backingData['ghs-issue-moz/fire/42'] = prs;
            const actual = await testStore.getIssuesToPRs([42, 56]);

            expect(Object.keys(actual).length).toBe(1);
            expect(actual[42]!.equals(new Set(prs))).toBeTruthy();
        });

        it('given an empty DB, returns an empty object', async () => {
            const actual = await testStore.getIssuesToPRs([1, 2]);
            expect(Object.keys(actual).length).toBe(0);
        });
    });

    describe('when getting PRs from an issue number', () => {
        it('gets the PRs for an issue in the DB', async () => {
            const prs = [87, 53];
            backingData['ghs-issue-moz/fire/42'] = prs;
            const actual = await testStore.getIssueToPRs(42);

            expect(actual.size).toBe(2);
            prs.forEach(pr => expect(actual).toContain(pr, pr));
        });

        it('given an empty DB, returns an empty set', async () => {
            const actual = await testStore.getIssueToPRs(1);
            expect(actual.size).toBe(0);
        });
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
            } as NumToNumSet;
            await testStore.setIssuesToPRs(input);

            Object.keys(input).forEach(issueNum => {
                const key = `ghs-issue-moz/fire/${issueNum}`;
                const prs = input[parseInt(issueNum)]!;

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
                    if (backingData[key]) {
                        returnValue[key] = backingData[key];
                    }
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

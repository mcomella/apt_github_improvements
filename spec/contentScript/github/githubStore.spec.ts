/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('A GithubStore', () => {

    class LocalMockGithubStore extends MockGithubStore {
        async maybeUpgrade(newVersion?: number) {
            super.maybeUpgrade(newVersion);
        }
    }

    const ORG = 'moz';
    const REPO = 'fire';
    const ORG_REPO = `${ORG}/${REPO}`;

    const Store = LocalMockGithubStore;

    let testStore: LocalMockGithubStore;
    let backingData: StrToAny;
    let mockStorage: StorageArea;

    beforeEach(() => {
        const storageContainer = getMockStorage();
        backingData = storageContainer.backingData;
        mockStorage = storageContainer.mockStore;

        testStore = new LocalMockGithubStore(ORG, REPO, mockStorage);
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
            backingData[getKeyIssueToPR(42)] = prs42;
            backingData[getKeyIssueToPR(56)] = prs56;
            const actual = await testStore.getIssuesToPRs([42, 56]);

            expect(Object.keys(actual).length).toBe(2);
            expect(actual[42]).toEqual(new Set(prs42));
            expect(actual[56]).toEqual(new Set(prs56));
        });

        it('gets the PRs for issues that are in the DB but does not get PRs for issues that aren\'t', async () => {
            const prs = [123, 654];
            backingData[getKeyIssueToPR(42)] = prs;
            const actual = await testStore.getIssuesToPRs([42, 56]);

            expect(Object.keys(actual).length).toBe(1);
            expect(actual[42]).toEqual(new Set(prs));
        });

        it('given an empty DB, returns an empty object', async () => {
            const actual = await testStore.getIssuesToPRs([1, 2]);
            expect(Object.keys(actual).length).toBe(0);
        });
    });

    describe('when getting PRs from an issue number', () => {
        it('gets the PRs for an issue in the DB', async () => {
            const prs = [87, 53];
            backingData[getKeyIssueToPR(42)] = prs;
            const actual = await testStore.getIssueToPRs(42);

            expect(actual.size).toBe(2);
            prs.forEach(pr => expect(actual).toContain(pr, pr));
        });

        it('given an empty DB, returns an empty set', async () => {
            const actual = await testStore.getIssueToPRs(1);
            expect(actual.size).toBe(0);
        });
    });

    describe('when merging issues to PRs', () => {
        it('given an empty DB, will save an issue', async () => {
            const input = {} as NumToNumSet;
            input[4] = new Set([1, 2, 3]);
            await testStore.mergeIssueToPRs(input);

            const actualValue = backingData[getKeyIssueToPR(4)];
            expect(actualValue).toEqual(new Set([1, 2, 3]));
        });

        it('given an empty DB, will save multiple issues', async () => {
            const prs4 = new Set([2, 3, 4]);
            const prs10 = new Set([2, 5, 8]);
            const input = {
                4: prs4,
                10: prs10,
            };
            await testStore.mergeIssueToPRs(input);

            const actual4 = backingData[getKeyIssueToPR(4)];
            expect(actual4).toEqual(new Set([2, 3, 4]));
            const actual10 = backingData[getKeyIssueToPR(10)];
            expect(actual10).toEqual(new Set([2, 5, 8]));
        });

        it('given existing data for the same issue, will union the new PRs', async () => {
            const key = getKeyIssueToPR(4);
            backingData[key] = [1, 2];
            const input = {4: new Set([2, 3, 4])};
            await testStore.mergeIssueToPRs(input);

            const actualValue = backingData[key];
            expect(actualValue).toEqual(new Set([1, 2, 3, 4]));
        });

        it('given an empty object, will take no action', async () => {
            await testStore.mergeIssueToPRs({});
            expect(Object.keys(backingData).length).toBe(0);
        });

        it('given an issue with no PRs, will take no action', async () => {
            await testStore.mergeIssueToPRs({4: new Set()});
            expect(Object.keys(backingData).length).toBe(0);
        });

        it('given one issue num, will update the PRs\' last updated time', async () => {
            const prs = [1, 20];

            const before = new Date();
            await testStore.mergeIssueToPRs({4: new Set(prs)});
            const after = new Date();

            prs.forEach(prNum => {
                const key = getKeyPRLastUpdate(prNum);
                expect(backingData[key] >= before).toBeTruthy();
                expect(backingData[key] <= after).toBeTruthy();
            });
        });

        it('will update the PRs\' last updated time to the same time', async () => {
            await testStore.mergeIssueToPRs({4: new Set([1, 20])});

            const left = backingData[getKeyPRLastUpdate(1)];
            const right = backingData[getKeyPRLastUpdate(20)];
            expect(left).toBeTruthy();
            expect(left).toBe(right);
        });

        it('given one issue num, will update the PRs\' last updated time', async () => {
            const prs = [1, 20];

            const before = new Date();
            await testStore.mergeIssueToPRs({4: new Set(prs)});
            const after = new Date();

            prs.forEach(prNum => {
                const key = getKeyPRLastUpdate(prNum);
                expect(backingData[key] >= before).toBeTruthy();
                expect(backingData[key] <= after).toBeTruthy();
            });
        });

        it('given multiple issue nums, will update the PRs\' last updated time', async () => {
            const prsLeft = new Set([1, 20]);
            const prsRight = new Set([487, 360, 20]);
            const prs = prsLeft.union(prsRight);

            const before = new Date();
            await testStore.mergeIssueToPRs({
                4: new Set(prsLeft),
                12: new Set(prsRight),
            });
            const after = new Date();

            prs.forEach(prNum => {
                const key = getKeyPRLastUpdate(prNum);
                expect(backingData[key] >= before).toBeTruthy();
                expect(backingData[key] <= after).toBeTruthy();
            });
        });
    });

    it('given a PR last update millis in the DB, will get it', async () => {
        const now = new Date();
        const key = getKeyPRLastUpdate(10);
        backingData[key] = now;

        const actual = await testStore.getPRLastUpdatedMillis(10);
        expect(actual).toBe(now);
    });

    it('given an empty DB, gets undefined for a PR\'s last update time', async () => {
        const actual = await testStore.getPRLastUpdatedMillis(10);
        expect(actual).toBeUndefined();
    });

    it('sets the open pr last fetch millis to the given value', async () => {
        const now = new Date();
        await testStore.setRepoOpenPRLastFetchMillis(now);
        const key = getKeyRepoOpenPRLastFetchMillis();
        expect(backingData[key]).toBe(now);
    });

    it('given an open pr last fetch millis in the DB, gets it', async () => {
        const expected = new Date();
        const key = getKeyRepoOpenPRLastFetchMillis();
        backingData[key] = expected;

        const actual = await testStore.getRepoOpenPRLastFetchMillis();
        expect(actual).toBe(expected);
    });

    it('given an empty DB, gets undefined for the open pr last fetch millis', async () => {
        const actual = await testStore.getRepoOpenPRLastFetchMillis();
        expect(actual).toBeUndefined();
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

    function getKeyRepoOpenPRLastFetchMillis(): string {
        return `ghs-openPRLastFetch-${ORG_REPO}`;
    }

    function getKeyIssueToPR(issueNum: number): string {
        return `ghs-issue-${ORG_REPO}/${issueNum}`;
    }

    function getKeyPRLastUpdate(prNum: number): string {
        return `ghs-prLastUpdate-${ORG_REPO}/${prNum}`;
    }
});

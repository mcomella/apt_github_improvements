/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The GithubFetchChecker', () => {

    let mockStore: MockGithubStore;
    let testChecker: GithubFetchChecker;

    beforeEach(() => {
        mockStore = new MockGithubStore('o', 'r', {} as StorageArea);
        testChecker = new GithubFetchChecker(mockStore);
    });

    describe('when checking if the open PRs are ready fetch', () => {
        it('if the DB is empty, will return undefined', async () => {
            spyOn(mockStore, 'getRepoOpenPRLastFetchMillis').and.returnValue(undefined);
            const actual = await testChecker.isOpenPRsFetchReady(new Date());
            expect(actual).toBe(true);
        });

        it('if the stored time is later than now, will return false', async () => {
            const now = new Date();
            const later = getLater(now);

            spyOn(mockStore, 'getRepoOpenPRLastFetchMillis').and.returnValue(later);
            const actual = await testChecker.isOpenPRsFetchReady(now);
            expect(actual).toBe(false);
        });

        it('if the stored time is significantly earlier than now, will return true', async () => {
            const now = new Date();
            const earlier = getSignicantlyEarlier(now);

            spyOn(mockStore, 'getRepoOpenPRLastFetchMillis').and.returnValue(earlier);
            const actual = await testChecker.isOpenPRsFetchReady(now);
            expect(actual).toBe(true);
        });
    });

    describe('when checking if a PR is ready to fetch', () => {
        it('if the DB is empty, will return true', async () => {
            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(undefined);
            const actual = await testChecker.isPRFetchReady(10, new Date());
            expect(actual).toBe(true);
        });

        it('if the time is later than now, will return false', async () => {
            const now = new Date();
            const later = getLater(now);

            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(later);
            const actual = await testChecker.isPRFetchReady(10, now);
            expect(actual).toBe(false);
        });

        it('if the time is significantly earlier than now, will return true', async () => {
            const now = new Date();
            const earlier = getSignicantlyEarlier(now);

            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(earlier);
            const actual = await testChecker.isPRFetchReady(10, now);
            expect(actual).toBe(true);
        });
    });

    describe('when filtering prs ready for fetch', () => {
        it('when receiving an empty array, will return an empty array', async () => {
            const actual = await testChecker.filterPRsFetchReady([], new Date());
            expect(actual.length).toBe(0);
        });

        it('will keep items where their last fetch millis is not in the DB', async () => {
            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(undefined);
            const actual = await testChecker.filterPRsFetchReady([{number: 10}], new Date());
            expect(actual.length).toBe(1);
            expect(actual[0].number).toBe(10);
        });

        it('will keep items where their last fetch millis is significantly earlier than now', async () => {
            const now = new Date();
            const earlier = getSignicantlyEarlier(now);

            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(earlier);
            const actual = await testChecker.filterPRsFetchReady([{number: 10}], now);
            expect(actual.length).toBe(1);
            expect(actual[0].number).toBe(10);
        });

        it('will drop items where their last fetch millis is later than now', async () => {
            const now = new Date();
            const later = getLater(now);

            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValue(later);
            const actual = await testChecker.filterPRsFetchReady([{number: 10}], now);
            expect(actual.length).toBe(0);
        });

        // relies on previous tests.
        it('will correctly filter multiple values', async () => {
            const now = new Date();
            const later = getLater(now);

            const input = [] as PRForFetch[];
            [1, 2, 3, 4].forEach(n => input.push({number: n}));

            spyOn(mockStore, 'getPRLastUpdatedMillis').and.returnValues(
                getLater(now), undefined, getSignicantlyEarlier(now), undefined);
            const actual = await testChecker.filterPRsFetchReady(input, now);
            expect(actual.length).toBe(3);
            expect(actual[0].number).toBe(2);
            expect(actual[1].number).toBe(3);
            expect(actual[2].number).toBe(4);
        });
    });

    function getSignicantlyEarlier(date: Date): Date {
        const earlier = new Date();
        earlier.setTime(date.getTime() - 120 /* min */ * 60 /* to sec */ * 1000 /* to millis */);
        return earlier;
    }

    function getLater(date: Date): Date {
        const later = new Date();
        later.setTime(date.getTime() + 100);
        return later;
    }
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('The GithubDataTransformer', () => {

    describe('when transforming fetched PRs to Issues -> PRs', () => {
        it('will return an empty object for empty input', () => {
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs([]);
            expect(actual).toEqual({});
        })

        it('given an issue in the title but no commits, will return a one-to-one mapping', () => {
            const input = [
                {0: getMockPR(10, 'Closes #45: Whatever'), 1: []},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            expect(actual).toEqual({45: new Set([10])});
        })

        it('given no issue in the title but commits with a number, will return a one-to-one mapping', () => {
            const input = [
                {0: getMockPR(10), 1: [getCommit('Issue #45: Add readme')]},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            expect(actual).toEqual({45: new Set([10])});
        })

        it('given no issue in the title but multiple commits with multple number, will return an X-to-one mapping', () => {
            const input = [
                {0: getMockPR(10), 1: [
                    getCommit('Issue #45: Add readme'),
                    getCommit('Issue #67: Another one'),
                    getCommit('Issue #76: Last one'),
                ]},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            const prSet = new Set([10]);
            const expected = {
                45: prSet,
                67: prSet,
                76: prSet,
            }
            expect(actual).toEqual(expected);
        })

        it('given the same issue in the title and commits, will return a one-to-one mapping', () => {
            const input = [
                {0: getMockPR(10, 'Issue #45: Whatever'), 1: [getCommit('Issue #45: Add readme')]},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            expect(actual).toEqual({45: new Set([10])});
        })

        it('given a different issue in the title and commits, will return a two-to-one mapping', () => {
            const input = [
                {0: getMockPR(10, 'Issue #45: Whatever'), 1: [getCommit('Issue #76: Add readme')]},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            const prSet = new Set([10]);
            expect(actual).toEqual({45: prSet, 76: prSet});
        })

        it('given two prs closing the same issue, will return a one-to-two mapping', () => {
            const input = [
                {0: getMockPR(10, 'Issue #45: Whatever'), 1: []},
                {0: getMockPR(47, 'Issue #45: Replacing the other PR'), 1: []},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            expect(actual).toEqual({45: new Set([10, 47])});
        })

        it('given a two prs closing different issues, will return a two separate mapping', () => {
            const input = [
                {0: getMockPR(10, 'Issue #45: Whatever'), 1: []},
                {0: getMockPR(47, 'Issue #77: yeah yeah'), 1: []},
            ];
            const actual = GithubDataTransformer.fetchedPRsToIssuesToPRs(input);
            const expected = {
                45: new Set([10]),
                77: new Set([47]),
            };
            expect(actual).toEqual(expected);
        })
    })

    function getMockPR(number: number, title?: string): GithubEndpoint.PR {
        if (!title) title = 'Whatever';
        return {
            number: number,
            title: title,
            commits_url: 'https://mozilla.org',
        }
    }

    function getCommit(msg: string): GithubEndpoint.Commit {
        return {
            commit: {message: msg},
        };
    }
})

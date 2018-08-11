/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('Set', () => {
    describe('can determine equality', () => {
        it('true between two sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([3, 2, 1]);
            expect(one.equals(two)).toBeTruthy();
        });

        it('true between two empty sets', () => {
            expect(new Set().equals(new Set())).toBeTruthy();
        });

        it('false between two different sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([3, 2]);
            expect(one.equals(two)).toBeFalsy();
        });

        it('false between two different sets, one empty', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set();
            expect(one.equals(two)).toBeFalsy();
        });
    });

    // relies on set equality.
    describe('can union with mutation', () => {
        it('two sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            const expected = new Set([1, 2, 3, 4, 5, 6]);
            one.unionMutate(two);
            expect(one.equals(expected)).toBeTruthy();
        });

        it('two sets without modifying the second set', () => {
            const one = new Set([1, 2]);
            const two = new Set([4, 5]);
            one.unionMutate(two);
            expect(two.equals(new Set([4, 5]))).toBeTruthy();
        });

        it('one set and one empty set', () => {
            const one = new Set([1, 2, 3]);
            const expected = new Set([1, 2, 3]);
            one.unionMutate(expected);
            expect(one.equals(expected)).toBeTruthy();
        });

        it('two empty sets', () => {
            const one = new Set();
            one.unionMutate(new Set());
            expect(one.equals(new Set())).toBeTruthy();
        });
    });

    describe('can union', () => {
        it('two sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            const expected = new Set([1, 2, 3, 4, 5, 6]);
            const actual = one.union(two);
            expect(actual.equals(expected)).toBeTruthy();
        });

        it('two sets without mutating either of them', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            one.union(two);
            expect(one.equals(new Set([1, 2, 3]))).toBeTruthy();
            expect(two.equals(new Set([4, 5, 6]))).toBeTruthy();
        });
    });
});

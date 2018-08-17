/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('Set', () => {
    describe('can union with mutation', () => {
        it('two sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            const expected = new Set([1, 2, 3, 4, 5, 6]);
            one.unionMutate(two);
            expect(one).toEqual(expected);
        });

        it('two sets without modifying the second set', () => {
            const one = new Set([1, 2]);
            const two = new Set([4, 5]);
            one.unionMutate(two);
            expect(two).toEqual(new Set([4, 5]));
        });

        it('one set and one empty set', () => {
            const one = new Set([1, 2, 3]);
            const expected = new Set([1, 2, 3]);
            one.unionMutate(expected);
            expect(one).toEqual(expected);
        });

        it('two empty sets', () => {
            const one = new Set();
            one.unionMutate(new Set());
            expect(one).toEqual(new Set());
        });
    });

    describe('can union', () => {
        it('two sets', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            const expected = new Set([1, 2, 3, 4, 5, 6]);
            const actual = one.union(two);
            expect(actual).toEqual(expected);
        });

        it('two sets without mutating either of them', () => {
            const one = new Set([1, 2, 3]);
            const two = new Set([4, 5, 6]);
            one.union(two);
            expect(one).toEqual(new Set([1, 2, 3]));
            expect(two).toEqual(new Set([4, 5, 6]));
        });
    });
});

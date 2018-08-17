/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('Array', () => {
    describe('when flat zipping two arrays together', () => {
        it('returns an empty array if the inputs are empty', () => {
            expect(flatZip([], []).length).toBe(0);
        });

        it('throws if the arrays are not equal sizes', () => {
            expect(() => { flatZip([1], [])}).toThrowError();
        })

        it('combines two arrays with different non-null types', () => {
            const left = [1, 2, 3];
            const right = ['a', 'b', 'c'];
            const expected = [[1, 'a'], [2, 'b'], [3, 'c']] as {0: number, 1: string}[];
            expect(flatZip(left, right)).toEqual(expected);
        })

        it('removes the null elements of the right-side array', () => {
            const left = [1, 2, 3];
            const right = ['a', null, 'c'];
            const expected = [[1, 'a'], [3, 'c']] as {0: number, 1: string}[];
            expect(flatZip(left, right)).toEqual(expected);
        })
    })
})

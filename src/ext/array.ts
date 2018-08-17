/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This would be an ext fn if types were not so hard. :(
function flatZip<T, U>(left: T[], right: Array<U | null>): {0: T, 1: U}[] {
    if (left.length !== right.length) throw new Error('Expected same len array');

    const zippedValues = [] as {0: T, 1: U}[];
    right.forEach((value, i) => {
        if (!value) { return; }
        zippedValues.push([left[i], value]);
    });
    return zippedValues;
}

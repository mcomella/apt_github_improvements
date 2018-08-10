/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface Set<T> {
    unionMutate(setRight: Set<T>): void;
    equals(setRight: Set<T>): boolean;
}

// inspired by https://stackoverflow.com/a/31129384
Set.prototype.equals = function <T> (setRight: Set<T>): boolean {
    if (this.size !== setRight.size) return false;
    for (let left of this) if (!setRight.has(left)) return false;
    return true;
}

// inspired by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
Set.prototype.unionMutate = function <T> (setRight: Set<T>) {
    setRight.forEach(e => this.add(e));
};

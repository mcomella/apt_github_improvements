/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface Set<T> {
    unionMutate(setRight: Set<T>): void;
    union(setRight: Set<T>): Set<T>;
}

// inspired by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
Set.prototype.unionMutate = function <T> (setRight: Set<T>) {
    setRight.forEach(e => this.add(e));
};

Set.prototype.union = function <T> (setRight: Set<T>): Set<T> {
    const unionSet = new Set(this);
    unionSet.unionMutate(setRight);
    return unionSet;
}

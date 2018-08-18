/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class MockGithubStore extends GithubStore {
    static readonly DB_VERSION = GithubStore.DB_VERSION;
    static readonly KEY_DB_VERSION = GithubStore.KEY_DB_VERSION;

    constructor(owner: string, repo: string, storage: StorageArea) {
        super(owner, repo, storage);
    }
}

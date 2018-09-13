/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Storage for preferences set by the user. */
namespace OptionsStore {
    const PREFIX_KEY = 'opt';
    export const KEY_PERSONAL_ACCESS_TOKEN = `${PREFIX_KEY}-gh-access-token`;

    export async function getPersonalAccessToken(): Promise<string> {
        const token = (await getStorage().get(KEY_PERSONAL_ACCESS_TOKEN))[KEY_PERSONAL_ACCESS_TOKEN];
        if (!token) { return ''; }
        return token;
    }

    export function setPersonalAccessToken(token: string): Promise<void> {
        const storageObj = {} as { [key: string]: string };
        storageObj[KEY_PERSONAL_ACCESS_TOKEN] = token;
        return getStorage().set(storageObj);
    }

    function getStorage() { return browser.storage.local; }
}

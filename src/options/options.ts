/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

async function saveOptions(e: Event) {
    e.preventDefault();

    const accessToken = getAccessTokenNode().value;
    OptionsStore.setPersonalAccessToken(accessToken);
}

async function restoreOptions() {
    const accessToken = await OptionsStore.getPersonalAccessToken();
    if (accessToken) {
        getAccessTokenNode().value = accessToken;
    }
}

function getAccessTokenNode() { return document.querySelector('#access-token') as HTMLInputElement; }

document.addEventListener('DOMContentLoaded', restoreOptions);
const form = document.querySelector('form') as HTMLFormElement;
form.addEventListener('submit', saveOptions);

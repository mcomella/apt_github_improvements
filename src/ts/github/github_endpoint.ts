/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Makes calls directly to the GitHub endpoint without caching. */
namespace GithubEndpoint {

    const BASE_URL = "https://api.github.com";

    export async function fetchOpenPRs(owner: string, repo: string): Promise<Array<PR>> {
        const url = `${BASE_URL}/repos/${owner}/${repo}/pulls?state=open`;
        const request = new Request(url, {
            method: 'GET',
            headers: await getHeaders(),
        });

        const response = await fetch(request);
        if (response.status >= 300) {
            throw new Error('fetchOpenPRs response not success: ' + response.statusText);
        }
        return response.json();
    }

    async function getHeaders() {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
        } as { [key: string]: string };

        // const accessToken = await OptionsStore.getPersonalAccessToken();
        // if (accessToken.length > 0) {
        //     headers['Authorization'] = `token ${accessToken}`
        // }

        return headers;
    }

    export interface PR {
        number: number,
        title: string,
    }
}

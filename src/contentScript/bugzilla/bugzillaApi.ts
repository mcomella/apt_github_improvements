/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface BugzillaBugSummary {
    id: number,
    status: string,
    summary: string,
    resolution: string,
}

/** Helpers for manipulating the raw Bugzilla API. */
namespace BugzillaAPI {

    const BASE_PATH = 'https://bugzilla.mozilla.org/rest';

    /** Fetches bug summaries fom the Bugzilla API: returns an array of bug summaries which is empty on failure. */
    export async function fetchSummariesForBugNumbers(bugNumbers: number[]): Promise<BugzillaBugSummary[]> {
        const bugIDParam = bugNumbers.join(',');
        const url = `${BASE_PATH}/bug?id=${bugIDParam}&include_fields=id,summary,status,resolution`
        try {
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                return json.bugs as BugzillaBugSummary[];
            }

            Log.w('Bugzilla: error while fetching summaries for bug numbers: ' + res.statusText);
        } catch (e) {
            // Don't log exception for privacy.
            Log.w('Bugzilla: exception while fetching summaries for bug numbers');
        }

        return [];
    }

}

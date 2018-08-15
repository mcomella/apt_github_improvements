/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** Helpers for parsing Github content. */
namespace GithubParser {

    export const REGEX_NUMBER = /#(\d+)/;
    const REGEX_NUMBER_GLOBAL = new RegExp(REGEX_NUMBER, 'g');

    export function getNumsFromStr(title: string): Set<number> {
        const issueNumbers = new Set();
        let match;
        while ((match = REGEX_NUMBER_GLOBAL.exec(title)) !== null) {
            issueNumbers.add(parseInt(match[1]));
        }
        return issueNumbers;
    }

    export function getNumsFromCommitMessage(msg: string): Set<number> {
        const summary = msg.split('\n')[0];
        return getNumsFromStr(summary);
    }
}

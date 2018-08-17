/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

namespace GithubDataTransformer {

    export function fetchedPRsToIssuesToPRs(zippedPRs: ZippedPR[]): NumToNumSet {
        const issuesToPRs = {} as NumToNumSet;

        zippedPRs.forEach(zippedPR => {
            const pr = zippedPR[0];
            const commits = zippedPR[1];

            const issuesForPR = GithubParser.getNumsFromStr(pr.title);
            const issuesInCommitMessages = commits.map(commit => {
                return GithubParser.getNumsFromCommitMessage(commit.commit.message)
            });
            issuesInCommitMessages.forEach(issues => {
                issuesForPR.unionMutate(issues);
            });
            issuesForPR.forEach(issue => {
                let existingPRs = issuesToPRs[issue];
                if (existingPRs) {
                    existingPRs.add(pr.number);
                } else {
                    issuesToPRs[issue] = new Set([pr.number]);
                }
            });
        });

        return issuesToPRs;
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Finds Bugzilla bugs within an issue and adds links to them at the
 * top of the page, since they are often used for dependency tracking.
 *
 * You can use https://github.com/mozilla-mobile/android-components/issues/158
 * as a test page.
 */
namespace FeatureBugzillaHoistBugLinks {

    interface BugLink extends BugzillaBugSummary {
        isPopulated: boolean,
        href: string,
    }

    export async function inject(preDiscussionsContainer: HTMLDivElement) {
        const bzLinks = extractBugzillaLinksFromComments();
        if (bzLinks.length <= 0) { return; }

        const bugNumToLink = getBugNumberToLink(bzLinks);
        const bugSummaries = await getBugSummaries(bugNumToLink);
        appendBugzillaDataToContainer(bugSummaries, preDiscussionsContainer);
    }

    function extractBugzillaLinksFromComments(): HTMLAnchorElement[] {
        const commentLinks = document.querySelectorAll(
                `${GithubDOMIssue.SELECTOR_COMMENT_BODY_VISIBLE} a`) as NodeListOf<HTMLAnchorElement>;

        return Array.from(commentLinks).filter(link => {
            return BugzillaURLs.is(link.href);
        });
    }

    function getBugNumberToLink(bzLinks: HTMLAnchorElement[]): NumberToStr {
        const bugNumToLink: NumberToStr = {};
        bzLinks.forEach(aElement => {
            const bugNumber = BugzillaURLs.getBugNumber(aElement.href);
            if (bugNumber) {
                // Bug number as the key ensures uniqueness: one entry per bug.
                // We regenerate the URL to remove anchors, query params, etc.
                bugNumToLink[bugNumber] = BugzillaURLs.fromBugNumber(bugNumber);
            }
        });
        return bugNumToLink;
    }

    async function getBugSummaries(bugNumToLink: NumberToStr): Promise<BugLink[]> {
        const bugNumbersToFetch = Object.keys(bugNumToLink).map(e => parseInt(e));
        const bugSummaries = await BugzillaAPI.fetchSummariesForBugNumbers(bugNumbersToFetch);

        const bugLinks = bugSummaries.map(bug => { return {
            isPopulated: true,
            href: bugNumToLink[bug.id],
            id: bug.id,
            status: bug.status,
            summary: bug.summary,
            resolution: bug.resolution,
        }});

        // Append any bugs missing in summaries request.
        const bugNumbersFetched = new Set(bugSummaries.map(bug => bug.id));
        const missingBugNumbers = bugNumbersToFetch.filter(num => !bugNumbersFetched.has(num));
        missingBugNumbers.forEach(bugNum => {
            bugLinks.push({
                isPopulated: false,
                href: bugNumToLink[bugNum],
                id: bugNum,
                status: '',
                summary: '',
                resolution: '',
            });
        });

        return bugLinks;
    }

    function appendBugzillaDataToContainer(bzLinks: BugLink[], container: HTMLDivElement) {
        const title = 'Bugzilla bugs referenced in this issue:';
        const docFrag = DOM.getTitleLinkList(title, bzLinks, (linkElement: HTMLAnchorElement, bzLink: BugLink) => {
            linkElement.href = bzLink.href;
            linkElement.text = getLinkText(bzLink);
        });
        container.appendChild(docFrag);
    }

    function getLinkText(link: BugLink): string {
        if (!link.isPopulated) {
            return `Bug ${link.id}`;
        }

        // Sample: Backspace deletes wrong chunk when deleting autocompleted URL  | FIXED VERIFIED | 1471868
        var linkText = `${link.summary} | ${link.status}`;
        if (!link.resolution.isBlank()) {
            linkText += ` ${link.resolution}`;
        }
        linkText += ` | ${link.id}`;
        return linkText;
    }
}

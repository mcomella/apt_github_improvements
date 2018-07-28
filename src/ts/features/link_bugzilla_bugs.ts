/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Finds Bugzilla bugs within an issue and adds links to them at the
 * top of the page, since they are often used for dependency tracking.
 */
namespace FeatureLinkBugzillaBugs {

    export function inject(preDiscussionsContainer: HTMLDivElement) {
        const bzLinks = extractBugzillaLinksFromComments();
        const bugNumbers = new Set(bzLinks.map(aElement => BugzillaURLs.getBugNumber(aElement.href)));
        // todo: look up bug summaries.

        if (bzLinks.length > 0) {
            appendBugzillaDataToContainer(bzLinks, preDiscussionsContainer);
        }
    }

    function extractBugzillaLinksFromComments(): HTMLAnchorElement[] {
        const commentLinks = document.querySelectorAll(
                `${GithubPageIssue.SELECTOR_COMMENT_BODY_VISIBLE} a`) as NodeListOf<HTMLAnchorElement>;

        return Array.from(commentLinks).filter(link => {
            return BugzillaURLs.is(link.href);
        });
    }

    function appendBugzillaDataToContainer(bzLinks: HTMLAnchorElement[], container: HTMLDivElement) {
        const titleElement = document.createElement('p');
        titleElement.textContent = "Bugzilla bugs referenced in this issue:"
        titleElement.style.marginBottom = '0px'; // override GH style.
        container.appendChild(titleElement);

        const unorderedListElement = document.createElement('ul');
        unorderedListElement.style.paddingLeft = '40px';
        unorderedListElement.style.marginBottom = '14px';
        container.appendChild(unorderedListElement);

        bzLinks.forEach(link => {
            const listItemElement = document.createElement('li');
            unorderedListElement.appendChild(listItemElement);

            const linkElement = link.cloneNode() as HTMLAnchorElement;
            linkElement.text = linkElement.href;
            listItemElement.appendChild(linkElement);
        });
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** In PR titles, makes issue numbers clickable links. */
namespace FeatureLinkIssuesInPRTitles {

    export function inject() {
        const titleElement = GithubDOMIssue.getTitleElement();
        if (!titleElement) { return; }

        const titleElementObserver = new MutationObserver(onTitleMutation);
        titleElementObserver.observe(titleElement, {childList: true});

        linkIssuesInTitle(titleElement);
    }

    function onTitleMutation(records: MutationRecord[], obs: MutationObserver) {
        const titleElement = GithubDOMIssue.getTitleElement();
        if (!titleElement) { return; }
        linkIssuesInTitle(titleElement);
    }

    function linkIssuesInTitle(titleElement: HTMLSpanElement) {
        if (titleElement.querySelector('a') || // Someone, us?, has already added links.
                !GithubParser.REGEX_NUMBER.test(titleElement.innerText)) { // Nothing to change.
            return;
        }

        const linkedTitleFragment = document.createDocumentFragment();
        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        titleElement.innerText.split(GithubParser.REGEX_NUMBER).forEach((splitText, index) => {
            if (index % 2 === 0) {
                linkedTitleFragment.appendChild(document.createTextNode(splitText));
            } else { // Matched issue numbers are odd indices.
                const link = document.createElement('a');
                link.text = '#' + splitText;
                link.href = GithubURLs.issueFromNumber(ownerName, repoName, parseInt(splitText));
                linkedTitleFragment.appendChild(link);
            }
        });

        const titleTextNode = titleElement.firstChild;
        if (titleTextNode) {
            titleElement.replaceChild(linkedTitleFragment, titleTextNode);
        }
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * In issue comments, links Bugzilla bugs of the form, "Bug XXX".
 *
 * Testcase: https://github.com/mcomella/Spoon-Knife/issues/21
 */
namespace FeatureBugzillaLinkBugXXX {

    const RE_BUG = /(bug\s+(\d+))/i;

    export function inject() {
        forEachCommentParagraph((element: HTMLParagraphElement) => {
            linkTextNodes(element);
        });
    }

    function linkTextNodes(element: HTMLElement) {
        const childNodes = element.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            const node = childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                linkTextNodes(node as HTMLElement);
                continue;
            }
            if (node.nodeType !== Node.TEXT_NODE) {
                Log.w(`BugzillaLinkBugXXX: unknown node type - ${node.nodeType} - ignoring...`);
                continue;
            }

            const textNode = node as Text;
            let nodeText = textNode.textContent;
            if (!nodeText) { continue; }

            const match = RE_BUG.exec(nodeText);
            if (!match) { continue; }

            // The newly split nodes will be handled on the next iteration of the loop.
            const bugNode = textNode.splitText(match.index);
            const suffixNode = bugNode.splitText(match[1].length);
            bugNode.remove();

            const linkedNode = document.createElement('a');
            linkedNode.innerText = bugNode.textContent!;
            linkedNode.href = BugzillaURLs.fromBugNumber(parseInt(match[2]));
            element.insertBefore(linkedNode, suffixNode);

            i += 1; // Skip the node we just added.
        };
    }

    function forEachCommentParagraph(block: Function) {
        document.querySelectorAll(`${GithubDOMIssue.SELECTOR_COMMENT_BODY_VISIBLE} p`).forEach(element => block(element));
    }
}

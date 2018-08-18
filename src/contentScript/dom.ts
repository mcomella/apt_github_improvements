/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** An encapsulation of new dom items in the add-on. */
namespace DOM {

    /** Gets list with a title and each link styled by the given function. */
    export function getTitleLinkList<T>(title: string, listItems: T[], forEachItem: Function, aElement?: HTMLAnchorElement): DocumentFragment {
        const frag = document.createDocumentFragment();
        frag.appendChild(newTitleElement(title, aElement));
        const ulElement = newULElement();
        frag.appendChild(ulElement);

        listItems.forEach(listItem => {
            const listItemElement = document.createElement('li');
            ulElement.appendChild(listItemElement);
            const linkElement = document.createElement('a');
            listItemElement.appendChild(linkElement);

            forEachItem(linkElement, listItem);
        });

        return frag;
    }

    function newTitleElement(title: string, linkElement?: HTMLAnchorElement): HTMLParagraphElement {
        const titleElement = document.createElement('p');
        titleElement.style.marginBottom = '0px'; // override GH style.

        if (!linkElement) {
            titleElement.appendChild(new Text(`${title}:`));
        } else {
            titleElement.appendChild(new Text(`${title} (`));
            titleElement.appendChild(linkElement);
            titleElement.appendChild(new Text('):'));
        }

        return titleElement;
    }

    function newULElement(): HTMLUListElement {
        const unorderedListElement = document.createElement('ul');
        unorderedListElement.style.paddingLeft = '40px';
        unorderedListElement.style.marginBottom = '14px';
        return unorderedListElement;
    }
}

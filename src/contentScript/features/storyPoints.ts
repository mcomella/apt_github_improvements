/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Calculates the number of days it will take to complete a milestone
 * based off "t-shirt sizing" labels. See
 * http://mcomella.xyz/blog/2018/github-story-points.html for more details.
 */
namespace FeatureStoryPoints {
    let TAG = 'github-story-points';

    let DIV_ID = TAG + '-container';
    let RESULT_ID = TAG + '-results';

    let SIZE_S = 'size s';
    let SIZE_M = 'size m';
    let SIZE_L = 'size l';
    let ALL_SIZES = [SIZE_S, SIZE_M, SIZE_L];

    let UNLABELED = 'unlabeled';
    let MULTIPLE_LABELS = 'multiple labels';
    let ALL_LABELS_DISPLAYED_TO_USER = ALL_SIZES.concat(UNLABELED, MULTIPLE_LABELS);

    let DEFAULT_DAYS_PER_SIZE = {} as { [index: string]: number; };
    DEFAULT_DAYS_PER_SIZE[SIZE_S] = 1;
    DEFAULT_DAYS_PER_SIZE[SIZE_M] = 3;
    DEFAULT_DAYS_PER_SIZE[SIZE_L] = 5;

    export function inject() {
        let labelsDisplayedToUser = extractLabelsDisplayedToUser();
        let newNode = createResultNode(labelsDisplayedToUser);
        insertResultNode(newNode);
        calculateAndUpdateResults(labelsDisplayedToUser);
    }

    function insertResultNode(newNode: HTMLDivElement) {
        let oldNode = document.getElementById(DIV_ID);
        if (oldNode) oldNode.remove();

        let issuesList = document.getElementsByClassName('mb-3')[0];
        issuesList.appendChild(newNode);
    }

    function extractLabelsDisplayedToUser() {
        let totalLabelCounts = {} as { [index: string]: number; };
        for (const k of ALL_LABELS_DISPLAYED_TO_USER) totalLabelCounts[k] = 0;

        Array.from(document.getElementsByClassName('d-table')).forEach(issueRow => {
            let issueLabelCounts = {} as { [index: string]: number; };
            for (const k of ALL_SIZES) issueLabelCounts[k] = 0;

            Array.from(issueRow.getElementsByClassName('IssueLabel')).forEach(rawIssueLabel => {
                let label = (rawIssueLabel as HTMLAnchorElement).innerText.toLowerCase();
                if (issueLabelCounts.hasOwnProperty(label)) {
                    issueLabelCounts[label] += 1;
                }
            });

            let issueLabelSizeSum = Object.values(issueLabelCounts).reduce((acc, cur) => acc + cur);
            if (issueLabelSizeSum === 0) {
                totalLabelCounts['unlabeled'] += 1;
            } else if (issueLabelSizeSum > 1) {
                totalLabelCounts['multiple labels'] += 1;
            } else {
                for (const k in issueLabelCounts) {
                    totalLabelCounts[k] += issueLabelCounts[k];
                }
            }
        });

        return totalLabelCounts;
    }

    function createResultNode(labelsDisplayedToUser: { [index: string]: number; }) {
        let outerContainer = document.createElement('div');
        outerContainer.id = DIV_ID;
        let labelCountsNode = document.createElement('p');
        outerContainer.appendChild(labelCountsNode);
        let calculatorNode = document.createElement('p');
        calculatorNode.style.paddingLeft = '20px';
        outerContainer.appendChild(calculatorNode);

        const {ownerName, repoName} = PageDetect.getOwnerAndRepo();
        const milestone = extractMilestoneName();

        let labelTitle = document.createTextNode('Work remaining: ');
        labelCountsNode.appendChild(labelTitle);
        for (const k of ALL_LABELS_DISPLAYED_TO_USER) {
            if (k === UNLABELED) {
                labelCountsNode.appendChild(document.createTextNode('|| ')); // Separator.
            }

            let label = k;
            if (k !== UNLABELED && k !== MULTIPLE_LABELS) {
                label = label.toUpperCase(); // easier to see sizes.
            }

            const labelNode = document.createElement('strong');
            if (k !== UNLABELED) {
                labelNode.innerText = label;
            } else {
                const linkNode = document.createElement('a');
                linkNode.innerText = label;
                linkNode.href = GithubURLs.getIssueQueryNoSizeLabel(ownerName, repoName, milestone);
                labelNode.appendChild(linkNode);
            }
            labelCountsNode.appendChild(labelNode);
            labelCountsNode.appendChild(document.createTextNode(': '));

            let countNode = document.createTextNode(labelsDisplayedToUser[k] + ' ');
            labelCountsNode.appendChild(countNode);
        }

        let calcTitle = document.createElement('span');
        calcTitle.innerText = 'Calculator: days';
        calculatorNode.appendChild(calcTitle);
        for (const k of ALL_SIZES) {
            let label = '/' + k.trim().split(' ')[1].toUpperCase() + ' ';

            let labelNode = document.createElement('span');
            labelNode.innerText = label;
            calculatorNode.appendChild(labelNode);

            let inputNode = document.createElement('input');
            inputNode.id = getInputElementID(k);
            inputNode.style.maxWidth = '30px';
            calculatorNode.appendChild(inputNode);

            let spacer = document.createElement('span');
            spacer.innerText = ' ';
            calculatorNode.appendChild(spacer);
        }
        let calcResultNode = document.createElement('span');
        calcResultNode.id = RESULT_ID; // text added later.
        calculatorNode.appendChild(calcResultNode);
        let calculateButton = document.createElement('button');
        calculateButton.innerText = 'Recalculate';
        calculateButton.onclick = () => { calculateAndUpdateResults(labelsDisplayedToUser) };
        calculatorNode.appendChild(calculateButton);

        return outerContainer;
    }

    function calculateAndUpdateResults(sizes: { [index: string]: number; }) {
        let resultNode = document.getElementById(RESULT_ID);

        var numDays = 0;
        for (const k of ALL_SIZES) {
            let labelInputNode = document.getElementById(getInputElementID(k)) as HTMLInputElement;
            var daysPerLabel = parseInt(labelInputNode.value);
            if (isNaN(daysPerLabel)) {
                let defaultDays = DEFAULT_DAYS_PER_SIZE[k];
                daysPerLabel = defaultDays;
                labelInputNode.value = defaultDays.toString();
            }
            numDays += sizes[k] * daysPerLabel;
        }

        if (resultNode) {
            resultNode.innerText = ' = ' + numDays + ' days ';
        }
    }

    function extractMilestoneName(): string {
        return (document.querySelector(GithubDOMMilestone.SELECTOR_MILESTONE_NAME) as HTMLHeadingElement).innerText;
    }

    function getInputElementID(label: string) { return TAG + '-' + label.replace(' ', '-'); }
}

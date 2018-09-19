# Feature: Link issues to Pull Requests (and vice versa)
GitHub issues are created to address a product defect and Pull Requests are created to address one or more GitHub issues. This creates a desire for users to navigate from an issue to the Pull Request that addresses it, or vice versa. For example, if you click into an issue from the issues list, you may wonder, "Is there a pull request open for this?" However, by default GitHub [makes getting from issue to PR impractical](#built-in-ways-github-links-issues-to-prs).

To solve this problem, on an issue page, we insert a link for each PR that addresses this issue:

![Example of linking an issue to PR](im/link_issues_to_prs_example.png)

And on a PR page, we insert a link for each issue that the PR addresses:

![Example of linking a PR to an issue](im/link_issues_to_prs_example_vice_versa.png)

**It is recommended to add a GitHub access token when using this feature.** Without it, the feature may be rate limited by the GitHub API and will not work as well on private repositories.

## Criteria for PRs that address issues
We consider a PR to address an issue if the issue number appears in:
- The PR's title
- A commit summary (i.e. the first line)

We intentionally omit issues referenced in PR comments to reduce the number of API calls made.

## How we get PR data (and why it's not perfect)
We discover which PRs address which issues a few different ways:
- Scrape a PR page when opened
- Access the GitHub API

The GitHub API is rate limited so we only access it periodically: this can lead to situations where the links we insert aren't up-to-date with the current PR state. Users can work around this by visiting the PR page of each PR they'd like to force to be up-to-date, which we'll scrape without making a GitHub API request.

## Built-in ways GitHub links issues to PRs
By default, GitHub inserts the following links from issue to pull request:
- Labels displayed when hovering over an (i) icon. These (i) occur for **open PRs** when:
  - A commit contains "Closes #" ([example](https://github.com/mcomella/Spoon-Knife/issues/9#ref-commit-a42d680))
  - A PR comment contains "Closes #"
- "Closed this in `<commit>/<issue num>`". These occur for **closed PRs** when:
  - A commit contains "Closes #" ([example](https://github.com/mozilla-mobile/focus-android/issues/2685#event-1761232272))
  - A PR comment contains "Closes #" ([example](https://github.com/sindresorhus/refined-github/issues/1444#event-1760744066))

However, these are difficult to use because:
- They are never displayed in a consistent place in the page -- they're inserted chronologically
- One-click issue-to-PR links require users to remember to add the issue number to a comment; other links are more than one click
- The available links may change depending on PR state
- They don't work for a PR that addresses an issue but doesn't close it

GitHub creates other references from issues to pull requests but these pull requests are not guaranteed to address the issues they link to:
- "A commit referenced this issue": these commits may not be in a pull request at all
- "`<issue-num>` referenced this issue": this occurs any time an issue references another issue, which may not indicate a pull request is addressing an issue

## Other solutions
[Refined GitHub][rg] uses the built-in pull request addresses issue references mentioned above.

[waffle.io][waffle] creates a direct linking from PRs to issues on their kanban board but not in the standard GitHub interface.

[waffle]: https://waffle.io/
[rg]: https://github.com/sindresorhus/refined-github/

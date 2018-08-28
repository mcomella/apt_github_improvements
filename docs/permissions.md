# Explanation of required permissions
A complete list of requested permissions is always available in [the manifest](../manifest.json). This list will attempt to stay up-to-date. At the time of writing, this add-on uses the following permissions:

**run scripts on `github.com`:** in order to analyze GitHub page content and modify it to display our features to the user.

**webRequest to `bugzilla.mozilla.org/rest`:** we fetch bug summaries and resolution state and directly display it to users.

**webRequest to `api.github.com`**: we fetch the open pull request list and specific data from each one to understand which issues the PRs close.

**storage:** on disk, we store:
- User provided preferences
- State from GitHub (via API and scraping)
- Metadata about the last time we used the GitHub API

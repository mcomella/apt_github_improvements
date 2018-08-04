# Feature Philosophy
All APT GitHub Improvements features should address a user problem. These user problems should either be relevant to:
- The *majority* of GitHub users: we don't want to impose solutions to niche problems on *all* users
-  Mozilla/APT specifically: when possible, these features should not appear if the user is not on Mozilla/APT repositories so that this extension is useful to a broad audience

All features must be well explained: there is a document for each feature explaining the problem it solves and containing a screenshot.

Ideally, the feature set will remain small: having too many features makes it less clear what the purpose of the project is and more time consuming to vet before installation.

## Guidelines for features
Features:
- **Must not be harmful or surprising to some users.** For example, a user may accidentally trigger added keyboard shortcuts they didn't know about.
- **Must be additive:** they must not change, hide, or remove existing GitHub functionality. As a user, it's more difficult to install an extension if it may change functionality you are already familiar with.
- **Should address larger UX issues,** as opposed to minor ones: it's easier to add many features when they're small (see notes on small feature sets above).

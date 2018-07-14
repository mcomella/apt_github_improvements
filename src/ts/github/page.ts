namespace GithubPage {

    const MILESTONE_REGEX = '^/.+/.+/milestone/[0-9]+'
    export function isMilestone(location: Location): boolean {
        return !!location.pathname.match(MILESTONE_REGEX);
    }
}

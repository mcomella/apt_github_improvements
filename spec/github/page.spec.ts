describe('The GithubPage namespace', () => {

    it('can identify milestone pages', () => {
        const location = { pathname: '/mozilla-mobile/firefox-tv/milestone/13' } as Location;
        expect(GithubPage.isMilestone(location)).toBeTruthy();
    });

    it('will not identify the issues list as a milestone page', () => {
        const location = { pathname: '/mozilla-mobile/firefox-tv/issues' } as Location;
        expect(GithubPage.isMilestone(location)).toBeFalsy();
    });

});

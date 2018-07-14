namespace Log {
    const LOGTAG = 'github-issue-pr-linker';

    export function d(msg: string) { _log(msg, console.debug); }
    export function l(msg: string) { _log(msg, console.log); }
    export function w(msg: string) { _log(msg, console.warn); }
    export function e(msg: string) { _log(msg, console.error); }

    function _log(msg: string, fn: Function) {
        fn(`${LOGTAG}: ${msg}`);
    }
}

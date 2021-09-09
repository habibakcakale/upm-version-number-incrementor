module.exports.incrementVersionNumber = function (version, mode) {
    let [major, minor, patch] = version && version.split('.');
    switch (mode) {
        case `major`:
            major++;
            minor = patch = 0;
            break;
        case `minor`:
            minor++;
            patch = 0;
            break;
        case `patch`:
            patch++;
            break;
    }
    return `${major}.${minor}.${patch}`
}
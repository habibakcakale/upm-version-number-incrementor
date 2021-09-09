const { Command } = require('commander');
const glob = require("glob")
const { readFile, writeFile } = require('fs/promises');
const { incrementVersionNumber } = require('./versionNumber');

function findPackages(workingDirectory) {
    return new Promise((resolve, reject) => {
        glob(`${workingDirectory}/**/Assets/package.json`, (err, matches) => {
            if (err) {
                reject(err)
            } else {
                resolve(matches)
            }
        })
    })
}
function getDirty(packages) {
    return packages.find(item => item.isDirty);
}

async function main() {
    const program = new Command();
    program.version('0.0.1');
    program.option("-w, --working-directory <working directory>", "Working Directiry", "./");
    program.option('-p, --package <package name>', "Package to Update");
    program.option('-s, --semantic <mode>', 'Increment Semantic version', 'patch')
    program.parse(process.argv);

    var options = program.opts();
    console.log(options);

    var packagePaths = await findPackages(options.workingDirectory);
    var packageInfos = await Promise.all(packagePaths.map(async filePath => {
        const content = await readFile(filePath);
        const package = JSON.parse(content);
        return { filePath, name: package.name, package, isDirty: false }
    }))
    var packageInfo = packageInfos.find(item => item.name == options.package);

    if (packageInfo) {
        packageInfo.isDirty = true;
        packageInfo.package.version = incrementVersionNumber(packageInfo.package.version, options.semantic);
    }

    do {
        updatePackages(packageInfos, packageInfo, options.semantic);
    } while (packageInfo = getDirty(packageInfos));
    await Promise.all(packageInfos.map(item => writeFile(item.filePath, JSON.stringify(item.package, undefined, 2))))
}

function updatePackages(packageInfos, packageInfo, semantic) {
    packageInfos.forEach(info => {
        if (info.package.dependencies && packageInfo.name in info.package.dependencies) {
            info.package.dependencies[packageInfo.name] = packageInfo.package.version;
            info.isDirty = true;
            if (!info.hasVersionIncremented) {
                info.hasVersionIncremented = true;
                info.package.version = incrementVersionNumber(info.package.version, semantic);
            }
        }
    });
    packageInfo.isDirty = false;
}

main().then(console.log).catch(console.log);

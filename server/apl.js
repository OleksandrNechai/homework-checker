const execFile = require('child_process').execFile;
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));


function invokeApl(newAttemptDir) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Calling APL');
            console.log(`Dyalog path: ${config.dyalogPath}`);
            console.log(`Tests path: ${config.unitTestsPath}`);
            console.log(`-STUDENT_PATH=${newAttemptDir}`);
            execFile(config.dyalogPath,
                [config.unitTestsPath, `-STUDENT_PATH=${newAttemptDir}`],
                (error) => {
                    if (error) {
                        console.log('APL call failed');
                        reject(error);
                    } else {
                        console.log('APL call succeed');
                        resolve();
                    }
                });
        } catch (e) {
            console.log('APL call failed');
            reject();
        }
    });
}

exports.invokeApl = invokeApl;

const execFile = require('child_process').execFile;
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));


function invokeApl(newAttemptDir) {
    return new Promise((resolve, reject) => {
        try {
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

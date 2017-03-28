invokeApl = function (newAttemptDir) {
    return new Promise((resolve, reject) => {
        try {
            var execFile = require('child_process').execFile;
            const child =
                execFile('C:\\Program Files\\Dyalog\\Dyalog APL-64 15.0 Unicode\\dyalog.exe', // UPDATED when MOVE
                    ['C:\\Bond\\BondUnitJson.dws', '-STUDENT_PATH=' + `${newAttemptDir}`],    // UPDATED when MOVE
                    function (error, stdout, stderr) {
                        console.log("APL call succeed");
                        resolve();
                    });
        }
        catch (e) {
            console.log("APL call failed");
            reject();
        }
    });
}

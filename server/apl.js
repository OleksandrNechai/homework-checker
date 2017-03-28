
invokeApl = function (newAttemptDir) {  
  return new Promise((resolve, reject) => {
        if (true) {
            var execFile = require('child_process').execFile;
            const child =
                execFile('C:\\Program Files\\Dyalog\\Dyalog APL-64 15.0 Unicode\\dyalog.exe',
                    ['C:\\Bond\\BondUnitJson.dws', '-STUDENT_PATH='+`${newAttemptDir}`],
                    function (error, stdout, stderr) {
                        console.log("Done APL call");                       
                        resolve();
                    });          
        }
    });
    
}

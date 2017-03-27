/* Links followed:
 * https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d#.7be0s3xvy
 * https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
*/

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');
const execFile = require('child_process').execFile;
const multer = require('multer');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
}));

let config;
fs.readFile(`${__dirname}/config.json`, (err, data) => {
    if (err) throw err;
    config = JSON.parse(data);
    if (!config.appId) {
        throw new Error('No appId specified in the config.json file. See https://www.youtube.com/watch?v=HIf0JW7JhcE');
    }
    if (!config.appSecret) {
        throw new Error('No appSecret specified in the config.json file. See https://www.youtube.com/watch?v=HIf0JW7JhcE');
    }
});

// Always return the main index.html, so react-router render the route in the client
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
// });


function _request(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, res, body) => {
            if (!error && res.statusCode === 200) {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (err) {
                    resolve(body);
                }
            } else {
                reject(error);
            }
        });
    });
}

async function fetchUser(accessToken) {
    const appAccessToken = await _request(
        `https://graph.facebook.com/oauth/access_token?client_id=${config.appId}&client_secret=${config.appSecret}&grant_type=client_credentials`);
    const debug = await _request(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&${appAccessToken}`);
    const userId = debug.data.user_id;
    const user = await _request(
        `https://graph.facebook.com/v2.8/${userId}?access_token=${accessToken}&fields=id,name,email`);
    return user;
}

app.get('/api/login/:accessToken', async (req, res) => {
    const accessToken = req.params.accessToken;
    try {
        const user = await fetchUser(accessToken);
        if (!user.id) {
            res.status(403).send('User is not authorized');
        }
        res.json(user);
    } catch (e) {
        res.status(403).send(`User is not authorized ${e}`);
    }
});

async function checkUserAndRunIfOk(req, res, func) {
    const accessToken = req.params.accessToken;
    try {
        const user = await fetchUser(accessToken);
        if (!user.id) {
            res.status(403).send('User is not authorized');
        }
        func(user);
    } catch (e) {
        res.status(403).send(`User is not authorized or runtime error occured: ${e}`);
    }
}

// const upload = multer({ dest: 'files/' });

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'tmp_uploads/');
    },
    filename(req, file, cb) {
        cb(null, 'src.dws'); // Appending .jpg
    }
});

const upload = multer({ storage });

app.post('/api/new-attempt/:clientTimeStamp/:accessToken', upload.single('file'), (req, res) => {
    checkUserAndRunIfOk(req, res, (user) => {
        const userDir = `attempts/${user.id}`;
        const newAttemptDir = `${userDir}/${req.params.clientTimeStamp}`;
        const tempFile = 'tmp_uploads/src.dws';

        if (!fs.existsSync(tempFile)) {
            res.send('No temp file!');
            return;
        }

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
            fs.writeFileSync(`${userDir}/user.json`, JSON.stringify(user), 'utf8');
        }

        fs.mkdirSync(newAttemptDir);
        const stream = fs.createReadStream(tempFile).pipe(fs.createWriteStream(`${newAttemptDir}/src.dws`));
        stream.on('finish', () => {
            fs.unlinkSync(tempFile);
            invokeApl(newAttemptDir).then(() => res.send('Done!'));
        });
    });
});

const mode = 'fake';
function invokeApl(newAttemptDir) {
    return new Promise((resolve, reject) => {
        if (mode === 'fake') {
            try {
                const stream = fs.createReadStream('apl/results.json').pipe(fs.createWriteStream(`${newAttemptDir}/results.json`));
                stream.on('finish', () => {
                    resolve();
                });
            } catch (e) {
                reject();
            }
        } else {
            var execFile = require('child_process').execFile;
            const child =
                execFile('C:\\Program Files\\Dyalog\\Dyalog APL-64 15.0 Unicode\\dyalog.exe',
                    ['C:\\Users\\mud\\Desktop\\BondUnitJson.dws', '-STUDENT_PATH='+`${newAttemptDir}`],
                    function (error, stdout, stderr) {
                        console.log("Done APL call");                       
                    });
            resolve();
        }
    });
}

app.get('/api/attempts/:accessToken', upload.single('file'), (req, res) => {
    checkUserAndRunIfOk(req, res, (user) => {
        const userDir = `attempts/${user.id}`;
        const userToRetun = user;
        userToRetun.attempts = [];

        if (!fs.existsSync(userDir)) {
            res.json(userToRetun);
            return;
        }
        const attemptDirectories = getDirectories(userDir);
        if (!attemptDirectories.length) {
            res.json(userToRetun);
            return;
        }

        userToRetun.attempts = attemptDirectories.filter(isValidAttempt).map(attemptFromDir);
        res.json(userToRetun);

        function getDirectories(srcpath) {
            return fs.readdirSync(srcpath)
                .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
        }

        function isValidAttempt(dir) {
            const resultPath = `${userDir}/${dir}/results.json`;
            return fs.existsSync(resultPath) && isJson(fs.readFileSync(resultPath));

            function isJson(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        }

        function attemptFromDir(dir) {
            const resultPath = `${userDir}/${dir}/results.json`;
            const timeStamp = Number(dir);
            const results = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
            return {
                timeStamp,
                results
            };
        }
    });
});

module.exports = app;

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

async function login(req, res) {
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
}

app.get('/api/login/:accessToken', login);

app.get('/api/apl', (req, res) => {
    execFile('C:\\Program Files\\Dyalog\\Dyalog APL-64 15.0 Unicode\\dyalog.exe',
        ['C:\\Users\\mud\\Desktop\\BondUnit.dws', '-STUDENT_DWS=C:\\Users\\mud\\Desktop\\Bybko_Nataliia.dws', '-STUDENT_NAME=Bybko_Nataliia'],
        () => {
            console.log('Done APl call');
            res.send('Done APl call');
        });
});

module.exports = app;

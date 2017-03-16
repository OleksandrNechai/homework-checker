/* Links followed:
 * https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d#.7be0s3xvy
 * https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
*/

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var config;
fs.readFile(__dirname + '/config.json', (err, data) => {
    if (err) throw err;
    config = JSON.parse(data);
    if (!config.appId) {
        throw new Error("No appId specified in the config.json file. See https://www.youtube.com/watch?v=HIf0JW7JhcE");
    }
    if (!config.appSecret) {
        throw new Error("No appSecret specified in the config.json file. See https://www.youtube.com/watch?v=HIf0JW7JhcE");
    }
});

// Always return the main index.html, so react-router render the route in the client
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
// });
var request = require('request');
app.post('/api/login', function (req, res) {
    const { accessToken, id, name, email } = req.body;

    request.get(`https://graph.facebook.com/oauth/access_token?client_id=${config.appId}&client_secret=${config.appSecret}&grant_type=client_credentials`,
        (error, response, appAccessToken) => {
            request.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&${appAccessToken}`,
                (error, response, body) => {
                    console.log(JSON.parse(body).data.user_id);
                }
            )
        });

    res.send('API is running');
});

app.get('/api/apl', (req, res) => {
    var execFile = require('child_process').execFile;
    const child = 
    execFile('C:\\Program Files\\Dyalog\\Dyalog APL-64 15.0 Unicode\\dyalog.exe', 
    ['C:\\Users\\mud\\Desktop\\BondUnit.dws', '-STUDENT_DWS=C:\\Users\\mud\\Desktop\\Bybko_Nataliia.dws', '-STUDENT_NAME=Bybko_Nataliia'], 
    function (error, stdout, stderr) {
        console.log("Done APl call");
        res.send("Done APl call");
    });
});

module.exports = app;
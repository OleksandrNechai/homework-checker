/*
    First in root folder run 'npm install' and then 'npm run build' 
    To run the app: 'node index'
    Run 'set PORT=80' before if you want to change the port
    In this folder, create folders 'attempts' and 'tmp_uploads'
*/
'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
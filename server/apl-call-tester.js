const invokeApl = require('./apl.js').invokeApl;

invokeApl('C:\\')
    .then(() => console.log('success'))
    .catch((err) => {
        console.log('Error happened. Description:');
        console.log(err);
    });

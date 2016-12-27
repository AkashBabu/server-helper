









var Logger = require('../index');

var fs = require('fs');
var Console = new console.Console(fs.createWriteStream('logger-switch-test.txt'), process.stderr);

var logger = new Logger('Test', Console);

logger.activate();

logger.log('Akash', 'hi' + 'asdf');

// logger.deactivate();
logger.log('This is error msg');
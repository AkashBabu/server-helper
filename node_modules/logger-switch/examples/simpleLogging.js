









var Logger = require('../index');

var logger = new Logger('Test');

logger.activate();

logger.log('Akash', 'hi' + 'asdf');

// logger.deactivate();
logger.error('This is error msg');
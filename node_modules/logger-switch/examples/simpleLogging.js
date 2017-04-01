









var Logger = require('../index');

var logger = new Logger('Test');

logger.activate();
logger.timestamp('DD MMM YY, HH:mm a');

logger.log('hi' + ' Cavin', "how r u??");

logger.deactivate();
logger.error('This will not be logger');

logger.activate();
logger.timestamp(null);
logger.log('this will not have timstamp');
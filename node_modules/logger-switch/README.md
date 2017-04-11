# logger-switch
Nodejs library to turn ON/OFF logging and also deactivate/activate logging only in a particular peice of code, or use your own logger etc.







## Usage

```javascript
var Logger = require('logger-switch');

var logger = new Logger('Test');

logger.activate();
logger.timestamp('DD MMM YY, HH:mm a');

logger.log('hi' + ' Cavin', "how r u??");
//Prints : Test (12 Feb 17, 11:37 am): hi Cavin how r u??  

logger.deactivate();
logger.error('This will not be logger');
// This will not be printed

logger.activate();
logger.timestamp(null);
logger.log('this will not have timstamp')
//Prints: Test: this will not have timstamp
```

## Constructor

**Logger**(name, logger)  
*name* - Prefix to be used while logging. *default* is 'Log :'  
*logger* - Custom logger to be used. *default* is stdout and stderr

## Methods

**activate()**  
Will Enable logging activity

**deactivate()**
Will disable logging activity

**timestamp(format)**
Will enable/disable timestamp logging.
*format* - Supports momentjs timestamp format string. if `null` is passed then timestamp logging will be disabled  


Similarly you can create many such logger and activate only the required logger from the configuration file, depending on env being used.  
For more [examples](https://github.com/AkashBabu/logger-switch/tree/master/examples)
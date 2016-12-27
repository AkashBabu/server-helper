# logger-switch
Nodejs library to turn ON/OFF logging and also deactivate/activate logging only in a particular peice of code, or use your own logger etc.







## Usage

```javascript
var Logger = require('logger-switch');

var logger = new Logger('Test');

logger.activate();

logger.log('Akash', 'hi' + 'asdf'); // this will be logged

logger.deactivate();
logger.error('This is error msg'); // this will not be logged
```

Similarly you can create many such logger and activate only the required logger from the configuration.  
For more [examples](https://github.com/AkashBabu/logger-switch/tree/master/examples)
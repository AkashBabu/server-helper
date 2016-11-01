const mongojs = require('mongojs');
const async = require('async');
const helperDb = require('../lib/helperDb');

var args = process.argv.slice(2);

helperDb.copyCollection(args[0], args[1], args[2], args[3] || args[1], function(err, n) {
    err ? console.log('Collection copying failed') : console.log('Collection copied successfully');
})

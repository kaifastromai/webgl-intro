"use strict";
var express = require('express');
require = require('esm')(module);
//module.exports = require('./app.js');
var app = express();
app.use(express.static(__dirname + '/source'));
app.listen(8080);
//const __dirname=dirname(fileURLToPath(import.meta.url));
//# sourceMappingURL=server.js.map
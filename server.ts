var express = require('express');
require = require('esm')(module);
//module.exports = require('./app.js');
var app = express();
app.use(express.static('./'));
app.use(express.static('./shaders'));
app.use(express.static('/dist/js'));
app.listen(8080);
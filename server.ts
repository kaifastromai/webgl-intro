var express = require('express');
require = require('esm')(module);
//module.exports = require('./app.js');
var app = express();
app.use(express.static('source'));
app.use(express.static('source/shaders'));

app.listen(8080);
//const __dirname=dirname(fileURLToPath(import.meta.url));
//

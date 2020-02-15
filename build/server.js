import * as http from 'http';
var fs = require('fs');
var serveStatic = require('serve-static');
var finalHandler = require('finalhandler');
var serve = serveStatic('./', { 'index': ['index.html', 'index.htm'] });
//const __dirname=dirname(fileURLToPath(import.meta.url));
function onRequest(req, res) {
    serve(req, res, finalHandler(req, res));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', null, (error, data) => {
        if (error) {
            res.writeHead(404);
            res.write('File Not Found');
        }
        else {
            res.write(data);
        }
        res.end();
    });
}
http.createServer(onRequest).listen(8080);
//# sourceMappingURL=server.js.map
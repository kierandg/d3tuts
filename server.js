var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;
	
var contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.json':   'application/json; charset=utf-8',
    '.css':   'text/css; charset=utf-8',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg', 
	'.jpg': 'image/jpeg',
	'.xml': 'application/xml; charset=utf-8',
	'.kml': 'application/vnd.google-earth.kml+xml; charset=utf-8',
	'.kmz': 'application/vnd.google-earth.kmz',
};

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) { 
		filename += '/index.html';
	}

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {"Content-Type": contentTypes[path.extname(filename)]});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
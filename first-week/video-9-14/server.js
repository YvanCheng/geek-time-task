const http = require('http');
http.createServer((request, response)=>{
    let body = [];
    request.on('error', (error) => {
        console.log(error);
    }).on('data', (chunk) => {
        body.push(chunk.toString());
    }).on('end', () => {
        const buffBody = [Buffer.from(body.toString())];
        body = Buffer.concat(buffBody).toString();
        console.log("body:", body);
        response.writeHead(200, {'Content-Type': "text/html"});
        response.end('Hello Wrold\n');
    })
}).listen(8090);

console.log("server started");
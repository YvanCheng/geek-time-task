let http = require("http");
let fs = require("fs");
let archiver = require("archiver");
let child_process = require("child_process");
let querystring = require("querystring");

const GitHubClientId =  "demo";

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=${GitHubClientId}`);

http.createServer(function(request, response) {
    const query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    publish(query.token);
});

function publish(token) {
    let request = http.request({
        hostname: "http://czworld.show",
        port: 22,
        method: "POST",
        path: "/xy-server?token=" + token,
        headers: {
            'Content-type': 'application/octet-stream'
        }
    }, response => {
        console.log(response);
    });
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.directory('./sample/', false);
    archive.finalize();
    archive.pipe(request);
}
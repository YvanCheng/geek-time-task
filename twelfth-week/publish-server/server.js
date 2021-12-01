let http = require("http");
let https = require("https");
let unzipper = require("unzipper");
let querystring = require("querystring");

function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info){
        response.write(`<a href='http://czworld.show/?token=${info.access_token}'>publish</a>`);
        response.end();
    });
}

function getToken(code, client_id, client_secret, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`,
        port: 443,
        method: 'POST'
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += chunk.toString();
        });
        response.on("end", chunk => {
            callback(querystring.parse(body));
        });
    });
    request.end();
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getUser(query.token, info => {
        if (info.login === "yvanlong") {
            request.pipe(unzipper.Extract({ path: '../xy-server/' }));
            request.on('end', function() {
                response.end("success");
            });
        }
    });
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: "/user",
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": "toy-publish"
        }
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += chunk.toString();
        });
        response.on("end", chunk => {
            callback(JSON.parse(body));
        });
    });
    request.end();
}

http.createServer(function(request, response)   {
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }
    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }
}).listen(22);
const http = require('http');

const serverHtml = `<html>
    <head>
        <style>
            .geek-task-content{
                width: 100%;
                color: #0033ff;
                font-size: 14px;
            }
            body div #my-test-container {
                width: 200px;
                display: flex;
            }
        </style>
    </head>
    <body>
        <div class="geek-task-content">
            <div hide>
                <div id="my-test-container">
                    TTTTTTTTTTTT
                </div>
            </div>
        </div>
    </body>
</html>
`;

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
        response.end(`${serverHtml}\n`);
    })
}).listen(8090);

console.log("server started");
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
                height: 100px;
                display: flex;
                background-color: rgb(255,234,267);
            }
            .red-container {
                background-color: rgb(105,214,209);
                width: 100px;
                height: 100px;
            }
            .yellow-container {
                background-color: rgb(9,214,222);
                width: 100px;
                height: 100px;
            }
        </style>
    </head>
    <body>
        <div class="geek-task-content">
            <div>
                <div id="my-test-container">
                    <div class="red-container"></div>
                    <div class="yellow-container"></div>
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
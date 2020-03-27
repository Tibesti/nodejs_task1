const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            fs.appendFile('message.txt', result.message, function (err) {
                if (err) throw err;
              });
            res.end(`File created and message saved`);
        });
    } 
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(`
            <!doctype html>
            <html>
            <body>
                <form action="/message" method="post">
                    <input type="text" name="message" /><br />
                    <button>Save</button>
                </form>
            </body>
            </html>
        `);
    }
});
server.listen(8080);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}
const fs = require("fs");
const http = require("http");

const PORT = 3000;
const buffer = fs.readFileSync(__dirname + "/file.txt");
const lines = buffer.toString("utf-8").split("\n");
const chunks = chunk(lines, 10);

http
  .createServer(async function (req, res) {
    res.writeHead(200, {
      "Content-Type": "text/plain;charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Access-Control-Allow-Origin": "*",
    });
    for (let index = 0; index < chunks.length; index++) {
      setTimeout(() => {
        let content = chunks[index].join("\r\n");
        res.write(`${content.length.toString(16)}\r\n${content}\r\n`);
      }, index * 1000);
    }
    setTimeout(() => {
      res.end();
    }, chunks.length * 1000);
  })
  .listen(PORT, () => {
    console.log(`应用已经启动：http://localhost:${PORT}/`);
  });

function chunk(arr, len) {
  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}

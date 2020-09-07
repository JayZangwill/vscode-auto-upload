const vscode = require("vscode");
const { method, protocol, path, port, hostname } = vscode.workspace.getConfiguration('autoUpload');
const http = require(protocol);

module.exports = function(param) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      method,
      path,
      port,
      hostname,
    }, res => {
      const responseBuffer = [];
      res.on('data', data => {
        responseBuffer.push(data);
      })

      res.on('error', err => {
        reject(err);
      })

      res.on('end', function handleStreamEnd() {
        const responseDataBuffer = Buffer.concat(responseBuffer);
        const responseData = JSON.parse(responseDataBuffer.toString());

        if (responseData.status === 200 || responseData.status === 204 || responseData.code === '0') {
          resolve(responseData)
        } else {
          reject(responseData)
        }
      });
    })

    if (param) {
      req.write(JSON.stringify(param))
    }
    
    req.end()
  })
}
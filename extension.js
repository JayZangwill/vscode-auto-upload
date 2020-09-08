const vscode = require("vscode");
const clipboardy = require('clipboardy');
const fs = require('fs');
const request = require("./utils/request");
const uploader = require("./utils/upload");
let uploading = false;

function activate(context) {
  const disposable = vscode.commands.registerCommand("auto-upload.upload", () => {
    check() && main();
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

exports.deactivate = deactivate;

module.exports = {
  activate,
  deactivate
};

function check() {
  if (uploading) {
    vscode.window.showInformationMessage("有图片上传中");
    return false;
  }
  // 获取当前编辑文件
  const editor = vscode.window.activeTextEditor;
  if (!editor) return false;

  const fileUri = editor.document.uri;
  if (!fileUri) return false;

  if (fileUri.scheme === "untitled") {
    vscode.window.showErrorMessage("请保存文件");
    return false;
  }

  return true;
}

async function main() {
  const imagePaths = clipboardy.readSync().replace(/"/g, '').split('\n');

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const ext = imagePath.split('.')[1];

    if (!(/a?png|jpe?g|gif|svga?|webp/.test(ext)) || /^(https?)/.test(imagePath)) {
      vscode.window.showErrorMessage('请复制正确的图片路径');
      return;
    }

    imagePaths[i] = imagePath.trim();
  }

  const uploaderPromises = [];

  // 开始上传
  uploading = true;

  const { data } = await request({
    funcPoint: 'oss',
  })

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const ext = imagePath.split('.')[1];

    if (!fs.existsSync(imagePath)) {
      continue;
    }

    const imageFileName = data.token.split(':')[1].slice(0,8) + ('' + +new Date).slice(-4) + '.' + ext;
    const p = new Promise((resolve, reject) => {
      uploader({
        uploadToken: data.token,
        fileName: imageFileName,
        path: imagePath
      }).then(() => {
        resolve(data.domain + imageFileName);
      }).catch(err => {
        reject(err);
      });
    });
      
    uploaderPromises[i] = p;
  }

  Promise.all(uploaderPromises).then(results => {
    const resultsLen = results.length;
    const editor = vscode.window.activeTextEditor;

    vscode.window.showInformationMessage("上传成功");

    editor.edit(textEditorEdit => {
      // 将上传结果拼接到光标处，如果图片大于光标数，则全部拼接到最后一个光标处;如果光标数大于图片数则不处理
      editor.selections.forEach((selection, i) => {
        resultsLen > i && textEditorEdit.replace(selection, i === editor.selections.length - 1 ? results.join('\n') : results.shift());
      });
    });
  }).catch(err => {
    vscode.window.showErrorMessage(err);
  }).finally(() => {
    uploading = false;
  });
}

const vscode = require("vscode");
const clipboardy = require('clipboardy');
const fs = require('fs');
const request = require("./utils/request");
const upload = require("./utils/upload");
let uploading = false;

function activate(context) {
  const disposable = vscode.commands.registerCommand("auto-upload.upload", () => {
    main();
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

async function main() {
  if (uploading) {
    vscode.window.showInformationMessage("有图片上传中");
    return;
  }
  // 获取当前编辑文件
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const fileUri = editor.document.uri;
  if (!fileUri) return;

  if (fileUri.scheme === "untitled") {
    vscode.window.showErrorMessage("请保存文件");
    return;
  }
  
  const imagePath = clipboardy.readSync().replace(/"/g, '');
  const ext = imagePath.split('.')[1];

  if (!(/a?png|jpe?g|gif|svga?|webp/.test(ext))) {
    vscode.window.showErrorMessage('请复制正确的图片路径');
    return;
  }
  
  if (fs.existsSync(imagePath)) {
    uploading = true;

    request({
      funcPoint: 'oss',
    }).then(({ data }) => {
      const imageFileName = data.token.slice(0,8) + '.' + ext;
      
      upload({
        uploadToken: data.token,
        fileName: imageFileName,
        path: imagePath
      })
        .then(() => {
          vscode.window.showInformationMessage("上传成功");
          editor.edit((textEditorEdit) => {
            textEditorEdit.replace(editor.selection, data.domain + imageFileName);
          });
        })
        .catch(err => {
          vscode.window.showErrorMessage(err);
        }).finally(() => {
          uploading = false;
        });
    }).catch(() => {
      uploading = false;
    })
  }
}

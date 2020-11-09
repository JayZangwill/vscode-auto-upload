# auto-upload vscode插件

从本地复制图片的本地路径，然后粘贴到编辑器里，图片会自动上传到七牛云，并将连接粘贴到当前光标位置

```json
"autoUpload.hostname": "" 请求获取七牛token的服务器host
"autoUpload.port": 80 请求服务器的端口，默认80
"autoUpload.path": "" 请求接口的path
"autoUpload.method": "POST" 请求方法
"autoUpload.protocol": "http" 请求协议（https记得把prot改为443）
```

windows需要对文件按住`shift+鼠标右键`然后在弹出的菜单中选择复制为路径

mac需要选中文件按`command+option+c`即可复制文件路径

复制文件路径完毕后到编辑器中按下`ctrl+alt+v`(mac为`command+alt+v`)即可得到拼接好的cdn地址


<details>
  <summary>普通使用示例：</summary>
  <img src="https://github.com/JayZangwill/vscode-auto-upload/raw/master/img/guide.gif" alt="clipboard.gif">
</details>

<details>
  <summary>多张图片上传示例：</summary>
  <img src="https://github.com/JayZangwill/vscode-auto-upload/raw/master/img/guide1.gif" alt="clipboard.gif">
</details>

如果想再复制一遍上次生成的路径，直接可以在编辑器中按下`ctrl+v`(mac为`command+v`)即可，因为插件在每次上传完图片后会将cdn图片路径复制到剪切板里

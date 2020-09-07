const qiniu = require("qiniu");
const config = new qiniu.conf.Config({
  zone: qiniu.zone.Zone_z0,
  useHttpsDomain: true
});

const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

module.exports = function (params) {
  return new Promise((resolve, reject) => {
    const { uploadToken, fileName, path } = params;

    formUploader.putFile(uploadToken, fileName, path, putExtra, function (
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        return reject(respErr);
      }

      if (respInfo.statusCode == 200) {
        resolve(respBody);
      } else {
        resolve(respBody);
      }
    });
  });
};

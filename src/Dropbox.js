
export function dropboxPicker(cb, multi=true) {
  const options = {
    linkType: "preview",
    multiselect: multi,
    folderselect: false,
    success: function (files) {
      const res = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        res.push(f.link);
      }
      if (res.length > 0) {
        cb(res);
      }
    },
    sizeLimit: 65 * 1024 * 1024 // 65mb
  };
  window.Dropbox.choose(options);
}
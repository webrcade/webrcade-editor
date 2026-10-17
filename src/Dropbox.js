
export function dropboxPicker(cb, multi=true) {
  const options = {
    linkType: "preview",
    multiselect: multi,
    folderselect: false,
    success: function (files) {
      const res = [];
      const names = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        res.push(f.link);
        names.push(f.name);
      }
      if (res.length > 0) {
        cb(res, names);
      }
    },
    sizeLimit: 2 * 1024 * 1024 * 1024, // 2gb
  };
  window.Dropbox.choose(options);
}
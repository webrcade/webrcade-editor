
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
    sizeLimit: 600 * 1024 * 1024 // 65mb
  };
  window.Dropbox.choose(options);
}
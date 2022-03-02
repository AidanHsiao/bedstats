const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  writeFile: (file, data) => ipcRenderer.invoke("writeFile", file, data),
  readFile: async (file) => {
    const data = await ipcRenderer.invoke("readFile", file);
    return data;
  },
});

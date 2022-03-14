const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  writeFile: (file, data) => ipcRenderer.invoke("writeFile", file, data),
  readFile: async (file) => {
    const data = await ipcRenderer.invoke("readFile", file);
    return data;
  },
  startWatcher: () => ipcRenderer.invoke("startWatcher"),
  clearWatcher: () => ipcRenderer.invoke("clearWatcher"),
  manualInput: (username) => ipcRenderer.invoke("manualInput", username),
  sendData: (channel, func) => {
    ipcRenderer.on(channel, func)
  }
});

const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1152,
    height: 648,
    minWidth: 960,
    minheight: 540,
    webPreferences: {
      //   devTools: false,
    },
    fullscreenable: false,
    fullscreen: false,
    maximizable: false,
    resizable: true,
    autoHideMenuBar: true,
  });
  win.setMenu(null);
  win.setAspectRatio(16 / 9);
  win.loadFile("html/index.html");
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

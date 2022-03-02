const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1152,
    height: 648,
    minWidth: 960,
    minheight: 540,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    fullscreenable: false,
    fullscreen: false,
    resizable: true,
    autoHideMenuBar: true,
  });
  //   win.setMenu(null)
  win.setAspectRatio(16 / 9);
  win.loadFile("html/index.html");
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.handle("writeFile", async (event, file, data) => {
  await writeToFile(file, data);
});

ipcMain.handle("readFile", async (event, file) => {
  const data = await readFile(file);
  return data;
});

async function writeToFile(file, data) {
  let dataPath = app.getPath("appData");
  if (!fs.existsSync(path.join(dataPath, "bedwars-electron"))) {
    await fs.mkdirSync(path.join(dataPath, "bedwars-electron"));
  }
  dataPath = `${app.getPath("appData")}/bedwars-electron/${file}`;
  fs.writeFileSync(dataPath, JSON.stringify(data), (e) => {
    if (e) {
      console.log(e);
    }
  });
}

async function readFile(file) {
  let dataPath = `${app.getPath("appData")}/bedwars-electron/${file}`;
  try {
    if (!fs.existsSync(dataPath)) {
      await fs.writeFileSync(dataPath, {}, (e) => {
        if (e) {
          console.log(e);
        }
      });
    }
  } catch (e) {
    if (file === "settings.json") {
      await fs.writeFileSync(
        dataPath,
        JSON.stringify({
          theme: "sky",
          hypixelAPIKey: "",
          scoreCutoff: 2500,
          scoreConstant: 1,
        })
      ); // Default Settings
    } else {
      await fs.writeFileSync(dataPath, JSON.stringify({}));
    }
  }
  const data = await fs.readFileSync(dataPath, "utf-8", (e) => {
    if (e) {
      console.log(e);
    }
  });
  return JSON.parse(data);
}

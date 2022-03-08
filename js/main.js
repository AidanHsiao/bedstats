const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const axios = require("axios")

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
  watchLogs();
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
  dataPath = path.join(`${app.getPath("appData")}`, "bedwars-electron", file);
  fs.writeFileSync(dataPath, JSON.stringify(data), (e) => {
    if (e) {
      console.log(e);
    }
  });
}

async function readFile(file) {
  let dataPath = app.getPath("appData");
  if (!fs.existsSync(path.join(dataPath, "bedwars-electron"))) {
    await fs.mkdirSync(path.join(dataPath, "bedwars-electron"));
  }
  dataPath = path.join(`${app.getPath("appData")}`, "bedwars-electron", file);
  try {
    if (!fs.existsSync(dataPath)) {
      await fs.writeFileSync(dataPath, {}, (e) => {
        if (e) {
          console.log(e);
        }
      });
    }
  } catch (e) {
    switch (file) {
      case "settings.json": {
        await fs.writeFileSync(
          dataPath,
          JSON.stringify({
            theme: "sky",
            hypixelAPIKey: "",
            scoreCutoff: 2500,
            scoreConstant: 1,
          })
        ); // Default Settings
        break;
      }
      default: {
        await fs.writeFileSync(dataPath, JSON.stringify({}));
        break;
      }
    }
  }
  const data = await fs.readFileSync(dataPath, "utf-8", (e) => {
    if (e) {
      console.log(e);
    }
  });
  return JSON.parse(data);
}

let watcher;
let playerInfo = []
let playerNames = []
let playerScores = []

async function watchLogs() {
  const settingsData = await readFile("settings.json");
  const mcPath = process.platform === "darwin" ? "minecraft" : ".minecraft";
      logPath = path.join(
        app.getPath("home"),
        ".lunarclient",
        "logs",
        "launcher",
        "renderer.log"
      );
  watcher = fs.watch(logPath, async (event, file) => {
    const data = await fs.readFileSync(logPath, "utf-8", (e) => {
      if (e) {
        console.log(e);
      }
    });
    const lines = data.toString().replace(/\r\n/g, "\n").split("\n");
    let lineData;
      const lastLine = lines[lines.length - 3]
      if (lastLine.includes("[Client thread/INFO]: [CHAT] ")) {
        lineData = lastLine.split("[Client thread/INFO]: [CHAT] ")[1].replaceAll("????? ", "").replaceAll("?", "")
      }
  if (lineData) {
  const splitData = lineData.split("")
        splitData.forEach((l, idx) => {
          if (l === "�") {
            splitData[idx] = ""
            splitData[idx + 1] = ""
          }
        })
        lineData = splitData.join("")
        const lastLog = lineData
        const username = lineData.split("has joined (").length >= 2 ? lineData.split("has joined (")[0].replaceAll(" ","") : ""
        if (username) {
          addData(username)
        }
      }
  });
}

async function addData(u) {
  const settingsData = await readFile("settings.json")
  const playerData = await getPlayerData(settingsData.hypixelAPIKey, u)
  const bwData = playerData.player.stats.Bedwars
  const stars = await calculateStars(bwData.Experience)
  const score = await calculateScore(
        {
          stars: stars,
          fkdr: bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
          bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
          wlr: bwData.wins_bedwars / bwData.losses_bedwars,
          finals: bwData.final_kills_bedwars,
          beds: bwData.beds_broken_bedwars,
          wins: bwData.wins_bedwars,
        },
        settingsData
      );
      if (!playerNames.includes(u)) {
  playerInfo.push({
    name: u,
    stars: stars,
    kdr: bwData.kills_bedwars / bwData.deaths_bedwars,
    fkdr: bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
    bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
    winP: 100 * bwData.wins_bedwars / (bwData.losses_bedwars + bwData.wins_bedwars),
    score: score
  })
  playerNames.push(u)
  playerScores.push(score)
}
  console.log(playerInfo)
}

async function getPlayerData(key, name) {
  let uuid;
  let playerData;
  try {
    resp = await axios.get(
     `https://api.ashcon.app/mojang/v2/user/${name}`
    );
    uuid = resp.data.uuid
  } catch (e) {
    console.log(e.response.status)
  }
  try {
    const resp = await axios.get(
      `https://api.hypixel.net/player?key=${key}&uuid=${uuid}`
    );
    playerData = resp.data;
  } catch (e) {
    console.log(e.response.status)
  }
  const dataArrayNone = [
    "wins_bedwars",
    "kills_bedwars",
    "final_kills_bedwars",
    "beds_broken_bedwars",
    "eight_one_wins_bedwars",
    "eight_one_kills_bedwars",
    "eight_one_final_kills_bedwars",
    "eight_one_beds_broken_bedwars",
    "eight_two_wins_bedwars",
    "eight_two_kills_bedwars",
    "eight_two_final_kills_bedwars",
    "eight_two_beds_broken_bedwars",
    "four_three_wins_bedwars",
    "four_three_kills_bedwars",
    "four_three_final_kills_bedwars",
    "four_three_beds_broken_bedwars",
    "four_four_wins_bedwars",
    "four_four_kills_bedwars",
    "four_four_final_kills_bedwars",
    "four_four_beds_broken_bedwars",
  ];
  const dataArrayOne = [
    "losses_bedwars",
    "deaths_bedwars",
    "final_deaths_bedwars",
    "beds_lost_bedwars",
    "eight_one_losses_bedwars",
    "eight_one_deaths_bedwars",
    "eight_one_final_deaths_bedwars",
    "eight_one_beds_lost_bedwars",
    "eight_two_losses_bedwars",
    "eight_two_deaths_bedwars",
    "eight_two_final_deaths_bedwars",
    "eight_two_beds_lost_bedwars",
    "four_three_losses_bedwars",
    "four_three_deaths_bedwars",
    "four_three_final_deaths_bedwars",
    "four_three_beds_lost_bedwars",
    "four_four_losses_bedwars",
    "four_four_deaths_bedwars",
    "four_four_final_deaths_bedwars",
    "four_four_beds_lost_bedwars",
  ];
  for (let item of dataArrayNone) {
    if (!playerData.player.stats.Bedwars[item]) {
      playerData.player.stats.Bedwars[item] = 0;
    }
  };
  for (let item of dataArrayOne) {
    if (!playerData.player.stats.Bedwars[item]) {
      playerData.player.stats.Bedwars[item] = 1;
    }
  };
  return playerData;
}

const xpPerPrestige = 487000;

function calculateStars(exp) {
  const prestiges = Math.floor(exp / xpPerPrestige);
  let remainder = exp % xpPerPrestige;

  let numStars = prestiges * 100;

  if (remainder >= 500) {
    remainder = remainder - 500;
    numStars++;
  }

  if (remainder >= 1000) {
    remainder = remainder - 1000;
    numStars++;
  }

  if (remainder >= 2000) {
    remainder = remainder - 2000;
    numStars++;
  }

  if (remainder >= 3500) {
    remainder = remainder - 3500;
    numStars++;
  }

  if (remainder >= 5000) {
    numStars = numStars + Math.floor(remainder / 5000);
  }
  return numStars;
}

async function calculateScore(stats, settingsData) {
  let fkdrPts = -1 * (1000 / (stats.fkdr + 10)) + 2 * stats.fkdr + 100;
  const starPts = Math.pow(stats.stars, 0.65);
  let wlrPts = Math.pow(stats.wlr, 1.5) * 10;
  let bblrPts = Math.pow(stats.bblr, 1.5) * 10;
  const finalPts = stats.finals / 120;
  const bedPts = stats.beds / 60;
  const winPts = stats.wins / 30;
  if (stats.fkdr > 10) {
    fkdrPts = 0.1 * Math.pow(stats.fkdr, 2) + 2.5 * stats.fkdr + 35;
  }
  if (stats.wlr > 10) {
    wlrPts = 45 * stats.wlr - 134;
  }
  if (stats.bblr > 10) {
    bblrPts = 45 * stats.bblr - 134;
  }
  const score =
    fkdrPts + starPts + wlrPts + bblrPts + finalPts + bedPts + winPts;
  normalCutoff = settingsData.scoreCutoff;
  return score * settingsData.scoreConstant * 10;
}
window.onload = async function loadSettings() {
  const data = await window.electronAPI.readFile("settings.json");
  document.getElementById("apiInput").value = data.hypixelAPIKey;
  document.getElementById("themeInput").value = data.theme;
  document.getElementById("pollingInput").value = data.pollingRate;
  document.getElementById("loggingInput").value = data.loggingConfig;
  document.getElementById("scoreInput").value = data.scoreCutoff;
  document.getElementById("cScoreInput").value = data.scoreConstant;
  document.getElementById("starsInput").value = data.equations.stars;
  document.getElementById("fkdrInput").value = data.equations.fkdr;
  document.getElementById("bblrInput").value = data.equations.bblr;
  document.getElementById("wlrInput").value = data.equations.wlr;
  document.getElementById("finalsInput").value = data.equations.finals;
  document.getElementById("bedsInput").value = data.equations.beds;
  document.getElementById("winsInput").value = data.equations.wins;
  document.getElementById("fkdrMInput").value = data.equations.fkdrMargin;
  document.getElementById("bblrMInput").value = data.equations.bblrMargin;
  document.getElementById("wlrMInput").value = data.equations.wlrMargin;
  document.getElementById("fkdrSInput").value = data.equations.fkdrSecond;
  document.getElementById("bblrSInput").value = data.equations.bblrSecond;
  document.getElementById("wlrSInput").value = data.equations.wlrSecond;
  document.getElementById("cover").style.width = "0%";
};

document.getElementById("homeIcon").addEventListener("click", () => {
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 505);
});

document.getElementById("friendsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/friends.html";
  }, 505);
});

document.getElementById("saveButton").addEventListener("click", async () => {
  const initData = await window.electronAPI.readFile("settings.json");
  let theme;
  const settings = {
    hypixelAPIKey: document.getElementById("apiInput").value,
    theme: document.getElementById("themeInput").value,
    pollingRate: document.getElementById("pollingInput").value,
    loggingConfig: document.getElementById("loggingInput").value,
    scoreCutoff: document.getElementById("scoreInput").value,
    scoreConstant: document.getElementById("cScoreInput").value,
    equations: {
      stars: document.getElementById("starsInput").value,
      fkdr: document.getElementById("fkdrInput").value,
      bblr: document.getElementById("bblrInput").value,
      wlr: document.getElementById("wlrInput").value,
      finals: document.getElementById("finalsInput").value,
      beds: document.getElementById("bedsInput").value,
      wins: document.getElementById("winsInput").value,
      fkdrMargin: document.getElementById("fkdrMInput").value,
      bblrMargin: document.getElementById("bblrMInput").value,
      wlrMargin: document.getElementById("wlrMInput").value,
      fkdrSecond: document.getElementById("fkdrSInput").value,
      bblrSecond: document.getElementById("bblrSInput").value,
      wlrSecond: document.getElementById("wlrSInput").value,
    },
  };
  window.electronAPI.writeFile("settings.json", settings);
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 505);
});

document.getElementById("cancelButton").addEventListener("click", () => {
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 505);
});

const htmlArr = [
  'The <span class="bold">Hypixel API Key</span> is obtained through running "/api new" on Hypixel. This field is required for all functions that pull Hypixel Stats.',
  'The <span class="bold">application theme</span> is self-explanatory. It changes the color scheme, background and background animation present throughout the app.',
  'The <span class="bold">polling rate</span> is how often the tracker checks for changes in the log file. This value should only affect the last chat message display.',
  '<span class="bold">Logging configuration</span> needs to be changed if you\'re using a third-party client, as different clients store log files differently.',
  '<span class="bold">Score cutoff</span> is defined as the score value at which enemies start becoming considered dangerous. Lower this if you don\'t play at a decently high level.',
  'The <span class="bold">score constant</span> is the number at which the base score is multiplied by. This number is purely cosmetic, but it does affect score cutoff.',
];

document.querySelectorAll(".hoverDetect").forEach(async (text, idx) => {
  text.addEventListener("mouseover", async () => {
    document.getElementById("settingsHelp").style.right = "3vw";
    document.getElementById("settingsHelp").style.opacity = 1;
    document.getElementById("settingsHelp").innerHTML = htmlArr[idx];
  });
  text.addEventListener("mouseout", async () => {
    document.getElementById("settingsHelp").style.opacity = 0;
    document.getElementById("settingsHelp").style.right = "-50vw";
  });
});

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let collapsed = true;

document.querySelector(".initItem").addEventListener("click", () => {
  document.querySelector(".settingsCollapsible").style.height = collapsed
    ? "calc(140vh + 28px)"
    : "calc(10vh + 2px)";
  document.querySelector(".initItem .settingsText").innerHTML = collapsed
    ? "Click to retract equations"
    : "Click to expand equations";
  document.querySelector(".initItem .settingsEntry").innerHTML = collapsed
    ? "-"
    : "+";
  collapsed = !collapsed;
});

document
  .querySelector(".settingsCollapsible")
  .addEventListener("keypress", (key) => {
    let reg;
    reg = /\d/.test(key.key);
    if (key.target.className.includes("eqInput")) {
      reg = /[-()\d\/*+.x^]/.test(key.key);
    }
    if (!reg) {
      key.preventDefault();
    }
  });

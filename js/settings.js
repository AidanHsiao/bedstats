window.onload = async function loadSettings() {
  const data = await window.electronAPI.readFile("settings.json");
  document.getElementById("apiInput").value = data.hypixelAPIKey;
  document.getElementById("scoreInput").value = data.scoreCutoff;
  document.getElementById("cScoreInput").value = data.scoreConstant;
  document.getElementById("cover").style.width = "0%";
  console.log(data);
};

document.getElementById("homeIcon").addEventListener("click", () => {
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 760);
});

document.getElementById("saveButton").addEventListener("click", () => {
  const settings = {
    theme: "sky",
    hypixelAPIKey: document.getElementById("apiInput").value,
    scoreCutoff: document.getElementById("scoreInput").value,
    scoreConstant: document.getElementById("cScoreInput").value,
  };
  window.electronAPI.writeFile("settings.json", settings);
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 760);
});

document.getElementById("cancelButton").addEventListener("click", () => {
  document.getElementById("cover").style.width = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 760);
});

const htmlArr = [
  'The <span class="bold">Hypixel API Key</span> is obtained through running "/api new" on Hypixel. This field is required for all functions that pull Hypixel Stats.',
  '<span class="bold">Score cutoff</span> is defined as the score value at which enemies start becoming considered dangerous. Lower this if you don\'t play at a decently high level.',
  'The <span class="bold">score constant</span> is the number at which the base score is multiplied by. This number is purely cosmetic, but it does affect score cutoff.',
];

document.querySelectorAll(".hoverDetect").forEach(async (text, idx) => {
  text.addEventListener("mouseover", async () => {
    document.getElementById("settingsHelp").style.right = "3vw";
    document.getElementById("settingsHelp").style.color = "rgba(0, 0, 0, 1)";
    document.getElementById("settingsHelp").innerHTML = htmlArr[idx];
  });
  text.addEventListener("mouseout", async () => {
    document.getElementById("settingsHelp").style.color = "rgba(0, 0, 0, 0)";
    document.getElementById("settingsHelp").style.right = "-50vw";
  });
});

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

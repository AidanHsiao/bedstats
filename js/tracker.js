window.onload = async function initializeTracker() {
  const settingsData = await window.electronAPI.readFile("settings.json")
  document.getElementById("loaderText").style.opacity = 1
  document.getElementById("loader").style.opacity = 1
  if (settingsData.hypixelAPIKey) {
    try {
      const playerData = await getPlayerData(settingsData.hypixelAPIKey, "f7c77d99-9f15-4a66-a87d-c4a51ef30d19")
    } catch {
      apiKeyError("Your API key is invalid. Check to see that it's spelt correctly.")
      return;
    }
  } else {
    apiKeyError("You don't have an API key inputted. Create one by running <span class=\"bold\">/api new</span><br> in Hypixel, then paste it into your settings.")
    return;
  }
  document.getElementById("loaderText").style.opacity = 0
  document.getElementById("loader").style.opacity = 0
  document.getElementById("cover").style.height = 0;
  window.electronAPI.startWatcher();
};

window.electronAPI.on("chatData", (event, lastLog) => {
  document.getElementById("lastChatMessageDiv").innerHTML = lastLog;
});

let pendingUsers = [];

window.electronAPI.on("pendingData", (event, username) => {
  pendingUsers.push(username);
  document.getElementById("pendingDiv").innerHTML = pendingUsers.join(", ");
});

window.electronAPI.on("removePending", async (event, username) => {
  await sleep(250);
  pendingUsers.splice(
    pendingUsers.findIndex((u) => u === username),
    1
  );
  document.getElementById("pendingDiv").innerHTML = pendingUsers.join(", ");
});

window.electronAPI.on(
  "collectedData",
  async (event, username, playerInfo) => {
    const settingsData = await window.electronAPI.readFile("settings.json");
    pendingUsers.splice(
      pendingUsers.findIndex((u) => u === username),
      1
    );
    document.getElementById("pendingDiv").innerHTML = pendingUsers.join(", ");
    document.getElementById("collectedDiv").innerHTML = ``;
    playerInfo.forEach((item) => {
      if (!item.score) {
        item.score = 0;
      }
      document.getElementById("collectedDiv").innerHTML = `${
        document.getElementById("collectedDiv").innerHTML
      }<div class="collectedItem">
    <div class="itemName">${item.name}</div>
    <div class="itemScore" style="text-shadow: 0px 0px 5px ${scoreToColor(
      parseFloat(item.score),
      settingsData.scoreCutoff
    )}">${item.score}</div>
  </div>`;
    });
  }
);

window.electronAPI.on("dataClear", (event) => {
  pendingUsers = [];
  document.getElementById("pendingDiv").innerHTML = ``;
  document.getElementById("collectedDiv").innerHTML = ``;
});

document.getElementById("inputBox").addEventListener("keydown", async (key) => {
  const trueReg = /[A-Za-z\d_]/.test(key.key);
  if (!trueReg) {
    key.preventDefault();
  }
  if (document.getElementById("inputBox").value.length >= 16) {
    key.preventDefault();
  }
  if (key.code === "Enter") {
    window.electronAPI.manualInput(document.getElementById("inputBox").value);
    document.getElementById("inputBox").value = "";
  }
});

document.getElementById("confirmButton").addEventListener("click", () => {
  window.electronAPI.manualInput(document.getElementById("inputBox").value);
  document.getElementById("inputBox").value = "";
});

document.getElementById("resetButton").addEventListener("click", () => {
  document.getElementById("pendingDiv").innerHTML = ``;
    document.getElementById("collectedDiv").innerHTML = ``;
    window.electronAPI.clearCollectedData();
})

function apiKeyError(msg) {
  document.getElementById("cover").style.backgroundColor = "#ffaaaa"
  document.getElementById("eb").style.opacity = 1
  document.getElementById("loader").style.opacity = 0
  document.getElementById("loaderText").innerHTML = msg
  document.getElementById("eb").style.cursor = "pointer"
  document.getElementById("eb").addEventListener("click", async () => {
    document.getElementById("cover").style.backgroundColor = "#e8e8e8"
    document.getElementById("loaderText").style.opacity = 0
    document.getElementById("eb").style.opacity = 0
    await sleep(205)
    window.location.href = "../html/index.html"
  })
}


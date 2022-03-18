window.onload = async function initializeTracker() {
  document.getElementById("cover").style.height = 0;
  window.electronAPI.startWatcher();
};

window.electronAPI.sendData("chatData", (event, lastLog) => {
  document.getElementById("lastChatMessageDiv").innerHTML = lastLog;
});

let pendingUsers = [];

window.electronAPI.sendData("pendingData", (event, username) => {
  pendingUsers.push(username);
  document.getElementById("pendingDiv").innerHTML = pendingUsers.join(", ");
});

window.electronAPI.sendData("removePending", async (event, username) => {
  await sleep(250);
  pendingUsers.splice(
    pendingUsers.findIndex((u) => u === username),
    1
  );
  document.getElementById("pendingDiv").innerHTML = pendingUsers.join(", ");
});

window.electronAPI.sendData(
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

window.electronAPI.sendData("dataClear", (event) => {
  pendingUsers = [];
  document.getElementById("pendingDiv").innerHTML = ``;
  document.getElementById("collectedDiv").innerHTML = ``;
});

document.getElementById("homeIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  window.electronAPI.clearWatcher();
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 505);
});
document.getElementById("settingsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  window.electronAPI.clearWatcher();
  setTimeout(() => {
    window.location.href = "../html/settings.html";
  }, 505);
});
document.getElementById("friendsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  window.electronAPI.clearWatcher();
  setTimeout(() => {
    window.location.href = "../html/friends.html";
  }, 505);
});

document
  .getElementById("inputBox")
  .addEventListener("keypress", async (key) => {
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

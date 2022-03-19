document.getElementById("searchButton").addEventListener("click", async () => {
  migrateStats();
});
async function migrateStats() {
  if (document.getElementById("usernameInput").value) {
    const username = document.getElementById("usernameInput").value;
    await sessionStorage.setItem("username", username);
    document.getElementById("cover").style.height = "100vh";
    setTimeout(() => {
      window.location.href = "../html/stats.html";
    }, 505);
  }
}

document
  .getElementById("leaderboardButton")
  .addEventListener("click", async () => {
    document.getElementById("cover").style.height = "100vh";
    setTimeout(() => {
      window.location.href = "../html/leaderboards.html";
    }, 505);
  });

window.onload = async function uncover() {
  const opened = sessionStorage.getItem("opened");
  if (!opened) {
    document.getElementById("welcomeParent").style.height = "60%";
    await sleep(500);
    document.getElementById("welcomeParent").style.opacity = 1;
    document.getElementById("welcomeParent").style.letterSpacing = "1vw";
    await sleep(2000);
    document.getElementById("welcomeParent").style.opacity = 0;
    await sleep(500);
    document.getElementById("welcomeParent").style.height = 0;
    document.getElementById("cover").style.opacity = "0";
    await sleep(500);
    document.getElementById("cover").style.height = "0vh";
    await sleep(505);
    document.getElementById("cover").style.opacity = "1";
  } else {
    document.getElementById("cover").style.height = "0vh";
  }
  document.getElementById("welcomeParent").style.backgroundSize = 0;
  document.getElementById("welcomeParent").style.paddingTop = 0;
  document
    .getElementById("settingsIcon")
    .addEventListener("click", async () => {
      document.getElementById("cover").style.height = "100vh";
      setTimeout(() => {
        window.location.href = "../html/settings.html";
      }, 505);
    });
  document.getElementById("friendsIcon").addEventListener("click", async () => {
    document.getElementById("cover").style.height = "100vh";
    setTimeout(() => {
      window.location.href = "../html/friends.html";
    }, 505);
  });
  sessionStorage.setItem("opened", true);
};

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

document
  .getElementById("usernameInput")
  .addEventListener("keydown", async (key) => {
    if (key.code === "Enter") {
      migrateStats();
    }
    const trueReg = /[A-Za-z\d_]/.test(key.key);
    if (!trueReg) {
      key.preventDefault();
    }
    if (document.getElementById("usernameInput").value.length >= 16) {
      key.preventDefault();
    }
  });

document.getElementById("trackerButton").addEventListener("click", async () => {
  document.getElementById("cover").style.height = "100vh";
  setTimeout(() => {
    window.location.href = "../html/tracker.html";
  }, 505);
});

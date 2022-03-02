window.onload = async function getLeaderboard() {
  if (sessionStorage.getItem("leaderboards")) {
    document.getElementById("loaderText").innerHTML =
      "Fetching cached leaderboard data...";
    document.getElementById("loader").style.opacity = 1;
    document.getElementById("loaderText").style.opacity = 1;
    await sleep(0);
    parsedData = JSON.parse(sessionStorage.getItem("leaderboards"));
    apiLoadingFinished(parsedData);
  } else {
    settingsData = await window.electronAPI.readFile("settings.json");
    document.getElementById("loaderText").innerHTML =
      "Fetching leaderboards...";
    document.getElementById("loader").style.opacity = 1;
    document.getElementById("loaderText").style.opacity = 1;
    let leaders;
    try {
      resp = await fetch(
        `https://api.hypixel.net/leaderboards?key=${settingsData.hypixelAPIKey}`
      );
      data = await resp.json();
      data = data.leaderboards.BEDWARS[0];
      leaders = data.leaders.splice(0, 25);
    } catch (e) {
      document.getElementById("loader").style.opacity = 0;
      document.getElementById("loaderText").innerHTML =
        "Leaderboards fetch error. Make sure that <br> you are connected to the internet, and your API key is correct.";
      document.getElementById("eb").style.opacity = 1;

      document.getElementById("eb").addEventListener("click", () => {
        homeScreen();
      });
      document.getElementById("eb").style.cursor = "pointer";

      console.log(e);
      return;
    }
    document.getElementById(
      "loaderText"
    ).innerHTML = `Fetching player data (0/25)`;
    let totalLeaderboards = [];
    let finished = 0;
    await leaders.forEach(async (uuid) => {
      try {
        resp = await fetch(
          `https://api.hypixel.net/player?key=f31e0dc1-30e8-4ec8-84cb-3060b60c56bc&uuid=${uuid}`
        );
        playerData = await resp.json();
        totalLeaderboards.push(playerData.player);
        finished++;
        document.getElementById(
          "loaderText"
        ).innerHTML = `Fetching player data (${finished}/25)`;
        if (finished === 25) {
          let baseArray = totalLeaderboards.map((object) => {
            return calculateStars(object.stats.Bedwars.Experience);
          });
          await sleep(500);
          totalLeaderboards = bubbleSort(baseArray, totalLeaderboards);
          apiLoadingFinished(totalLeaderboards);
        }
      } catch (e) {
        document.getElementById("loader").style.opacity = 0;
        document.getElementById("loaderText").innerHTML =
          "Stats fetch error. This player may not<br>have played on Hypixel before.";
        document.getElementById("eb").style.opacity = 1;

        document.getElementById("eb").addEventListener("click", () => {
          homeScreen();
        });
        document.getElementById("eb").style.cursor = "pointer";

        console.log(e);
        return;
      }
    });
  }

  function bubbleSort(bArr, arr) {
    let loopCompleted = false;
    while (!loopCompleted) {
      loopCompleted = true;
      bArr.forEach((num, idx) => {
        if (num < bArr[idx + 1]) {
          const bTemp = bArr[idx + 1];
          bArr[idx + 1] = num;
          bArr[idx] = bTemp;
          const temp = arr[idx + 1];
          arr[idx + 1] = arr[idx];
          arr[idx] = temp;
          loopCompleted = false;
        }
      });
    }
    return arr;
  }

  async function apiLoadingFinished(totalLeaderboards) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").style.opacity = 0;
    document.getElementById("navigation").style.opacity = 1;
    sessionStorage.setItem("leaderboards", JSON.stringify(totalLeaderboards));
    for (let i = 0; i < 25; i++) {
      const tempRank = calculateRank(totalLeaderboards[i]);
      let rank;
      let color;
      let plusColor = "#FF0000";
      name = totalLeaderboards[i].displayname;
      switch (tempRank) {
        case "NON" || "NORMAL":
          rank = "";
          color = "#AAAAAA";
          break;
        case "VIP":
          rank = "[VIP]";
          color = "#55FF55";
          break;
        case "VIP+":
          rank = `[VIP<span id="rankPlus${i}">+</span>]`;
          color = "#55FF55";
          plusColor = "#FFAA00";
          break;
        case "MVP":
          rank = "[MVP]";
          color = "#55FFFF";
          break;
        case "MVP+":
          rank = `[MVP<span id="rankPlus${i}">+</span>]`;
          color = "#55FFFF";
          if (totalLeaderboards[i].rankPlusColor) {
            plusColor = colorCodes(
              totalLeaderboards[i].rankPlusColor.toLowerCase()
            );
          } else {
            plusColor = "#FF5555";
          }
          plusColor = plusColor;
          break;
        case "MVP++":
          rank = `[MVP<span id="rankPlus${i}">++</span>]`;
          if (totalLeaderboards[i].monthlyRankColor === "AQUA") {
            color = "#55FFFF";
          } else {
            color = "#FFAA00";
          }
          if (totalLeaderboards[i].rankPlusColor) {
            plusColor = colorCodes(
              totalLeaderboards[i].rankPlusColor.toLowerCase()
            );
          } else {
            plusColor = "#FF5555";
          }
          plusColor = plusColor;
          break;
        case "HELPER":
          rank = "[HELPER]";
          color = "#5555FF";
          break;
        case "MODERATOR":
          rank = "[MOD]";
          color = "#5555FF";
          break;
        case "ADMIN":
          rank = "[ADMIN]";
          color = "#FF5555";
          break;
        case "§c[OWNER]":
          rank = "[OWNER]";
          color = "#FF5555";
          break;
        case "YOUTUBER":
          rank = `[<span id="rankPlus${i}">YOUTUBE</span>]`;
          color = "#FF5555";
          plusColor = "#FFFFFF";
          break;
      }
      const bwData = totalLeaderboards[i].stats.Bedwars;
      const stars = calculateStars(bwData.Experience);
      const score = await calculateScore({
        stars: stars,
        fkdr: bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
        bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
        wlr: bwData.wins_bedwars / bwData.losses_bedwars,
        finals: bwData.final_kills_bedwars,
        beds: bwData.beds_broken_bedwars,
        wins: bwData.wins_bedwars,
      });
      document.getElementById("leaderboards").innerHTML = `${
        document.getElementById("leaderboards").innerHTML
      }<div class="leaderboardItem${i} leaderboardItem"><div class="leaderboardSpacing"></div><div class="leaderboardRank">${
        i + 1
      }</div><div class="leaderboardName">${rank} ${name}</div><div class="leaderboardStars">${stars}</div><div class="leaderboardFKDR">${(
        bwData.final_kills_bedwars / bwData.final_deaths_bedwars
      ).toFixed(2)}</div><div class="leaderboardBBLR">${(
        bwData.beds_broken_bedwars / bwData.beds_lost_bedwars
      ).toFixed(2)}</div><div class="leaderboardWinP">${(
        100 *
        (bwData.wins_bedwars / (bwData.wins_bedwars + bwData.losses_bedwars))
      ).toFixed(1)}</div><div class="leaderboardScore">${score.toFixed(
        1
      )}</div>`;
      document.getElementsByClassName(`leaderboardItem${i}`)[0].style.color =
        color;
      if (document.getElementById(`rankPlus${i}`)) {
        document.getElementById(`rankPlus${i}`).style.color = plusColor;
      }
    }
    await sleep(500);
    document.getElementById("leaderboardSection").style.height = "200%";
    document.getElementById("leaderboards").style.opacity = 1;
    document.getElementById("header").style.opacity = 1;
  }
};

async function homeScreen() {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 760);
}

document.getElementById("homeIcon").addEventListener("click", () => {
  homeScreen();
});

document.getElementById("settingsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/settings.html";
  }, 760);
});

async function homeScreen() {
  document.getElementById("cover").style.height = "100%";
  await sleep(760);
  window.location.href = "../html/index.html";
}

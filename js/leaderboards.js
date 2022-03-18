let globalLeaderboards;
let friendLeaderboards;

window.onload = async function getLeaderboard() {
  settingsData = await window.electronAPI.readFile("settings.json");
  const friendsObj = await window.electronAPI.readFile("friends.json");
  if (sessionStorage.getItem("leaderboards")) {
    document.getElementById("loaderText").innerHTML =
      "Fetching cached leaderboard data...";
    document.getElementById("loader").style.opacity = 1;
    document.getElementById("loaderText").style.opacity = 1;
    await sleep(500);
    const parsedData = JSON.parse(sessionStorage.getItem("leaderboards"));
    loadFriends(parsedData, settingsData);
  } else {
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
      document.querySelector(".mainContent").style.backgroundColor = "#ffd8d8";
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
    totalLeaderboards = [];
    let finished = 0;
    await leaders.forEach(async (uuid) => {
      try {
        playerData = await getPlayerData(settingsData.hypixelAPIKey, uuid);
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
          loadFriends(totalLeaderboards, settingsData);
        }
      } catch (e) {
        document.getElementById("loader").style.opacity = 0;
        document.getElementById("loaderText").innerHTML =
          "Stats fetch error. Check that your API key is correct.";
        document.getElementById("eb").style.opacity = 1;
        document.querySelector(".mainContent").style.backgroundColor =
          "#ffd8d8";

        document.getElementById("eb").addEventListener("click", () => {
          homeScreen();
        });
        document.getElementById("eb").style.cursor = "pointer";

        console.log(e);
        return;
      }
    });
  }

  async function loadFriends(totalLeaderboards, settingsData) {
    const friendsData = await sessionStorage.getItem("friends");
    const uuids = Object.values(friendsObj);
    if (friendsData === Object.keys(friendsObj).join("")) {
      document.getElementById("loaderText").innerHTML =
        "Fetching cached friend data...";
      await sleep(0);
      friendLeaderboards = JSON.parse(
        sessionStorage.getItem("friendLeaderboards")
      );
      apiLoadingFinished(
        totalLeaderboards,
        friendLeaderboards,
        settingsData,
        friendsObj
      );
    } else {
      document.getElementById(
        "loaderText"
      ).innerHTML = `Fetching friends data (0/${uuids.length})`;
      friendLeaderboards = [];
      let finished = 0;
      if (!uuids.length) {
        apiLoadingFinished(totalLeaderboards, [], settingsData, friendsObj);
      }
      uuids.forEach(async (uuid) => {
        try {
          playerData = await getPlayerData(settingsData.hypixelAPIKey, uuid);
          friendLeaderboards.push(playerData.player);
          finished++;
          document.getElementById(
            "loaderText"
          ).innerHTML = `Fetching friends data (${finished}/${uuids.length})`;
          if (finished === uuids.length) {
            let baseArray = [];
            let baseFinished = 0;
            friendLeaderboards.forEach(async (object) => {
              const bwData = object.stats.Bedwars;
              const stars = calculateStars(bwData.Experience);
              const score = await calculateScore(
                {
                  stars: stars,
                  fkdr:
                    bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
                  bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
                  wlr: bwData.wins_bedwars / bwData.losses_bedwars,
                  finals: bwData.final_kills_bedwars,
                  beds: bwData.beds_broken_bedwars,
                  wins: bwData.wins_bedwars,
                },
                settingsData
              );
              baseArray.push(score);
              baseFinished++;
              if (baseFinished === friendLeaderboards.length) {
                await sleep(500);
                friendLeaderboards = bubbleSort(baseArray, friendLeaderboards);
                apiLoadingFinished(
                  totalLeaderboards,
                  friendLeaderboards,
                  settingsData,
                  friendsObj
                );
              }
            });
          }
        } catch (e) {
          document.getElementById("loader").style.opacity = 0;
          document.getElementById("loaderText").innerHTML =
            "Stats fetch error. One of your friends has never played on Hypixel before.";
          document.getElementById("eb").style.opacity = 1;
          document.querySelector(".mainContent").style.backgroundColor =
            "#ffd8d8";

          document.getElementById("eb").addEventListener("click", () => {
            homeScreen();
          });
          document.getElementById("eb").style.cursor = "pointer";

          console.log(e);
          return;
        }
      });
    }
  }

  async function apiLoadingFinished(
    totalLeaderboards,
    friendLeaderboards,
    settingsData
  ) {
    globalLeaderboards = totalLeaderboards;
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").style.opacity = 0;
    document.getElementById("navigation").style.opacity = 1;
    sessionStorage.setItem("leaderboards", JSON.stringify(totalLeaderboards));
    sessionStorage.setItem(
      "friendLeaderboards",
      JSON.stringify(friendLeaderboards)
    );
    sessionStorage.setItem("friends", Object.keys(friendsObj).join(""));
    for (let i = 0; i < 25; i++) {
      const tempRank = calculateRank(totalLeaderboards[i]);
      name = totalLeaderboards[i].displayname;
      rankData = rankToColor(tempRank, totalLeaderboards, i);
      const bwData = totalLeaderboards[i].stats.Bedwars;
      const stars = calculateStars(bwData.Experience);
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
      document.getElementById("leaderboards").innerHTML = `${
        document.getElementById("leaderboards").innerHTML
      }<div class="leaderboardItem${i} leaderboardItem"><div class="leaderboardSpacing"></div><div class="leaderboardRank">${
        i + 1
      }</div><div class="leaderboardName">${
        rankData.rank
      } ${name}</div><div class="leaderboardStars">${stars}</div><div class="leaderboardFKDR">${(
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
        rankData.color;
      if (document.getElementById(`rankPlus${i}`)) {
        document.getElementById(`rankPlus${i}`).style.color =
          rankData.plusColor;
      }
    }
    await sleep(500);
    document.getElementById("leaderboards").style.opacity = 1;
    document.getElementById("header").style.opacity = 1;
  }
};

async function homeScreen() {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, 505);
}

document.getElementById("homeIcon").addEventListener("click", () => {
  homeScreen();
});

document.getElementById("settingsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/settings.html";
  }, 505);
});

async function homeScreen() {
  document.getElementById("cover").style.height = "100%";
  await sleep(505);
  window.location.href = "../html/index.html";
}

document.getElementById("friendsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/friends.html";
  }, 505);
});

document.getElementById("filter").onchange = () => changeLeaderboards();

async function changeLeaderboards(changing = true) {
  if (document.getElementById("filter").value === "Friends") {
    if (changing) {
      document.getElementById("titleDiv").innerHTML =
        'Friends Leaderboard, Sorted By <select id="sortType" name="sortType"><option>Score</option><option>Stars</option><option>FKDR</option><option>BBLR</option><option>Win %</option></select>';
    }
    document.getElementById("leaderboards").style.opacity = 0;
    document.getElementById("header").style.opacity = 0;
    document.getElementById("leaderboards").innerHTML = `<div
    class="leaderboardItem"
    style="
      color: white;
      background-image: linear-gradient(to right, black, black);
    "
  >
    <div class="leaderboardSpacing"></div>
    <div class="leaderboardRank" style="color: white">Rank</div>
    <div class="leaderboardName" style="color: white">Player</div>
    <div class="leaderboardStars" style="color: white">Stars</div>
    <div class="leaderboardFKDR" style="color: white">FKDR</div>
    <div class="leaderboardBBLR" style="color: white">BBLR</div>
    <div class="leaderboardWinP" style="color: white">Win %</div>
    <div class="leaderboardScore" style="color: white">Score</div>
  </div>`;
    for (let i = 0; i < friendLeaderboards.length; i++) {
      const tempRank = calculateRank(friendLeaderboards[i]);
      name = friendLeaderboards[i].displayname;
      rankData = rankToColor(tempRank, friendLeaderboards, i);
      const bwData = friendLeaderboards[i].stats.Bedwars;
      const stars = calculateStars(bwData.Experience);
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
      document.getElementById("leaderboards").innerHTML = `${
        document.getElementById("leaderboards").innerHTML
      }<div class="leaderboardItem${i} leaderboardItem"><div class="leaderboardSpacing"></div><div class="leaderboardRank">${
        i + 1
      }</div><div class="leaderboardName">${
        rankData.rank
      } ${name}</div><div class="leaderboardStars">${stars}</div><div class="leaderboardFKDR">${(
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
        rankData.color;
      if (document.getElementById(`rankPlus${i}`)) {
        document.getElementById(`rankPlus${i}`).style.color =
          rankData.plusColor;
      }
    }
    document.getElementById("leaderboards").style.opacity = 1;
    document.getElementById("header").style.opacity = 1;
    document.getElementById("sortType").onchange = () => changeSort();
  } else {
    document.getElementById("titleDiv").innerHTML =
      "Global Leaderboard, Sorted By Stars";
    document.getElementById("leaderboards").style.opacity = 0;
    document.getElementById("header").style.opacity = 0;
    document.getElementById("leaderboards").innerHTML = `<div
    class="leaderboardItem"
    style="
      color: white;
      background-image: linear-gradient(to right, black, black);
    "
  >
    <div class="leaderboardSpacing"></div>
    <div class="leaderboardRank" style="color: white">Rank</div>
    <div class="leaderboardName" style="color: white">Player</div>
    <div class="leaderboardStars" style="color: white">Stars</div>
    <div class="leaderboardFKDR" style="color: white">FKDR</div>
    <div class="leaderboardBBLR" style="color: white">BBLR</div>
    <div class="leaderboardWinP" style="color: white">Win %</div>
    <div class="leaderboardScore" style="color: white">Score</div>
  </div>`;
    for (let i = 0; i < 25; i++) {
      const tempRank = calculateRank(globalLeaderboards[i]);
      name = globalLeaderboards[i].displayname;
      rankData = rankToColor(tempRank, globalLeaderboards, i);
      const bwData = globalLeaderboards[i].stats.Bedwars;
      const stars = calculateStars(bwData.Experience);
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
      document.getElementById("leaderboards").innerHTML = `${
        document.getElementById("leaderboards").innerHTML
      }<div class="leaderboardItem${i} leaderboardItem"><div class="leaderboardSpacing"></div><div class="leaderboardRank">${
        i + 1
      }</div><div class="leaderboardName">${
        rankData.rank
      } ${name}</div><div class="leaderboardStars">${stars}</div><div class="leaderboardFKDR">${(
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
        rankData.color;
      if (document.getElementById(`rankPlus${i}`)) {
        document.getElementById(`rankPlus${i}`).style.color =
          rankData.plusColor;
      }
    }
    document.getElementById("leaderboards").style.opacity = 1;
    document.getElementById("header").style.opacity = 1;
  }
}

async function changeSort() {
  sortType = document.getElementById("sortType").value;
  switch (sortType) {
    case "Score": {
      let baseArray = [];
      let baseFinished = 0;
      let tempLeaderboards = friendLeaderboards;
      tempLeaderboards.forEach(async (object) => {
        const bwData = object.stats.Bedwars;
        const stars = calculateStars(bwData.Experience);
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
        baseArray.push(score);
        baseFinished++;
        if (baseFinished === tempLeaderboards.length) {
          friendLeaderboards = bubbleSort(baseArray, tempLeaderboards);
          changeLeaderboards(false);
        }
      });
      break;
    }
    case "Stars": {
      let baseArray = friendLeaderboards.map((item) => {
        return item.stats.Bedwars.Experience;
      });
      friendLeaderboards = bubbleSort(baseArray, friendLeaderboards);
      changeLeaderboards(false);
      break;
    }
    case "FKDR": {
      let baseArray = friendLeaderboards.map((item) => {
        return (
          item.stats.Bedwars.final_kills_bedwars /
          item.stats.Bedwars.final_deaths_bedwars
        );
      });
      friendLeaderboards = bubbleSort(baseArray, friendLeaderboards);
      changeLeaderboards(false);
      break;
    }
    case "BBLR": {
      let baseArray = friendLeaderboards.map((item) => {
        return (
          item.stats.Bedwars.beds_broken_bedwars /
          item.stats.Bedwars.beds_lost_bedwars
        );
      });
      friendLeaderboards = bubbleSort(baseArray, friendLeaderboards);
      changeLeaderboards(false);
      break;
    }
    case "Win %": {
      let baseArray = friendLeaderboards.map((item) => {
        return (
          item.stats.Bedwars.wins_bedwars / item.stats.Bedwars.losses_bedwars
        );
      });
      friendLeaderboards = bubbleSort(baseArray, friendLeaderboards);
      changeLeaderboards(false);
      break;
    }
  }
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

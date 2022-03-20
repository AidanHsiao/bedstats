async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let settingsData;
let normalCutoff;

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

function calculateColor(stars) {
  const l = Math.floor(stars / 100);
  let baseColor;
  switch (l) {
    case 0:
      baseColor = "gray";
      break;
    case 1:
    case 11:
      baseColor = "white";
      break;
    case 2:
    case 12:
      baseColor = "orange";
      break;
    case 3:
    case 13:
      baseColor = "aqua";
      break;
    case 4:
    case 14:
      baseColor = "green";
      break;
    case 5:
    case 15:
      baseColor = "royalblue";
      break;
    case 6:
    case 16:
      baseColor = "crimson";
      break;
    case 7:
    case 17:
      baseColor = "salmon";
      break;
    case 8:
    case 18:
      baseColor = "mediumblue";
      break;
    case 9:
    case 19:
      baseColor = "purple";
      break;
    case 10:
      return "linear-gradient(to right, red, orange, yellow, green, blue, purple)";
    case 20:
      return "linear-gradient(to right, gray, #e8e8e8, gray)";
    case 21:
      return "linear-gradient(to right, white, yellow, orange)";
    case 22:
      return "linear-gradient(to right, orange, white, cyan)";
    case 23:
      return "linear-gradient(to right, purple, orange)";
    case 24:
      return "linear-gradient(to right, cyan, white, gray)";
    case 25:
      return "linear-gradient(to right, white, green)";
    case 26:
      return "linear-gradient(to right, red, magenta)";
    case 27:
      return "linear-gradient(to right, yellow, white, gray)";
    case 28:
      return "linear-gradient(to right, green, darkgreen, orange)";
    case 29:
      return "linear-gradient(to right, lightblue, cyan, blue)";
    default:
      return "linear-gradient(to right, yellow, red";
  }
  return `linear-gradient(to right, ${baseColor}, ${baseColor})`;
}

async function calculateScore(stats, settingsData) {
  let fkdrPts =
    stats.fkdr >= parseInt(settingsData.equations.fkdrMargin)
      ? evaluate(settingsData.equations.fkdrSecond, stats.fkdr)
      : evaluate(settingsData.equations.fkdr, stats.fkdr);
  const starPts = evaluate(settingsData.equations.stars, stats.stars);
  let wlrPts =
    stats.wlr >= parseInt(settingsData.equations.wlrMargin)
      ? evaluate(settingsData.equations.wlrSecond, stats.wlr)
      : evaluate(settingsData.equations.wlr, stats.wlr);
  let bblrPts =
    stats.bblr >= parseInt(settingsData.equations.bblrMargin)
      ? evaluate(settingsData.equations.bblrSecond, stats.bblr)
      : evaluate(settingsData.equations.bblr, stats.bblr);
  const finalPts = evaluate(settingsData.equations.finals, stats.finals);
  const bedPts = evaluate(settingsData.equations.beds, stats.beds);
  const winPts = evaluate(settingsData.equations.wins, stats.wins);
  const score =
    fkdrPts + starPts + wlrPts + bblrPts + finalPts + bedPts + winPts;
  normalCutoff = settingsData.scoreCutoff;
  return score * settingsData.scoreConstant;
}

function scoreToColor(score, tempCutoff = normalCutoff) {
  const cutoff = 82.5 * tempCutoff;
  let hue = (cutoff / (score + cutoff / 220) - 60) * 1.1;
  if (hue < -60) {
    hue = -60;
  }

  return `hsl(${hue}, 100%, 50%)`;
}

function calculateRank(player) {
  if (player.prefix) {
    return player.prefix;
  }
  if (player.rank && player.rank !== "NORMAL") {
    return player.rank;
  }
  if (player.monthlyPackageRank && player.monthlyPackageRank !== "NONE") {
    return "MVP++";
  }
  if (player.newPackageRank && player.newPackageRank !== "NONE") {
    return player.newPackageRank.replace("_PLUS", "+");
  } else if (player.packageRank && player.packageRank !== "NONE") {
    return player.packageRank.replace("_PLUS", "+");
  } else {
    return "NON";
  }
}

function colorCodes(color) {
  switch (color) {
    case "black":
      return "#000000";
    case "dark_blue":
      return "#0000AA";
    case "dark_green":
      return "#00AA00";
    case "dark_aqua":
      return "#00AAAA";
    case "dark_red":
      return "#AA0000";
    case "dark_purple":
      return "#AA00AA";
    case "gold":
      return "#FFAA00";
    case "gray":
      return "#BBBBBB";
    case "dark_gray":
      return "#555555";
    case "blue":
      return "#5555FF";
    case "green":
      return "#55FF55";
    case "aqua":
      return "#55FFFF";
    case "red":
      return "#FF5555";
    case "light_purple":
      return "#FF55FF";
    case "yellow":
      return "#FFFF55";
    case "white":
      return "#FFFFFF";
  }
}

function rankToColor(tempRank, totalLeaderboards, i) {
  let rank;
  let color;
  let plusColor;
  switch (tempRank) {
    default:
      rank = "";
      color = "#BBBBBB";
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
  return { rank: rank, color: color, plusColor: plusColor };
}

async function getPlayerData(key, uuid) {
  resp = await fetch(`https://api.hypixel.net/player?key=${key}&uuid=${uuid}`);
  playerData = await resp.json();
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
  }
  for (let item of dataArrayOne) {
    if (!playerData.player.stats.Bedwars[item]) {
      playerData.player.stats.Bedwars[item] = 1;
    }
  }
  return playerData;
}

if (document.getElementById("homeIcon")) {
document.getElementById("homeIcon").addEventListener("click", async (ev) => {
  document.getElementById("cover").style.height = "100vh"
  document.getElementById("cover").style.width = "100vw"
  await sleep(505)
  window.location.href = "../html/index.html"
})
}

if (document.getElementById("friendsIcon")) {
document.getElementById("friendsIcon").addEventListener("click", async (ev) => {
  document.getElementById("cover").style.height = "100vh"
  document.getElementById("cover").style.width = "100vw"
  await sleep(505)
  window.location.href = "../html/friends.html"
})
}
if (document.getElementById("settingsIcon")) {
document.getElementById("settingsIcon").addEventListener("click", async (ev) => {
  document.getElementById("cover").style.height = "100vh"
  document.getElementById("cover").style.width = "100vw"
  await sleep(505)
  window.location.href = "../html/settings.html"
})
}
if (document.getElementById("helpIcon")) {
document.getElementById("helpIcon").addEventListener("click", async (ev) => {
  document.getElementById("cover").style.height = "100vh"
  document.getElementById("cover").style.width = "100vw"
  await sleep(505)
  window.location.href = "../html/help.html"
})
}
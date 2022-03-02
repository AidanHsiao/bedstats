let bwData;
let stars;

window.onload = async function getPlayerStats() {
  let username = sessionStorage.getItem("username");
  let uuid;
  let name;
  let resp;
  let data;
  document.getElementById("loaderText").innerHTML = "Fetching player UUID...";
  document.getElementById("loader").style.opacity = 1;
  document.getElementById("loaderText").style.opacity = 1;
  try {
    resp = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`
    );
    data = await resp.json();
    uuid = data.id;
    name = data.name;
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "UUID fetch error. Make sure you are connected to the internet, <br>and that the username is spelt correctly.";
    document.getElementById("eb").style.opacity = 1;

    document.getElementById("eb").style.cursor = "pointer";

    document.getElementById("eb").addEventListener("click", () => {
      window.location.href = "../html/index.html";
    });

    console.log(e);
    return;
  }
  document.getElementById("loaderText").innerHTML = "Fetching player stats...";
  try {
    resp = await fetch(
      `https://api.hypixel.net/player?key=f31e0dc1-30e8-4ec8-84cb-3060b60c56bc&uuid=${uuid}`
    );
    data = await resp.json();
    playerData = data;
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "Stats fetch error. This player may not<br>have played on Hypixel before.";
    document.getElementById("eb").style.opacity = 1;

    document.getElementById("eb").addEventListener("click", () => {
      window.location.href = "../html/index.html";
    });
    document.getElementById("eb").style.cursor = "pointer";

    console.log(e);
    return;
  }
  bwData = playerData.player.stats.Bedwars;
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
  dataArrayNone.forEach((item) => {
    if (!bwData[item]) {
      bwData[item] = 0;
    }
  });
  dataArrayOne.forEach((item) => {
    if (!bwData[item]) {
      bwData[item] = 1;
    }
  });
  const rank = calculateRank(playerData.player);
  let plusColor;
  document.getElementById("name").innerHTML = name;
  switch (rank) {
    case "NON" || "NORMAL":
      document.getElementById("rank").innerHTML = "";
      document.getElementById("name").style.color = "#AAAAAA";
      break;
    case "VIP":
      document.getElementById("rank").innerHTML = "[VIP]";
      document.getElementById("rank").style.color = "#55FF55";
      document.getElementById("name").style.color = "#55FF55";
      break;
    case "VIP+":
      document.getElementById("rank").innerHTML =
        '[VIP<span id="rankPlus">+</span>]';
      document.getElementById("rank").style.color = "#55FF55";
      document.getElementById("name").style.color = "#55FF55";
      document.getElementById("rankPlus").style.color = "#FFAA00";
      break;
    case "MVP":
      document.getElementById("rank").innerHTML = "[MVP]";
      document.getElementById("rank").style.color = "#55FFFF";
      document.getElementById("name").style.color = "#55FFFF";
      break;
    case "MVP+":
      document.getElementById("rank").innerHTML =
        '[MVP<span id="rankPlus">+</span>]';
      document.getElementById("rank").style.color = "#55FFFF";
      document.getElementById("name").style.color = "#55FFFF";
      if (playerData.player.rankPlusColor) {
        plusColor = colorCodes(playerData.player.rankPlusColor.toLowerCase());
      } else {
        plusColor = "#FF5555";
      }
      document.getElementById("rankPlus").style.color = plusColor;
      break;
    case "MVP++":
      document.getElementById("rank").innerHTML =
        '[MVP<span id="rankPlus">++</span>]';
      if (playerData.player.monthlyRankColor === "AQUA") {
        document.getElementById("rank").style.color = "#55FFFF";
        document.getElementById("name").style.color = "#55FFFF";
      } else {
        document.getElementById("rank").style.color = "#FFAA00";
        document.getElementById("name").style.color = "#FFAA00";
      }
      if (playerData.player.rankPlusColor) {
        plusColor = colorCodes(playerData.player.rankPlusColor.toLowerCase());
      } else {
        plusColor = "#FF5555";
      }
      document.getElementById("rankPlus").style.color = plusColor;
      break;
    case "HELPER":
      document.getElementById("rank").innerHTML = "[HELPER]";
      document.getElementById("rank").style.color = "#5555FF";
      document.getElementById("name").style.color = "#5555FF";
      break;
    case "MODERATOR":
      document.getElementById("rank").innerHTML = "[MOD]";
      document.getElementById("rank").style.color = "#5555FF";
      document.getElementById("name").style.color = "#5555FF";
      break;
    case "ADMIN":
      document.getElementById("rank").innerHTML = "[ADMIN]";
      document.getElementById("rank").style.color = "#FF5555";
      document.getElementById("name").style.color = "#FF5555";
      break;
    case "§c[OWNER]":
      document.getElementById("rank").innerHTML = "[OWNER]";
      document.getElementById("rank").style.color = "#FF5555";
      document.getElementById("name").style.color = "#FF5555";
      break;
    case "YOUTUBER":
      document.getElementById("rank").innerHTML =
        '[<span id="rankPlus">YOUTUBE</span>]';
      document.getElementById("rank").style.color = "#FF5555";
      document.getElementById("name").style.color = "#FF5555";
      document.getElementById("rankPlus").style.color = "#FFFFFF";
      break;
  }
  document.getElementById("loader").style.opacity = 0;
  document.getElementById("loaderText").style.opacity = 0;
  document.getElementById("navigation").style.flex = 1;
  document.getElementById("navigation").style.opacity = 1;
  document.getElementById("sSec").style.opacity = 1;
  document.getElementById("finalsMain").style.paddingTop = "16vh";
  document.getElementById("finalsNumber").innerHTML =
    bwData.final_kills_bedwars;
  document.getElementById("winsMain").style.paddingTop = "16vh";
  document.getElementById("winsNumber").innerHTML = bwData.wins_bedwars;
  document.getElementById("levelMain").style.paddingTop = "6vh";
  stars = calculateBedwarsStars(bwData.Experience);
  document.getElementById("levelNumber").innerHTML = `${stars}${
    stars >= 1000 ? (stars >= 2000 ? "✯" : "✪") : "✩"
  }`;
  const levelColor = calculateColor(stars);
  document.getElementById("levelNumber").style.backgroundImage = levelColor;
  const percent =
    (100 * bwData.wins_bedwars) / (bwData.losses_bedwars + bwData.wins_bedwars);
  document.getElementById("winPercent").innerHTML = percent.toFixed(1);
  document.getElementById("KDR").innerHTML = (
    bwData.kills_bedwars / bwData.deaths_bedwars
  ).toFixed(2);
  document.getElementById("FKDR").innerHTML = (
    bwData.final_kills_bedwars / bwData.final_deaths_bedwars
  ).toFixed(2);
  document.getElementById("BBLR").innerHTML = (
    bwData.beds_broken_bedwars / bwData.beds_lost_bedwars
  ).toFixed(2);
  await sleep(500);
  document.getElementById("sss").style.opacity = 1;
  document.getElementById("animWinP").style.marginRight = "5.866666vh";
  document.getElementById("animSepDiv").style.marginLeft = "5.866666vh";

  const rating = calculateScore({
    stars: stars,
    fkdr: bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
    bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
    wlr: bwData.wins_bedwars / bwData.losses_bedwars,
    finals: bwData.final_kills_bedwars,
    beds: bwData.beds_broken_bedwars,
    wins: bwData.wins_bedwars,
  });

  await sleep(500);
  document.getElementById("scoreDiv").style.opacity = 1;
  document.getElementById("scoreNum").innerHTML = rating.toFixed(1);
  const hsl = scoreToColor(rating);
  document.getElementById("scoreNum").style.textShadow = `0 0 0.92592vh ${hsl}`;
};

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("homeIcon").addEventListener("click", () => {
  window.location.href = "../html/index.html"; //temporary
});

const xpPerPrestige = 487000;

function calculateBedwarsStars(exp) {
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
    case 1 || 11:
      baseColor = "white";
      break;
    case 2 || 12:
      baseColor = "orange";
      break;
    case 3 || 13:
      baseColor = "aqua";
      break;
    case 4 || 14:
      baseColor = "green";
      break;
    case 5 || 15:
      baseColor = "royalblue";
      break;
    case 6 || 16:
      baseColor = "crimson";
      break;
    case 7 || 17:
      baseColor = "salmon";
      break;
    case 8 || 18:
      baseColor = "mediumblue";
      break;
    case 9 || 19:
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
    case 30:
      return "linear-gradient(to right, yellow, red";
  }
  return `linear-gradient(to right, ${baseColor}, ${baseColor})`;
}

function calculateScore(stats) {
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
  return score * 10;
}

const normalCutoff = 2500;

function scoreToColor(score) {
  const cutoff = 82.5 * normalCutoff;
  let hue = cutoff / (score + cutoff / 220) - 60;
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
      return "#AAAAAA";
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

document.getElementById("filter").onchange = () => {
  const value = document.getElementById("filter").value;
  switch (value) {
    case "Solo": {
      smoothTransition(
        "finalsNumber",
        parseFloat(document.getElementById("finalsNumber").innerHTML),
        bwData.eight_one_final_kills_bedwars,
        0
      );
      smoothTransition(
        "winsNumber",
        parseFloat(document.getElementById("winsNumber").innerHTML),
        bwData.eight_one_wins_bedwars,
        0
      );
      smoothTransition(
        "winPercent",
        parseFloat(document.getElementById("winPercent").innerHTML),
        (
          100 *
          (bwData.eight_one_wins_bedwars /
            (bwData.eight_one_wins_bedwars + bwData.eight_one_losses_bedwars))
        ).toFixed(1),
        1
      );
      smoothTransition(
        "KDR",
        parseFloat(document.getElementById("KDR").innerHTML),
        (
          bwData.eight_one_kills_bedwars / bwData.eight_one_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "FKDR",
        parseFloat(document.getElementById("FKDR").innerHTML),
        (
          bwData.eight_one_final_kills_bedwars /
          bwData.eight_one_final_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "BBLR",
        parseFloat(document.getElementById("BBLR").innerHTML),
        (
          bwData.eight_one_beds_broken_bedwars /
          bwData.eight_one_beds_lost_bedwars
        ).toFixed(2),
        2
      );
      const rating = calculateScore({
        stars: stars,
        fkdr:
          bwData.eight_one_final_kills_bedwars /
          bwData.eight_one_final_deaths_bedwars,
        bblr:
          bwData.eight_one_beds_broken_bedwars /
          bwData.eight_one_beds_lost_bedwars,
        wlr: bwData.eight_one_wins_bedwars / bwData.eight_one_losses_bedwars,
        finals: bwData.eight_one_final_kills_bedwars,
        beds: bwData.eight_one_beds_broken_bedwars,
        wins: bwData.eight_one_wins_bedwars,
      });
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        rating.toFixed(1),
        1
      );
      const hsl = scoreToColor(rating * 3);
      document.getElementById().style.textShadow = `0 0 0.92592vh ${hsl}`;
      break;
    }
    case "Doubles": {
      smoothTransition(
        "finalsNumber",
        parseFloat(document.getElementById("finalsNumber").innerHTML),
        bwData.eight_two_final_kills_bedwars,
        0
      );
      smoothTransition(
        "winsNumber",
        parseFloat(document.getElementById("winsNumber").innerHTML),
        bwData.eight_two_wins_bedwars,
        0
      );
      smoothTransition(
        "winPercent",
        parseFloat(document.getElementById("winPercent").innerHTML),
        (
          100 *
          (bwData.eight_two_wins_bedwars /
            (bwData.eight_two_wins_bedwars + bwData.eight_two_losses_bedwars))
        ).toFixed(1),
        1
      );
      smoothTransition(
        "KDR",
        parseFloat(document.getElementById("KDR").innerHTML),
        (
          bwData.eight_two_kills_bedwars / bwData.eight_two_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "FKDR",
        parseFloat(document.getElementById("FKDR").innerHTML),
        (
          bwData.eight_two_final_kills_bedwars /
          bwData.eight_two_final_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "BBLR",
        parseFloat(document.getElementById("BBLR").innerHTML),
        (
          bwData.eight_two_beds_broken_bedwars /
          bwData.eight_two_beds_lost_bedwars
        ).toFixed(2),
        2
      );
      const rating = calculateScore({
        stars: stars,
        fkdr:
          bwData.eight_two_final_kills_bedwars /
          bwData.eight_two_final_deaths_bedwars,
        bblr:
          bwData.eight_two_beds_broken_bedwars /
          bwData.eight_two_beds_lost_bedwars,
        wlr: bwData.eight_two_wins_bedwars / bwData.eight_two_losses_bedwars,
        finals: bwData.eight_two_final_kills_bedwars,
        beds: bwData.eight_two_beds_broken_bedwars,
        wins: bwData.eight_two_wins_bedwars,
      });
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        rating.toFixed(1),
        1
      );
      const hsl = scoreToColor(rating * 3);
      document.getElementById(
        "scoreNum"
      ).style.textShadow = `0 0 0.92592vh ${hsl}`;
      break;
    }
    case "Triples": {
      smoothTransition(
        "finalsNumber",
        parseFloat(document.getElementById("finalsNumber").innerHTML),
        bwData.four_three_final_kills_bedwars,
        0
      );
      smoothTransition(
        "winsNumber",
        parseFloat(document.getElementById("winsNumber").innerHTML),
        bwData.four_three_wins_bedwars,
        0
      );
      smoothTransition(
        "winPercent",
        parseFloat(document.getElementById("winPercent").innerHTML),
        (
          100 *
          (bwData.four_three_wins_bedwars /
            (bwData.four_three_wins_bedwars + bwData.four_three_losses_bedwars))
        ).toFixed(1),
        1
      );
      smoothTransition(
        "KDR",
        parseFloat(document.getElementById("KDR").innerHTML),
        (
          bwData.four_three_kills_bedwars / bwData.four_three_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "FKDR",
        parseFloat(document.getElementById("FKDR").innerHTML),
        (
          bwData.four_three_final_kills_bedwars /
          bwData.four_three_final_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "BBLR",
        parseFloat(document.getElementById("BBLR").innerHTML),
        (
          bwData.four_three_beds_broken_bedwars /
          bwData.four_three_beds_lost_bedwars
        ).toFixed(2),
        2
      );
      const rating = calculateScore({
        stars: stars,
        fkdr:
          bwData.four_three_final_kills_bedwars /
          bwData.four_three_final_deaths_bedwars,
        bblr:
          bwData.four_three_beds_broken_bedwars /
          bwData.four_three_beds_lost_bedwars,
        wlr: bwData.four_three_wins_bedwars / bwData.four_three_losses_bedwars,
        finals: bwData.four_three_final_kills_bedwars,
        beds: bwData.four_three_beds_broken_bedwars,
        wins: bwData.four_three_wins_bedwars,
      });
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        rating.toFixed(1),
        1
      );
      const hsl = scoreToColor(rating * 3);
      document.getElementById(
        "scoreNum"
      ).style.textShadow = `0 0 0.92592vh ${hsl}`;
      break;
    }
    case "Squads": {
      smoothTransition(
        "finalsNumber",
        parseFloat(document.getElementById("finalsNumber").innerHTML),
        bwData.four_four_final_kills_bedwars,
        0
      );
      smoothTransition(
        "winsNumber",
        parseFloat(document.getElementById("winsNumber").innerHTML),
        bwData.four_four_wins_bedwars,
        0
      );
      smoothTransition(
        "winPercent",
        parseFloat(document.getElementById("winPercent").innerHTML),
        (
          100 *
          (bwData.four_four_wins_bedwars /
            (bwData.four_four_wins_bedwars + bwData.four_four_losses_bedwars))
        ).toFixed(1),
        1
      );
      smoothTransition(
        "KDR",
        parseFloat(document.getElementById("KDR").innerHTML),
        (
          bwData.four_four_kills_bedwars / bwData.four_four_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "FKDR",
        parseFloat(document.getElementById("FKDR").innerHTML),
        (
          bwData.four_four_final_kills_bedwars /
          bwData.four_four_final_deaths_bedwars
        ).toFixed(2),
        2
      );
      smoothTransition(
        "BBLR",
        parseFloat(document.getElementById("BBLR").innerHTML),
        (
          bwData.four_four_beds_broken_bedwars /
          bwData.four_four_beds_lost_bedwars
        ).toFixed(2),
        2
      );
      const rating = calculateScore({
        stars: stars,
        fkdr:
          bwData.four_four_final_kills_bedwars /
          bwData.four_four_final_deaths_bedwars,
        bblr:
          bwData.four_four_beds_broken_bedwars /
          bwData.four_four_beds_lost_bedwars,
        wlr: bwData.four_four_wins_bedwars / bwData.four_four_losses_bedwars,
        finals: bwData.four_four_final_kills_bedwars,
        beds: bwData.four_four_beds_broken_bedwars,
        wins: bwData.four_four_wins_bedwars,
      });
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        rating.toFixed(1),
        1
      );
      const hsl = scoreToColor(rating * 3);
      document.getElementById(
        "scoreNum"
      ).style.textShadow = `0 0 0.92592vh ${hsl}`;
      break;
    }
    case "All": {
      smoothTransition(
        "finalsNumber",
        parseFloat(document.getElementById("finalsNumber").innerHTML),
        bwData.final_kills_bedwars,
        0
      );
      smoothTransition(
        "winsNumber",
        parseFloat(document.getElementById("winsNumber").innerHTML),
        bwData.wins_bedwars,
        0
      );
      smoothTransition(
        "winPercent",
        parseFloat(document.getElementById("winPercent").innerHTML),
        (
          100 *
          (bwData.wins_bedwars / (bwData.wins_bedwars + bwData.losses_bedwars))
        ).toFixed(1),
        1
      );
      smoothTransition(
        "KDR",
        parseFloat(document.getElementById("KDR").innerHTML),
        (bwData.kills_bedwars / bwData.deaths_bedwars).toFixed(2),
        2
      );
      smoothTransition(
        "FKDR",
        parseFloat(document.getElementById("FKDR").innerHTML),
        (bwData.final_kills_bedwars / bwData.final_deaths_bedwars).toFixed(2),
        2
      );
      smoothTransition(
        "BBLR",
        parseFloat(document.getElementById("BBLR").innerHTML),
        (bwData.beds_broken_bedwars / bwData.beds_lost_bedwars).toFixed(2),
        2
      );
      const rating = calculateScore({
        stars: stars,
        fkdr: bwData.final_deaths_bedwars
          ? bwData.final_kills_bedwars / bwData.final_deaths_bedwars
          : bwData.final_kills_bedwars,
        bblr: bwData.beds_lost_bedwars
          ? bwData.beds_broken_bedwars / bwData.beds_lost_bedwars
          : bwData.beds_broken_bedwars,
        wlr: bwData.losses_bedwars
          ? bwData.wins_bedwars / bwData.losses_bedwars
          : bwData.wins_bedwars,
        finals: bwData.final_kills_bedwars,
        beds: bwData.beds_broken_bedwars,
        wins: bwData.wins_bedwars,
      });
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        rating.toFixed(1),
        1
      );
      const hsl = scoreToColor(rating * 3);
      document.getElementById(
        "scoreNum"
      ).style.textShadow = `0 0 0.92592vh ${hsl}`;
      break;
    }
  }
};

const sigmoidEaseOutStrength = 7;
const sigmoidSleepTimer = 20;

async function smoothTransition(id, init, final, fixedNum, hue = false) {
  for (
    let i = 0;
    i < sigmoidEaseOutStrength + 0.01;
    i += sigmoidEaseOutStrength / 50
  ) {
    await sleep(sigmoidSleepTimer);
    const sigmoidVal = sigmoidValue(i) * Math.abs(final - init);
    if (init > final) {
      document.getElementById(id).innerHTML = (init - sigmoidVal).toFixed(
        fixedNum
      );
    } else {
      document.getElementById(id).innerHTML = (sigmoidVal + init).toFixed(
        fixedNum
      );
    }
  }
  document.getElementById(id).innerHTML = final;
}

function sigmoidValue(x) {
  return (
    (2 * (1 + Math.pow(Math.E, sigmoidEaseOutStrength * -1))) /
      (1 + Math.pow(Math.E, -x)) -
    1
  );
}

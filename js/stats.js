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
    resp = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
    data = await resp.json();
    uuid = data.uuid;
    name = data.username;
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "UUID fetch error. Make sure you are connected to the internet, <br>and that the username is spelt correctly.";
    document.getElementById("eb").style.opacity = 1;

    document.getElementById("eb").style.cursor = "pointer";

    document.getElementById("eb").addEventListener("click", () => {
      homeScreen();
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
    bwData = playerData.player.stats.Bedwars;
    if (!bwData) {
      throw "Bedwars never played";
    }
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "Stats fetch error. This player may not<br>have played bedwars before.";
    document.getElementById("eb").style.opacity = 1;

    document.getElementById("eb").addEventListener("click", () => {
      homeScreen();
    });
    document.getElementById("eb").style.cursor = "pointer";

    console.log(e);
    return;
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
  stars = calculateStars(bwData.Experience);
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

document.getElementById("homeIcon").addEventListener("click", () => {
  homeScreen();
});

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

async function homeScreen() {
  document.getElementById("cover").style.height = "100%";
  await sleep(760);
  window.location.href = "../html/index.html";
}

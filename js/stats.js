let bwData;
let stars;
window.onload = async function getPlayerStats() {
  let username = sessionStorage.getItem("username");
  let uuid;
  let name;
  let resp;
  let data;
  settingsData = await window.electronAPI.readFile("settings.json");
  document.getElementById("loaderText").innerHTML = "Fetching player UUID...";
  document.getElementById("loader").style.opacity = 1;
  document.getElementById("loaderText").style.opacity = 1;
  try {
    resp = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
    data = await resp.json();
    if (data.code === 404) {
      throw "Username Not Found";
    }
    uuid = data.uuid;
    name = data.username;
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "UUID fetch error. Make sure you are connected to the internet, <br>and that the username is spelt correctly.";
    document.getElementById("eb").style.opacity = 1;
    document.querySelector(".mainContent").style.backgroundColor = "#ffd8d8";

    document.getElementById("eb").style.cursor = "pointer";

    document.getElementById("eb").addEventListener("click", () => {
      homeScreen();
    });
    console.log(e);
    return;
  }
  document.getElementById("loaderText").innerHTML = "Fetching player stats...";
  try {
    playerData = await getPlayerData(settingsData.hypixelAPIKey, uuid);
    bwData = playerData.player.stats.Bedwars;
    if (!bwData) {
      throw "Bedwars never played";
    }
  } catch (e) {
    document.getElementById("loader").style.opacity = 0;
    document.getElementById("loaderText").innerHTML =
      "Stats fetch error. Make sure your API key is correct. <br> If it is, this player may not have played bedwars before.";
    document.getElementById("eb").style.opacity = 1;
    document.querySelector(".mainContent").style.backgroundColor = "#ffd8d8";

    document.getElementById("eb").addEventListener("click", () => {
      homeScreen();
    });
    document.getElementById("eb").style.cursor = "pointer";

    console.log(e);
    return;
  }
  const rank = calculateRank(playerData.player);
  document.getElementById("name").innerHTML = name;
  const rankData = rankToColor(rank, [playerData.player], 0);
  document.getElementById("rank").innerHTML = rankData.rank;
  document.getElementById("rank").style.color = rankData.color;
  document.getElementById("name").style.color = rankData.color;
  if (rankData.plusColor) {
    document.getElementById("rankPlus0").style.color = rankData.plusColor;
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

  await sleep(500);
  document.getElementById("scoreDiv").style.opacity = 1;
  document.getElementById("scoreNum").innerHTML = score.toFixed(1);
  const hsl = scoreToColor(score);
  document.getElementById("scoreNum").style.textShadow = `0 0 0.92592vh ${hsl}`;
};

document.getElementById("homeIcon").addEventListener("click", () => {
  homeScreen();
});

document.getElementById("filter").onchange = async () => {
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
      const score = await calculateScore(
        {
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
        },
        settingsData
      );
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        score.toFixed(1),
        1
      );
      const hsl = scoreToColor(score * 3);
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
      const score = await calculateScore(
        {
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
        },
        settingsData
      );
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        score.toFixed(1),
        1
      );
      const hsl = scoreToColor(score * 2);
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
      const score = await calculateScore(
        {
          stars: stars,
          fkdr:
            bwData.four_three_final_kills_bedwars /
            bwData.four_three_final_deaths_bedwars,
          bblr:
            bwData.four_three_beds_broken_bedwars /
            bwData.four_three_beds_lost_bedwars,
          wlr:
            bwData.four_three_wins_bedwars / bwData.four_three_losses_bedwars,
          finals: bwData.four_three_final_kills_bedwars,
          beds: bwData.four_three_beds_broken_bedwars,
          wins: bwData.four_three_wins_bedwars,
        },
        settingsData
      );
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        score.toFixed(1),
        1
      );
      const hsl = scoreToColor(score * 1.5);
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
      const score = await calculateScore(
        {
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
        },
        settingsData
      );
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        score.toFixed(1),
        1
      );
      const hsl = scoreToColor(score * 1.5);
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
      smoothTransition(
        "scoreNum",
        parseFloat(document.getElementById("scoreNum").innerHTML),
        score.toFixed(1),
        1
      );
      const hsl = scoreToColor(score);
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
  await sleep(505);
  window.location.href = "../html/index.html";
}

document.getElementById("settingsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/settings.html";
  }, 505);
});

document.getElementById("friendsIcon").addEventListener("click", () => {
  document.getElementById("cover").style.height = "100%";
  setTimeout(() => {
    window.location.href = "../html/friends.html";
  }, 505);
});

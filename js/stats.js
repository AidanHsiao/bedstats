window.onload = async function getPlayerStats() {
  let username = sessionStorage.getItem("username");
  let uuid;
  let playerData;
  document.getElementById("loaderText").innerHTML = "Fetching player UUID...";
  document.getElementById("loader").style.opacity = 1;
  document.getElementById("loaderText").style.opacity = 1;
  let resp = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  let contentType = resp.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json" !== -1)) {
    const data = await resp.json();
    uuid = data.id;
    document.getElementById("loaderText").innerHTML =
      "Fetching player stats...";
    resp = await fetch(
      `https://api.hypixel.net/player?key=f31e0dc1-30e8-4ec8-84cb-3060b60c56bc&uuid=${uuid}`
    );
    const newData = await resp.json();
    playerData = newData;
  } else {
    console.log("failure1");
  }
  if (!playerData.player.stats.Bedwars) {
    window.location.href = "../html/index.html";
  }
  const bwData = playerData.player.stats.Bedwars;
  console.log(bwData);
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
  const stars = calculateBedwarsStars(bwData.Experience);
  document.getElementById("levelNumber").innerHTML = `${stars}${
    stars >= 1000 ? (stars >= 2000 ? "✯" : "✪") : "✩"
  }`;
  const levelColor = calculateColor(stars);
  document.getElementById("levelNumber").style.backgroundImage = levelColor;
  const percent =
    (100 * bwData.wins_bedwars) / (bwData.losses_bedwars + bwData.wins_bedwars);
  document.getElementById("winPercent").innerHTML = percent.toFixed(1);
  document.getElementById("KDR").innerHTML = `KDR: ${(
    bwData.kills_bedwars / bwData.deaths_bedwars
  ).toFixed(2)}`;
  document.getElementById("FKDR").innerHTML = `FKDR: ${(
    bwData.final_kills_bedwars / bwData.final_deaths_bedwars
  ).toFixed(2)}`;
  document.getElementById("BBLR").innerHTML = `BBLR: ${(
    bwData.beds_broken_bedwars / bwData.beds_lost_bedwars
  ).toFixed(2)}`;
  await sleep(500);
  document.getElementById("sss").style.opacity = 1;
  document.getElementById("animWinP").style.marginRight = "2.3vw";
  document.getElementById("KDR").style.paddingLeft = "4vw";
  document.getElementById("FKDR").style.paddingLeft = "4vw";
  document.getElementById("BBLR").style.paddingLeft = "4vw";

  const rating = calculateRating({
    stars: stars,
    fkdr: bwData.final_kills_bedwars / bwData.final_deaths_bedwars,
    bblr: bwData.beds_broken_bedwars / bwData.beds_lost_bedwars,
    wlr: bwData.wins_bedwars / bwData.losses_bedwars,
    finals: bwData.final_kills_bedwars,
    beds: bwData.beds_broken_bedwars,
    wins: bwData.wins_bedwars,
  });

  document.getElementById("scoreNum").innerHTML = rating.toFixed(1);
  const hsl = scoreToColor(rating);
  console.log(hsl);
  document.getElementById("scoreNum").style.textShadow = `0px 0px 10px ${hsl}`;
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

function calculateRating(stats) {
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

const normalCutoff = 1000;

function scoreToColor(score) {
  const cutoff = 82.5 * normalCutoff;
  let hue = cutoff / (score + cutoff / 220) - 60;
  if (hue < -60) {
    hue = -60;
  }
  if (hue < 0) {
    hue += 360;
  }

  return `hsl(${hue}, 100%, 50%)`;
}

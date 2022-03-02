async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("homeIcon").addEventListener("click", () => {
  homeScreen()
});

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
    default:
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
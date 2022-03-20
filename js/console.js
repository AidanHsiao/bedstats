let opened = false;
const body = document.querySelector("body")
const consoleDiv = document.getElementById("console");
document.addEventListener("keydown", (e) => {
  if (e.key === "F12") {
    opened = !opened;
    if (opened) {
      consoleDiv.style.right = "3vw";
    } else {
      consoleDiv.style.right = "-30vw";
    }
  }
});
window.addEventListener("DOMContentLoaded", (ev) => {
  const now = Date.now()
  const loadingTime = now - performance.timing.navigationStart
  document.getElementById("loadingTime").innerHTML = `DOM Loading Time: ${loadingTime}ms`
})

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}

function updateFPSCounter() {
  document.getElementById("pageFPS").innerHTML = `Page FPS: ${fps}fps`
}

setInterval(updateFPSCounter, 500)
refreshLoop();
window.onload = async function loadFriends() {
  const settingsData = await window.electronAPI.readFile("settings.json");
  console.log(settingsData);
  document.getElementById("cover").style.height = "0%";
};

document.getElementById("homeIcon").addEventListener("click", async () => {
  document.getElementById("cover").style.height = "100%";
  await sleep(760);
  window.location.href = "../html/index.html";
});

document.getElementById("settingsIcon").addEventListener("click", async () => {
  document.getElementById("cover").style.height = "100%";
  await sleep(760);
  window.location.href = "../html/settings.html";
});

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

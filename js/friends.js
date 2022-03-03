window.onload = async function loadFriends() {
  const settingsData = await window.electronAPI.readFile("settings.json");
  console.log(settingsData);
  document.getElementById("navigation").style.opacity = 1;
}
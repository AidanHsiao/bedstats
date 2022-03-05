let friends;

window.onload = async function loadFriends() {
  const settingsData = await window.electronAPI.readFile("settings.json");
  document.getElementById("cover").style.height = "0%";
  friends = await window.electronAPI.readFile("friends.json");
  Object.keys(friends).forEach((key, idx) => {
    document.getElementById("friendsListWrapper").innerHTML = `${
      document.getElementById("friendsListWrapper").innerHTML
    }<div class="friend">
    <img
      src="https://minotar.net/helm/${key}/180.png"
      alt="face"
      class="friendImage"
    />
    <div class="friendText">
      ${key}
      <span class="friendUUID">(${friends[key]})</span>
    </div>
    <div class="friendRemoveButton">-</div>
  </div>`;
  });
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

document
  .getElementById("friendInput")
  .addEventListener("keypress", async (key) => {
    const trueReg = /[A-Za-z\d_]/.test(key.key);
    if (!trueReg) {
      key.preventDefault();
    }
    if (document.getElementById("friendInput").value.length >= 16) {
      key.preventDefault();
    }
  });

document.getElementById("addFriend").addEventListener("click", async () => {
  if (/[A-Za-z\d_]{3,16}/.test(document.getElementById("friendInput").value)) {
    friends[document.getElementById("friendInput").value] = "bruh";
    await window.electronAPI.writeFile("friends.json", friends);
  } else {
    console.log("doesn't match");
  }
});

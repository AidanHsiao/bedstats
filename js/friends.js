let friends;
async function formItem(k, u, i) {
  document.getElementById("friendsListWrapper").innerHTML = `${
  document.getElementById("friendsListWrapper").innerHTML
}<div class="friend" id="friend${i}">
<img
  src="https://minotar.net/helm/${k}/180.png"
  alt="face"
  class="friendImage"
/>
<div class="friendText" id="friendText${i}">
  ${k}
<span class="friendUUID">(${u})</span>
</div>
<div class="friendRemoveButton" id=${i}>-</div>
</div>`
}

document.getElementById("friendsListWrapper").addEventListener("click", (event) => {
  if (event.target.className.includes("friendRemoveButton")) {
    const eventIndex = event.target.id
    const item = document.querySelector(`#friend${eventIndex}`)
    const text = document.querySelector(`#friendText${eventIndex}`).innerHTML.split("<span")[0].replaceAll("\n","").replaceAll(" ","")
    item.remove()
    delete friends[text]
  }
})

window.onload = async function loadFriends() {
  const settingsData = await window.electronAPI.readFile("settings.json");
  document.getElementById("cover").style.height = "0%";
  friends = await window.electronAPI.readFile("friends.json");
  Object.keys(friends).forEach((key, idx) => {
    formItem(key, friends[key], idx)
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
    if (key.code === "Enter") {
      addFriend()
    }
  });

document.getElementById("addFriend").addEventListener("click", async () => {
  addFriend()
});

document.getElementById("removeFriendsButton").addEventListener("click", () => {
  friends = {}
  document.getElementById("friendsListWrapper").innerHTML = ""
})

document.getElementById("saveFriendsButton").addEventListener("click", async () => {
  await window.electronAPI.writeFile("friends.json", friends)
  document.getElementById("cover").style.height = "100%"
  setTimeout(() => {
    window.location.href = "../html/index.html"
  }, 760)
})

async function addFriend() {
  if (/[A-Za-z\d_]{3,16}/.test(document.getElementById("friendInput").value)) {
    const friendsList = Object.keys(friends).map((item) => { return item.toLowerCase() })
    if (!friendsList.includes(document.getElementById("friendInput").value.toLowerCase())) {
      document.getElementById("loader").style.opacity = 1
      document.querySelector("body").style.opacity = 0.8
      let uuid;
      try {
        resp = await fetch(`https://api.ashcon.app/mojang/v2/user/${document.getElementById("friendInput").value}`);
        data = await resp.json();
        if (data.code === 404) {
          throw "Username Not Found";
        }
        uuid = data.uuid;
        username = data.username
      } catch (e) {
        console.log(e)
      }
      friends[username] = uuid
      formItem(username, uuid, Object.keys(friends).length - 1)
      document.getElementById("friendInput").value = ""
      document.getElementById("loader").style.opacity = 0
      document.querySelector("body").style.opacity = 1
    }
  } else {
    console.log("doesn't match");
  }
}
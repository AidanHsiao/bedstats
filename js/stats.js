window.onload = async function getPlayerStats() { 
    let username = sessionStorage.getItem("username")
    let uuid;
    let playerData;
    document.getElementById("loaderText").innerHTML = "Fetching player UUID..."
    document.getElementById("loader").style.opacity = 1
    document.getElementById("loaderText").style.opacity = 1
    let resp = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    let contentType = resp.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json" !== -1)) {
        const data = await resp.json()
        uuid = data.id
    } else {
        console.log("failure1")
    }
    document.getElementById("loaderText").innerHTML = "Fetching player stats..."
    resp = await fetch(`https://api.hypixel.net/player?key=f31e0dc1-30e8-4ec8-84cb-3060b60c56bc&uuid=${uuid}`)
    contentType = resp.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json" !== -1)) {
        const data = await resp.json()
        playerData = data
    } else {
        console.log("failure2")
    }
    console.log(playerData)
    document.getElementById("loader").style.opacity = 0
    document.getElementById("loaderText").style.opacity = 0
    document.getElementById("navigation").style.flex = 1
    document.getElementById("navigation").style.opacity = 1
}

async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("homeIcon").addEventListener("click", () => {
    window.location.href = "../html/index.html" //temporary
})
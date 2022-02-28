// document.getElementById("myButton").addEventListener("click", async () => {
//     let username = "SweetPlum"
//     let uuid;
//     let playerData;
//     await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then((response) => response.json()).then((data) => { uuid = data.id })
//     await fetch(`https://api.hypixel.net/player?key=f31e0dc1-30e8-4ec8-84cb-3060b60c56bc&uuid=${uuid}`).then((response) => response.json()).then((data) => { playerData = data.player })
//     document.getElementById("bedwars-wins").innerHTML = playerData.stats.Bedwars.wins_bedwars
// })

document.getElementById("searchButton").addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value
    await sessionStorage.setItem("username", username)
    window.location.href = "../html/stats.html"
})
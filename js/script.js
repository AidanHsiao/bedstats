document.getElementById("searchButton").addEventListener("click", async () => {
  if (document.getElementById("usernameInput").value) {
    const username = document.getElementById("usernameInput").value;
    await sessionStorage.setItem("username", username);
    document.getElementById("cover").style.height = "100vh";
    setTimeout(() => {
      window.location.href = "../html/stats.html";
    }, 760);
  }
});

document.getElementById("leaderboardButton").addEventListener("click", async () => {
    document.getElementById("cover").style.height = "100vh";
    setTimeout(() => {
    window.location.href = "../html/leaderboards.html";
    }, 760);
})

window.onload = async function uncover() {
    document.getElementById("cover").style.height = "0vh"
}
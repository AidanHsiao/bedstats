window.onload = async function getHelp() {
  document.getElementById("cover").style.width = 0;
}

document.querySelectorAll(".questionDiv").forEach((div) => {
  div.addEventListener("click", (ev) => {
    if (div.style.height !== "10vh" && div.style.height) {
      div.style.height = "10vh"
      div.children[0].children[1].innerHTML = "+"
    } else {
      div.style.height = `${div.scrollHeight}px`;
      div.children[0].children[1].innerHTML = "-"
    }
  });
});

document.addEventListener("keydown", async (ev) => {
  await sleep(5)
  const value = document.getElementById("searchBar").value
  console.log(value)
  if (value) {
    document.querySelectorAll(".title").forEach((div) => {
      if (!div.innerHTML.toLowerCase().includes(value.toLowerCase())) {
        div.parentElement.parentElement.style.display = "none"
      } else {
        div.parentElement.parentElement.style.display = "block"
      }
    })
  } else {
    document.querySelectorAll(".questionDiv").forEach((div) => {
      div.style.display = "block"
    })
  }
})
let opened = false;
document.addEventListener("keydown", (e) => {
  if (e.key === "F12") {
    // const console = document.getElementById("console");
    opened = !opened;
    if (opened) {
    } else {
    }
    console.log(opened);
  }
});

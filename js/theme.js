const colorPalettes = {
  monotone: [
    "#dedede",
    "#666666",
    "#9c9c9c",
    "#aaaaaa",
    "#ffffff",
    "white",
    "black",
    "#878787",
  ],
  snowy_sky: [
    "#4da3cf",
    "#bdadd5",
    "#91d8ff",
    "#458f9f",
    "#a0a6ff",
    "white",
    "black",
    "#7cb8b8",
  ],
  midnight: [
    "#6969bf",
    "#a0aad0",
    "#c4c4c4",
    "#b5a1cd",
    "#ac69ac",
    "white",
    "black",
    "#6969ef",
  ],
  aquarium: [
    "#3a939c",
    "#44a1a0",
    "#78cdd7",
    "#247b7b",
    "#80a0e0",
    "white",
    "black",
    "#07679d",
  ],
};

async function loadTheme() {
  const settingsData = await window.electronAPI.readFile("settings.json");
  const type = settingsData.theme.toLowerCase().replace(/ /g, "_");
  const root = document.querySelector(":root");
  root.style.setProperty("--color1", colorPalettes[type][0]);
  root.style.setProperty("--color1Dimmed", `${colorPalettes[type][0]}80`);
  root.style.setProperty("--color2", colorPalettes[type][1]);
  root.style.setProperty("--color2Dimmed", `${colorPalettes[type][1]}b3`);
  root.style.setProperty("--color3", colorPalettes[type][2]);
  root.style.setProperty("--color3Dimmed", `${colorPalettes[type][2]}80`);
  root.style.setProperty("--color4", colorPalettes[type][3]);
  root.style.setProperty("--color5", colorPalettes[type][4]);
  root.style.setProperty("--highlight", colorPalettes[type][5]);
  root.style.setProperty("--lowlight", colorPalettes[type][6]);
  root.style.setProperty("--navBar", colorPalettes[type][7]);
  const animationSpeed = settingsData.animationRate.split(" ")[0];
  document.querySelector("body").style.backgroundImage = `url(../img/${
    type.split("_")[0]
  }BG.jpeg)`;
  if (type === "monotone") {
    document.querySelector("body").style.backgroundImage = `linear-gradient(to right, #c9c9c9, #c9c9c9)`
  }
  if (!settingsData.animationEnabled) return;
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  switch (type) {
    case "snowy_sky": {
      const flakes = [];
      for (let i = 0; i < 200; i++) {
        flakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 4 + 0.2,
          o: Math.pow(Math.random(), 0.25),
          s: Math.random() + 0.5,
        });
      }

      function draw(flake) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          flake.x,
          flake.y,
          0,
          flake.x,
          flake.y,
          flake.r
        );
        gradient.addColorStop(0, `rgba(255, 255, 255,${flake.o})`);
        gradient.addColorStop(1, `rgba(190, 244, 255,${flake.o})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      let objMouseSide = 0;
      let mouseSide = 0;
      let prevMouseSide = 0;

      window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flakes.forEach((flake) => {
          draw(flake);
          flake.y += 2 * flake.s * (50 / animationSpeed);
          flake.x += mouseSide * flake.s * (50 / animationSpeed);
          if (flake.y > canvas.height) {
            flake.y -= canvas.height;
          }
          if (flake.x > canvas.width) {
            flake.x -= canvas.width;
          }
          if (flake.x < 0) {
            flake.x += canvas.width;
          }
        });
        if (objMouseSide > prevMouseSide) {
          mouseSide += Math.max(5 / animationSpeed, mouseSide - prevMouseSide);
        } else {
          mouseSide -= Math.max(5 / animationSpeed, mouseSide - prevMouseSide);
        }
        prevMouseSide = mouseSide;
      }

      setInterval(animate, 1000 / animationSpeed);

      document.addEventListener("mousemove", (ev) => {
        objMouseSide = (ev.clientX - canvas.width / 2) / 200;
      });
      break;
    }
    case "midnight": {
      const stars = [];
      let flies = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          pos: Math.random() * canvas.width,
          dist: (Math.random() * canvas.width) / 5,
          r: Math.random() * 1 + 3,
          o: Math.pow(Math.random(), 0.5),
          s: Math.random() * 0.5 + 0.2,
        });
      }
      for (let i = 0; i < 50; i++) {
        flies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 4 + 4,
          d: Math.random() * 2 * Math.PI,
          s: Math.random() * 0.5 + 0.2,
          l: Math.random() * 80 + 200,
          c: 0,
        });
      }

      function drawStars(star) {
        ctx.beginPath();
        const y = xToY(star.pos, canvas.width, star.dist);
        ctx.arc(star.pos, y, star.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          star.pos,
          y,
          0,
          star.pos,
          y,
          star.r
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.o})`);
        gradient.addColorStop(0.8, `rgba(190, 244, 255, ${star.o / 1.5})`);
        gradient.addColorStop(1, `rgba(190, 244, 255, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      function drawFlies(fly, age, maxAge) {
        ctx.beginPath();
        ctx.arc(fly.x, fly.y, fly.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          fly.x,
          fly.y,
          0,
          fly.x,
          fly.y,
          fly.r
        );
        gradient.addColorStop(
          0,
          `rgba(255, 230, 120, ${
            age >= maxAge / 3
              ? age >= (maxAge * 2) / 3
                ? (maxAge / 3 - (age - (maxAge * 2) / 3)) / (maxAge / 3)
                : "1"
              : age / (maxAge / 3)
          })`
        );
        gradient.addColorStop(1, `rgba(255, 160, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      function xToY(x, w, d) {
        return -1 * (Math.pow(x - w / 2, 2) / (3 * w)) + w / 3 - d - 200;
      }

      let objMouseSide = 0;
      let mouseSide = 0;
      let prevMouseSide = 0;

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
          star.pos += star.s * mouseSide * (50 / animationSpeed);
          drawStars(star);
          if (star.pos >= canvas.width) {
            star.pos -= canvas.width;
          }
          if (star.pos <= 0) {
            star.pos += canvas.width;
          }
        });
        flies.forEach((fly) => {
          fly.x += Math.cos(fly.d) * fly.s * (50 / animationSpeed);
          fly.y += Math.sin(fly.d) * fly.s * (50 / animationSpeed);
          fly.s += (Math.random() * 0.1 - 0.05) * (50 / animationSpeed);
          fly.c++;
          drawFlies(fly, fly.c, fly.l);
          flies = flies.filter((fly) => {
            if (fly.c >= fly.l) return false;
            return true;
          });
          for (i = 0; i < 50 - flies.length; i++) {
            flies.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              r: Math.random() * 4 + 4,
              d: Math.random() * 2 * Math.PI,
              s: Math.random() * 0.5 + 0.2,
              l: (Math.random() * 80 + 50) * (animationSpeed / 50),
              c: 0,
            });
          }
        });
        if (objMouseSide > prevMouseSide) {
          mouseSide += Math.max(5 / animationSpeed, mouseSide - prevMouseSide);
        } else {
          mouseSide -= Math.max(5 / animationSpeed, mouseSide - prevMouseSide);
        }
        prevMouseSide = mouseSide;
      }

      setInterval(animate, 1000 / animationSpeed);

      document.addEventListener("mousemove", (ev) => {
        objMouseSide = (ev.clientX - canvas.width / 2) / 200;
      });
      break;
    }
    case "aquarium": {
      const bubbles = [];
      for (let i = 0; i < 100; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          w: Math.random() * 2 * Math.PI,
          r: Math.random() * 2 + 5,
          s: Math.random() + 1,
        });
      }
      function drawBubbles(bubble) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "#e8e8e8";
        ctx.fillStyle = "#e8e8e810";
        ctx.stroke();
        ctx.fill();
      }
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach((bubble) => {
          bubble.y -= 2 * (50 / animationSpeed);
          bubble.x += Math.sin(bubble.w) * (35 / animationSpeed);
          bubble.w += 0.02 * (50 / animationSpeed);
          if (bubble.y < 0) {
            bubble.y += canvas.height;
          }
          drawBubbles(bubble);
        });
      }

      setInterval(animate, 1000 / animationSpeed);
      break;
    }
  }
}

loadTheme();
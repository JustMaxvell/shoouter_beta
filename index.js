const gameField = document.querySelector(".game");
const audio = document.querySelector("audio");

class Game {
  constructor() {
    this.waul = "Right";
    this.playerPosition = {};
    this.cursorPosition = {};
    this.l = 0;
    this.h = 0;
    this.angle = 0;
    this.amo = null;
  }

  createPlayer() {
    const player = document.createElement("div");
    player.classList.add("player");
    player.style.top = `${window.innerHeight / 2 - 30}px`;
    player.style.left = `${window.innerWidth / 2 - 30}px`;
    gameField.append(player);
    const playerLabel = document.createElement("div");
    playerLabel.classList.add("playerLabel");
    playerLabel.style.top = `${window.innerHeight / 2 - 30}px`;
    playerLabel.style.left = `${window.innerWidth / 2 - 30}px`;
    gameField.append(playerLabel);
  }

  createLaser() {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.classList.add("inactive");
    laser.style.display = "none";
    gameField.append(laser);
  }

  showLaser() {
    if (laser.className.includes("inactive")) {
      laser.classList.remove("inactive");
      laser.style.display = "block";
      laser.style.top = `${game.playerPosition.y}px`;
      laser.style.left = `${game.playerPosition.x}px`;
      laser.style.width = `${Math.sqrt(
        Math.pow(game.l, 2) + Math.pow(game.h, 2)
      )}px`;
      laser.style.height = `1px`;
      laser.style.transform = `rotate(${game.angle}deg)`;
    } else {
      laser.classList.add("inactive");
      laser.style.display = "none";
    }
  }

  angleSelection() {
    let angle = (Math.atan2(game.h, game.l) / Math.PI) * 180;
    return angle.toFixed(0);
  }

  checkPlayerPisition(angle) {
    player.style.transform = `rotate(${angle}deg)`;
  }

  checkLaserPosition() {
    laser.style.top = `${game.playerPosition.y}px`;
    laser.style.left = `${game.playerPosition.x}px`;
    game.h = game.cursorPosition.y - game.playerPosition.y;
    game.l = game.cursorPosition.x - game.playerPosition.x;
    laser.style.width = `${Math.sqrt(
      Math.pow(game.l, 2) + Math.pow(game.h, 2)
    )}px`;
    game.angle = game.angleSelection();
    laser.style.transform = `rotate(${game.angle}deg)`;
  }

  createReloadingBar() {
    const reloadingBar = document.createElement("div");
    reloadingBar.classList.add("reloadingBar");
    gameField.append(reloadingBar);
  }

  reloading(reloadingBar) {
    reloadingBar.innerHTML = "";
    audio.src = "audio/reloading.mp3";
    audio.play();
    for (let i = 0; i < 7; i++) {
      const amo = document.createElement("div");
      amo.classList.add("amo");
      reloadingBar.append(amo);
      this.amo = 7;
    }
  }

  shot() {
    function createBullet() {
      const bullet = document.createElement("div");
      bullet.classList.add("bullet");
      bullet.style.top = `${game.playerPosition.y - 5}px`;
      bullet.style.left = `${game.playerPosition.x - 5}px`;
      gameField.append(bullet);
      return bullet;
    }

    const bulletPosition = { ...game.playerPosition };
    const start = new Date();
    let tempTime;
    const bulletMoveEngle = this.angle;
    const bulletSpeed = 30;
    let stepX, stepY;

    function toRad(deg) {
      return (deg * Math.PI) / 180;
    }

    function moveBullet(bullet) {
      const intervalId = setInterval(function () {
        tempTime = new Date();
        let diffTime = (tempTime - start) / 1000;
        stepX = bulletSpeed * Math.cos(toRad(bulletMoveEngle)) * diffTime;
        stepY = bulletSpeed * Math.sin(toRad(bulletMoveEngle)) * diffTime;
        bulletPosition.x += stepX;
        bulletPosition.y += stepY;
        bullet.style.left = `${bulletPosition.x}px`;
        bullet.style.top = `${bulletPosition.y}px`;
      }, 10);
      return intervalId;
    }

    function removeBullet(bullet, intevaliD) {
      bullet.remove();
      clearInterval(intevaliD);
    }

    const bullet = createBullet();
    const timer = moveBullet(bullet);
    setTimeout(function () {
      removeBullet(bullet, timer);
    }, 2200);

    this.amo -= 1;
    const allAmo = document.querySelectorAll(".amo");
    allAmo[allAmo.length - 1].remove();
    audio.src = "audio/shot.mp3";
    audio.play();
  }

  createWallWithGates() {
    function getBlockSize() {
      const blockWidth = window.innerWidth / 30;
      const blockHeight = window.innerHeight / 18;
      return [blockWidth, blockHeight];
    }

    const sizes = getBlockSize();
  }

  move(side) {
    game.waul = side;
    let player = document.querySelector(".player");
    if (
      side === "Up" &&
      +player.style.top.substr(0, player.style.top.length - 2) > 0
    ) {
      player.style.top = `${
        +player.style.top.substr(0, player.style.top.length - 2) - 5
      }px`;
      playerLabel.style.top = `${
        +playerLabel.style.top.substr(0, playerLabel.style.top.length - 2) - 5
      }px`;
      this.playerPosition.y -= 5;
    } else if (
      side === "Down" &&
      +player.style.top.substr(0, player.style.top.length - 2) <
        window.innerHeight - 70
    ) {
      player.style.top = `${
        +player.style.top.substr(0, player.style.top.length - 2) + 5
      }px`;
      playerLabel.style.top = `${
        +playerLabel.style.top.substr(0, playerLabel.style.top.length - 2) + 5
      }px`;
      this.playerPosition.y += 5;
    } else if (
      side === "Left" &&
      +player.style.left.substr(0, player.style.left.length - 2) > 0
    ) {
      player.style.left = `${
        +player.style.left.substr(0, player.style.left.length - 2) - 5
      }px`;
      playerLabel.style.left = `${
        +playerLabel.style.left.substr(0, playerLabel.style.left.length - 2) - 5
      }px`;
      this.playerPosition.x -= 5;
    } else if (
      side === "Right" &&
      +player.style.left.substr(0, player.style.left.length - 2) <
        window.innerWidth - 70
    ) {
      player.style.left = `${
        +player.style.left.substr(0, player.style.left.length - 2) + 5
      }px`;
      playerLabel.style.left = `${
        +playerLabel.style.left.substr(0, playerLabel.style.left.length - 2) + 5
      }px`;
      this.playerPosition.x += 5;
    }
  }
}

const game = new Game();

game.createPlayer();
const player = document.querySelector(".player");
const playerLabel = document.querySelector(".playerLabel");
game.createLaser();
const laser = document.querySelector(".laser");
game.createReloadingBar();
const reloadingBar = document.querySelector(".reloadingBar");
game.reloading(reloadingBar);
game.createWallWithGates();

window.onmousemove = (e) => {
  game.playerPosition = {
    x: Math.floor(playerLabel.getBoundingClientRect().x + 30),
    y: Math.floor(playerLabel.getBoundingClientRect().y + 30),
  };

  game.cursorPosition = {
    x: e.pageX,
    y: e.pageY,
  };

  game.checkPlayerPisition(game.angle);
  game.checkLaserPosition();

  window.oncontextmenu = (e) => {
    e.preventDefault();
    game.showLaser();
  };
};

window.onclick = (e) => {
  if (game.amo > 0) {
    game.shot();
  }
};

window.onmousedown = (e) => {
  if (e.which == 2) {
    game.reloading(reloadingBar);
  }
};

window.onkeydown = (e) => {
  let side = e.key.substring(5);
  game.move(side);
  game.checkLaserPosition();
  game.checkPlayerPisition(game.angle);
};

const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const playerHitbox = document.getElementById("player-hitbox");
const scoreDisplay = document.getElementById("score");

let playerPosition = 130; // Posisi awal player
let score = 0;
let obstacles = [];
let gameInterval;
let obstacleInterval;

// Ambil elemen audio
const motorSound = document.getElementById("motor-sound");
const crashSound = document.getElementById("crash-sound");

let isMoving = false; // Untuk mengetahui apakah motor sedang bergerak atau tidak
let touchStartX = 0;  // Posisi awal sentuhan

// Pindahkan player dengan keyboard (untuk desktop)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerPosition > 0) {
    playerPosition -= 20;
    isMoving = true;
  } else if (e.key === "ArrowRight" && playerPosition < 260) {
    playerPosition += 20;
    isMoving = true;
  }

  player.style.left = playerPosition + "px";

  // Mainkan suara motor jika motor sedang bergerak
  if (isMoving && motorSound.paused) {
    motorSound.play(); // Mulai memutar suara motor
  }

  // Jika motor berhenti bergerak, berhenti memutar suara motor
  if (!isMoving && !motorSound.paused) {
    motorSound.pause(); // Hentikan suara motor
  }
});

// Fungsi untuk menangani sentuhan pada layar (untuk perangkat mobile)
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX; // Posisi jari saat mulai menyentuh
  isMoving = true;
  if (motorSound.paused) motorSound.play(); // Mainkan suara motor
}, false);

document.addEventListener("touchmove", (e) => {
  let touchMoveX = e.touches[0].clientX; // Posisi jari saat bergerak

  // Tentukan apakah motor bergerak ke kiri atau kanan berdasarkan perbedaan posisi sentuhan
  if (touchMoveX < touchStartX && playerPosition > 0) {
    playerPosition -= 20; // Geser ke kiri
  } else if (touchMoveX > touchStartX && playerPosition < 260) {
    playerPosition += 20; // Geser ke kanan
  }

  player.style.left = playerPosition + "px"; // Update posisi motor
  touchStartX = touchMoveX; // Update posisi sentuhan untuk pergerakan berikutnya

}, false);

document.addEventListener("touchend", () => {
  isMoving = false;
  motorSound.pause(); // Hentikan suara motor setelah sentuhan berhenti
});

// Buat obstacle baru dengan variasi mobil acak
function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // Pilih jenis mobil secara acak
  const randomCar = Math.floor(Math.random() * 3) + 1;
  obstacle.style.backgroundImage = `url('images/mobil${randomCar}.png')`; // Pastikan gambar berada di folder images
  obstacle.style.left = Math.random() * 260 + "px"; // Posisi horizontal acak
  obstacle.style.top = "-60px"; // Mulai di atas layar
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Cek tabrakan menggunakan hitbox player yang lebih kecil
function checkCollision(playerRect, obstacleRect) {
  return !(
    playerRect.top > obstacleRect.bottom ||
    playerRect.bottom < obstacleRect.top ||
    playerRect.left > obstacleRect.right ||
    playerRect.right < obstacleRect.left
  );
}

// Update game
function updateGame() {
  obstacles.forEach((obstacle, index) => {
    const obstacleTop = parseInt(obstacle.style.top);
    if (obstacleTop > 500) {
      gameContainer.removeChild(obstacle);
      obstacles.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      obstacle.style.top = obstacleTop + 5 + "px";
    }

    // Hitbox player (lebih kecil)
    const playerRect = playerHitbox.getBoundingClientRect(); // Gunakan hitbox untuk cek tabrakan
    const obstacleRect = obstacle.getBoundingClientRect();

    if (checkCollision(playerRect, obstacleRect)) {
      crashSound.play(); // Putar suara tabrakan saat terjadi tabrakan
      endGame();
    }
  });
}

// Fungsi untuk mengakhiri game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  // Arahkan ke halaman game over dengan skor
  window.location.href = `gameover.html?score=${score}`;
}

// Mulai game
function startGame() {
  score = 0;
  playerPosition = 130;
  player.style.left = playerPosition + "px";
  scoreDisplay.textContent = "Score: 0";
  obstacles = [];
  gameInterval = setInterval(updateGame, 30);
  obstacleInterval = setInterval(createObstacle, 1000);
}

// Mulai game saat halaman game dibuka
startGame();

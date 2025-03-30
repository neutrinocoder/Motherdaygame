// ==================================
// === GLOBAL VARIABLE DECLARATIONS ===
// ==================================
// --- Player ---
let player;
let playerSize = 30;
let playerSpeed = 4;
let playerLives = 5; // Added player lives

// --- Weapons ---
let currentWeapon = 'pistol';
let weapons = {
  pistol: { damage: 1, fireRate: 400, bulletSpeed: 7, name: "Pistol" },
  shotgun: { damage: 2, fireRate: 800, bulletSpeed: 6, pellets: 5, spread: 0.5, name: "Shotgun" },
  machinegun: { damage: 0.25, fireRate: 100, bulletSpeed: 8, name: "Machine Gun" }, // Changed machine gun damage
  katana: { damage: 3, fireRate: 300, range: playerSize * 1.8, arc: Math.PI / 2, name: "Katana" }
};
let lastAttackTime = 0;
let isAttacking = false;
let attackVisualEndTime = 0;

// --- Bullets ---
let bullets = [];
let bulletSize = 8;

// --- Enemies ---
let enemies = [];
let enemySize = 25;
let enemyBaseHp = 3;
let enemyMaxSpeed = 1.8;
let enemySpawnRate = 70;

// --- Game State ---
let score = 0;
let gameOver = false;

// ==================================
// === HELPER FUNCTION DEFINITIONS ===
// ==================================

function resetGame() {
  if (player) {
    player.x = width / 2;
    player.y = height / 2;
  } else {
    player = { x: width / 2, y: height / 2 };
  }

  bullets = [];
  enemies = [];
  score = 0;
  enemySpawnRate = 70;
  enemyMaxSpeed = 1.8;
  gameOver = false;
  currentWeapon = 'pistol';
  lastAttackTime = 0;
  isAttacking = false;
  attackVisualEndTime = 0;
  playerLives = 5; // Reset player lives
}

function drawGameOver() {
  fill(255, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(32);
  text(`Final Score: ${score}`, width / 2, height / 2 + 20);
  textSize(24);
  text("Press 'R' to Restart", width / 2, height / 2 + 70);
}

function drawUI() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
  text(`Weapon: ${weapons[currentWeapon].name} [${getWeaponKey(currentWeapon)}]`, 10, 35);
  text(`Lives: ${playerLives}`, 10, 60); // Display player lives
}

function getWeaponKey(weaponName) {
  switch (weaponName) {
    case 'pistol': return '1';
    case 'shotgun': return '2';
    case 'machinegun': return '3';
    case 'katana': return '4';
    default: return '?';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ==========================
// === Input Handling ===
// ==========================

function handleAttackInput() {
  let now = millis();
  let weapon = weapons[currentWeapon];
  let readyToAttack = (now - lastAttackTime > weapon.fireRate);
  let tryingToAttack = mouseIsPressed;

  if (tryingToAttack && readyToAttack) {
    if (currentWeapon === 'katana') { swingKatana(); }
    else if (currentWeapon === 'shotgun') { fireShotgun(); }
    else if (currentWeapon === 'pistol') { firePistol(); }
    else if (currentWeapon === 'machinegun') { fireMachineGun(); }
    lastAttackTime = now;
  }
  if (currentWeapon === 'katana' && isAttacking && now > attackVisualEndTime) {
    isAttacking = false;
  }
}

function keyPressed() {
  if (gameOver && (key === 'r' || key === 'R')) { resetGame(); return; }
  if (!gameOver) {
    if (key === '1') { currentWeapon = 'pistol'; lastAttackTime = 0; }
    else if (key === '2') { currentWeapon = 'shotgun'; lastAttackTime = 0; }
    else if (key === '3') { currentWeapon = 'machinegun'; lastAttackTime = 0; }
    else if (key === '4') { currentWeapon = 'katana'; lastAttackTime = 0; }
  }
}

function handlePlayerMovement() {
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) { player.y -= playerSpeed; }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { player.y += playerSpeed; }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { player.x -= playerSpeed; }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { player.x += playerSpeed; }
  player.x = constrain(player.x, playerSize / 2, width - playerSize / 2);
  player.y = constrain(player.y, playerSize / 2, height - playerSize / 2);
}

// ... (rest of the code remains the same with the changes to player lives and machine gun damage) ...

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (!bullets[i]) continue;
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (!enemies[j]) continue;
      let d = dist(bullets[i].x, bullets[i].y, enemies[j].x, enemies[j].y);
      if (d < bulletSize / 2 + enemySize / 2) {
        enemies[j].hp -= bullets[i].damage;
        bullets.splice(i, 1);
        break;
      }
    }
  }

  let killedThisFrame = 0;
  for (let j = enemies.length - 1; j >= 0; j--) {
    if (enemies[j] && enemies[j].hp <= 0) {
      score += enemies[j].points;
      killedThisFrame++;
      enemies.splice(j, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (!enemies[i]) continue;
    let d = dist(player.x, player.y, enemies[i].x, enemies[i].y);
    if (d < playerSize / 2 + enemySize / 2) {
      playerLives--; // Decrease player lives
      enemies.splice(i,1);
      if (playerLives <= 0) {
        gameOver = true; break;
      }
    }
  }
}

// ... (setup and draw functions) ...

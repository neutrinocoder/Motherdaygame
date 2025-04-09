 // ==================================

// === GLOBAL VARIABLE DECLARATIONS ===

// ==================================

// --- Game State ---

// Added 'CHOICE', 'GENERAL_STORE' states

let gameState = 'RUNNING'; // RUNNING, LEVEL_COMPLETE, CHOICE, STORE, GENERAL_STORE, PAUSED, GAME_OVER

let level = 1;
let score = 0;
let scoreNeededForLevel = 10;
let gameOver = false;
let isPaused = false;
// --- Command System ---
let isCommandMode = false;  // Are we currently typing a command?
let currentCommand = "";    // The command string being typed


// --- Player ---

let player;
let playerSize = 100;
let playerHitboxSize = 40;
let playerSpeed = 4;
const STARTING_LIVES = 5;
let playerLives = STARTING_LIVES;      // Current lives
let maxPlayerLives = STARTING_LIVES; // *** NEW: Tracks maximum lives ***
let playerImage;
let playerCoins = 0;

let hasExtraLife = false;
let hasPiercingShots = false;
let hasCoinMagnet = false;
let hasEnemyExplosion = false;
let hasVampirism = false;
const COIN_MAGNET_RANGE = 150;     // Range for coin magnet effect
const COIN_MAGNET_STRENGTH = 1.5;  // How fast coins move towards player
const EXPLOSION_RADIUS = 50;     // Radius for enemy explosions
const EXPLOSION_DAMAGE = 1;      // Damage dealt by explosion
const VAMPIRISM_CHANCE = 0.10;   // 10% chance for vampirism 
const HP_THRESHOLD = 0.01;
// --- Weapons ---

let currentWeapon = 'pistol';

let weapons = {

  // Base stats and maxLevel added for all weapons

  pistol:     { name: "Pistol",      damage: 1,    baseDamage: 1,    fireRate: 400, baseFireRate: 400, bulletSpeed: 7, pellets: 1, basePellets: 1,                                            maxLevel: 5 },

  shotgun:    { name: "Shotgun",     damage: 2,    baseDamage: 2,    fireRate: 800, baseFireRate: 800, bulletSpeed: 6, pellets: 5, basePellets: 5, spread: 0.5,                             maxLevel: 5 },

  machinegun: { name: "Machine Gun", damage: 0.25, baseDamage: 0.25, fireRate: 100, baseFireRate: 100, bulletSpeed: 8, pellets: 1, basePellets: 1,                                            maxLevel: 5 },

  katana:     { name: "Katana",      damage: 3,    baseDamage: 3,    fireRate: 300, baseFireRate: 300, rangeMultiplier: 1.8, baseRangeMultiplier: 1.8, arc: Math.PI / 2, baseArc: Math.PI / 2, maxLevel: 5 }

};

let lastAttackTime = 0;

let isAttacking = false;

let attackVisualEndTime = 0;



// --- Store & Upgrades ---

// Weapon upgrade levels

let upgradesBought = { pistol: 0, shotgun: 0, machinegun: 0, katana: 0 };

// Weapon upgrade costs

const PISTOL_BASE_COST = 10;     const PISTOL_COST_INCREASE = 10;

const MACHINEGUN_BASE_COST = 10; const MACHINEGUN_COST_INCREASE = 10;

const SHOTGUN_BASE_COST = 10;    const SHOTGUN_COST_INCREASE = 10; const SHOTGUN_LVL5_COST = 40;

const KATANA_BASE_COST = 10;     const KATANA_COST_INCREASE = 10;



// --- General Upgrades ---

// Structure to define general upgrades

const generalUpgradeDefinitions = {
    // --- Existing Upgrades ---
    'half_price':     { name: "Discount",       desc: "All future upgrades cost 50% less",         cost: 30, purchased: false },
    'power_surge':    { name: "Power Surge",    desc: "All weapon damage x1.5",                    cost: 60, purchased: false },
    'rate_surge':     { name: "Rate Surge",     desc: "All weapon fire rates x1.5",                cost: 60, purchased: false },
    'double_coins':   { name: "Coin Doubler",   desc: "Gain 2 coins per pickup instead of 1",      cost: 70, purchased: false },
    'homing_lite':    { name: "Homing Lite",    desc: "Bullets gently curve towards enemies",      cost: 80, purchased: false },
    'spawn_children': { name: "Spawn Children", desc: "Spawn allied pistol units (1 life)",        cost: 100, purchased: false },
    'spawn_dad':      { name: "Spawn Dad",      desc: "Faster children spawn, random weapon",      cost: 100, purchased: false, requires: 'spawn_children' },
    // --- NEW UPGRADES ---
    'extra_life':     { name: "Extra Life",     desc: "Gain 1 extra maximum life.",                cost: 80, purchased: false },
    'piercing_shots': { name: "Piercing Shots", desc: "Your bullets pierce through 1 enemy.",      cost: 90, purchased: false },
    'coin_magnet':    { name: "Coin Magnet",    desc: "Coins slowly drift towards you.",           cost: 50, purchased: false },
    'enemy_explosion':{ name: "Enemy Explosion",desc: "Defeated enemies explode (deals 1 dmg).",   cost: 110, purchased: false },
    'vampirism_lite': { name: "Vampirism Lite", desc: `Restore 1 HP on enemy defeat (${VAMPIRISM_CHANCE * 100}% chance).`,  cost: 150, purchased: false },
};

// Array to hold the keys of the 5 currently offered general upgrades

let offeredGeneralUpgrades = [];

// Flags/multipliers for persistent general upgrade effects

let generalDamageMultiplier = 1.0; // Multiplier for player damage output

let generalFireRateMultiplier = 1.0; // Divisor for player fire rate delay

let hasHalfPrice = false; // Tracks if discount is active

let hasDoubleCoins = false; // Tracks if coin doubler is active

let hasHomingBullets = false; // Tracks if homing is active

let hasSpawnChildren = false; // Tracks if children should spawn

let hasSpawnDad = false; // Tracks if dad upgrade is active





// --- Bullets ---

let bullets = [];

let bulletSize = 8;



// --- Enemies ---

let enemies = [];

let enemySize = 20; // Hitbox size

const ENEMY_VISUAL_SIZE_MULTIPLIER = 25; // Visual multiplier for Red enemies

let enemyBaseMaxSpeed = 1.8;

let enemyBaseSpawnRate = 70;

let enemyMaxSpeed = enemyBaseMaxSpeed;

let enemySpawnRate = enemyBaseSpawnRate;

let healthBarWidth = 30;

let healthBarHeight = 5;

let redEnemyImage;



// --- Children (Allies) --- NEW

let children = [];

let lastChildSpawnTime = 0;

const CHILD_BASE_SPAWN_INTERVAL = 5000; // 5 seconds in ms

const CHILD_DAD_SPAWN_INTERVAL = 3000; // 3 seconds in ms

const CHILD_HITBOX_SIZE = 30;

const CHILD_VISUAL_SIZE = 60; // Visual size

const CHILD_SPEED = 2.5;

const CHILD_LIFE = 1; // Children have 1 life



// --- Pickups / Items ---

let droppedCoins = [];

let coinSize = 10;

const COIN_LIFETIME = 4000;



// --- UI Messages & Elements ---

let temporaryMessage = "";

let messageEndTime = 0;

// Coordinates/dimensions for choice buttons (calculated dynamically in drawChoiceScreen)

let choiceButtonWidth = 300;

let choiceButtonHeight = 80;

let choiceButtonWeaponX, choiceButtonWeaponY;

let choiceButtonGeneralX, choiceButtonGeneralY;



// === END GLOBAL VARIABLE DECLARATIONS ===



// ==================================

// === P5.JS PRELOAD FUNCTION ===

// ==================================

function preload() {

  try {

    playerImage = loadImage('pixilart-drawing.png');

    redEnemyImage = loadImage('pixilart-drawing (2).png');

  } catch (error) {

      console.error("Error loading images in preload:", error);

  }

} // End preload



// ==================================

// === HELPER FUNCTION DEFINITIONS ===

// ==================================
// === NEW FUNCTION: Removes enemies with HP <= 0 ===
function removeDeadEnemies() {
    // Iterate backwards for safe removal
    for (let i = enemies.length - 1; i >= 0; i--) {
        // *** Use the HP_THRESHOLD for removal check ***
        if (enemies[i].hp <= HP_THRESHOLD) {
            // console.log(`Cleanup: Removing Enemy[${i}]...`); // Optional log
            enemies.splice(i, 1); // Remove the enemy
        }
    }
} // End removeDeadEnemies
// === NEW FUNCTION: Handles effects when an enemy is defeated ===
function handleEnemyDefeat(enemy, killerSource = 'unknown') {
    // Safety check: ensure enemy object is valid and actually defeated
    if (!enemy || enemy.hp > HP_THRESHOLD) {
        // console.log(`handleEnemyDefeat called on non-defeated enemy? HP: ${enemy?.hp}`); // Optional Debug
        return;
    }

    console.log(`--- Handling Defeat for Enemy Type: ${enemy.type} ---`);

    // --- Store info needed BEFORE potential modifications ---
    let defeatedX = enemy.x;
    let defeatedY = enemy.y;
    let pointsAwarded = enemy.points;
    let coinsToDrop = enemy.coinDrop;

    // --- Trigger On-Defeat Effects ---

    // Vampirism (only if killed by player)
    if (hasVampirism && killerSource === 'player') {
        if (random() < VAMPIRISM_CHANCE) {
            if (playerLives < maxPlayerLives) {
                playerLives++;
                console.log("   Vampirism triggered! HP:", playerLives);
                showTemporaryMessage("+1 HP!", 500);
            }
        }
    }

    // Score & Coins (check values are valid)
    console.log(`   Attempting Rewards. Points: ${pointsAwarded}, BaseCoins: ${coinsToDrop}, CurrentScore: ${score}`);
    if (typeof pointsAwarded === 'number' && typeof coinsToDrop === 'number' && typeof score === 'number') {
        score += pointsAwarded; // SCORE INCREASE
        console.log(`       -> Score updated to: ${score}`);

        if (hasDoubleCoins) { coinsToDrop *= 2; } // Apply doubler

        console.log(`       Attempting to drop ${coinsToDrop} coins.`);
        let initialCoinCount = droppedCoins.length;
        for (let k = 0; k < coinsToDrop; k++) { // COIN DROP
            let coinX = defeatedX + random(-enemySize / 3, enemySize / 3);
            let coinY = defeatedY + random(-enemySize / 3, enemySize / 3);
            if (typeof coinX === 'number' && typeof coinY === 'number') {
                droppedCoins.push({ x: coinX, y: coinY, creationTime: millis() });
            } else {
                console.error(`!!! Coin Creation Error: Invalid coords! x: ${coinX}, y: ${coinY}.`);
            }
        }
        console.log(`       Coins added: ${droppedCoins.length - initialCoinCount}. Total Coins on map: ${droppedCoins.length}`);
    } else {
        console.error(`   !!! REWARD ERROR: Invalid values! points:${pointsAwarded}, coins:${coinsToDrop}, score:${score}`);
    }

    // Explosion (check nearby enemies)
    if (hasEnemyExplosion) {
        // console.log(`   Checking for explosion victims around (${defeatedX.toFixed(0)}, ${defeatedY.toFixed(0)})`);
        for (let k = enemies.length - 1; k >= 0; k--) {
            // Check if target 'k' exists AND is not the enemy that just died (check reference)
            if (!enemies[k] || enemies[k] === enemy) { continue; }
            let otherEnemy = enemies[k];
            // Check if the other enemy is alive before applying explosion damage
            if (otherEnemy.hp > HP_THRESHOLD) {
                let distExplosion = dist(defeatedX, defeatedY, otherEnemy.x, otherEnemy.y);
                if (distExplosion < EXPLOSION_RADIUS + otherEnemy.visualSize / 2) {
                    // console.log(`   Explosion damaging Enemy[${k}]`);
                    otherEnemy.hp -= EXPLOSION_DAMAGE;
                    // Killed enemies are removed later by removeDeadEnemies
                }
            }
        }
    } // End Explosion

    console.log(`--- Finished Handling Defeat for Enemy Type: ${enemy.type} ---`);

    // NOTE: Enemy removal (splice) is handled by removeDeadEnemies(), not here.
} // End handleEnemyDefeat

// --- Executes Commands Entered by the Player ---
// --- Executes Commands Entered by the Player ---
// --- ADD THIS HELPER FUNCTION (Needed for /give all) ---
// Function to apply maximum upgrades to a weapon stats directly
function applyMaxWeaponStats(weaponKey) {
    let w = weapons[weaponKey];
    if (!w || !w.maxLevel) return; // Exit if weapon invalid or has no levels

    // Reset to base stats first before applying max level effects
    // Ensures we are calculating from a clean slate
    if (w.baseDamage !== undefined) w.damage = w.baseDamage;
    if (w.baseFireRate !== undefined) w.fireRate = w.baseFireRate;
    if (w.basePellets !== undefined) w.pellets = w.basePellets;
    if (w.baseRangeMultiplier !== undefined) w.rangeMultiplier = w.baseRangeMultiplier;
    if (w.baseArc !== undefined) w.arc = w.baseArc;

    let minFireRate = 50; // Default minimum fire rate
    if (weaponKey === 'machinegun') minFireRate = 20;

    // --- Apply cumulative effects based on maxLevel ---
    // !!! IMPORTANT: This logic MUST exactly match the cumulative effects from buyUpgrade !!!
    // If you change buyUpgrade, you MUST update this section too.
     if (weaponKey === 'pistol') {
         if (w.maxLevel >= 1) w.damage += 1;
         if (w.maxLevel >= 2) w.fireRate /= 1.25;
         if (w.maxLevel >= 3) w.damage += 0.25;
         if (w.maxLevel >= 4) w.fireRate /= 1.30;
         if (w.maxLevel >= 5) w.fireRate /= 1.30; // Assuming level 5 effect applies on top of level 4
     }
     else if (weaponKey === 'machinegun') {
         if (w.maxLevel >= 1) w.damage += 0.25;
         if (w.maxLevel >= 2) w.fireRate /= 1.25;
         if (w.maxLevel >= 3) w.damage += 0.5;
         if (w.maxLevel >= 4) w.fireRate /= 1.5;
         if (w.maxLevel >= 5) w.damage += 1.5;
     }
     else if (weaponKey === 'shotgun') {
         if (w.maxLevel >= 1) w.fireRate /= 1.2;
         if (w.maxLevel >= 2) w.damage += 0.5;
         if (w.maxLevel >= 3) w.pellets += 1;
         if (w.maxLevel >= 4) w.fireRate /= 1.5;
         if (w.maxLevel >= 5) { w.damage += 1; w.pellets += 2; } // Level 5 adds damage AND pellets
     }
      else if (weaponKey === 'katana') {
         if (w.maxLevel >= 1) w.damage += 1;
         if (w.maxLevel >= 2) w.fireRate /= 1.2; // Swing speed increases (delay decreases)
         if (w.maxLevel >= 3) w.rangeMultiplier *= 1.15;
         if (w.maxLevel >= 4) w.arc *= 1.2;
         if (w.maxLevel >= 5) { w.damage += 2; w.fireRate /= 1.2; } // Level 5 adds damage AND speed again
     }
    // --- End Apply cumulative effects ---

    // Apply constraints/rounding after all level effects are summed
    if (w.fireRate !== undefined) w.fireRate = Math.round(Math.max(minFireRate, w.fireRate));
    if (w.rangeMultiplier !== undefined) w.rangeMultiplier = Number(w.rangeMultiplier.toFixed(2));
    if (w.arc !== undefined) w.arc = Number(w.arc.toFixed(2)); // Keep arc reasonable precision
    if (w.damage !== undefined) w.damage = Number(w.damage.toFixed(2)); // Keep damage reasonable precision
    if (w.pellets !== undefined) w.pellets = Math.round(w.pellets); // Pellets should be integers


    console.log(`Applied max stats for ${weaponKey}: Dmg=${w.damage}, Rate=${w.fireRate}, Pellets=${w.pellets}, Range=${w.rangeMultiplier}, Arc=${w.arc}`);

} // End applyMaxWeaponStats
function executeCommand(command) {
    let cmd = command.trim().toLowerCase(); // Normalize command

    if (cmd === "give all") {
        // (Code for /give all remains the same)
        console.log("Executing '/give all'...");
        for (let weaponKey in upgradesBought) {
             if (weapons[weaponKey] && weapons[weaponKey].maxLevel) {
                  upgradesBought[weaponKey] = weapons[weaponKey].maxLevel;
                  applyMaxWeaponStats(weaponKey);
             }
        }
        for (let key in generalUpgradeDefinitions) { /* ... grant general upgrades ... */
             let upgradeData = generalUpgradeDefinitions[key];
             if (!upgradeData.purchased) {
                  upgradeData.purchased = true;
                  switch(key) {
                       case 'half_price':   hasHalfPrice = true; break;
                       case 'power_surge':  generalDamageMultiplier = 1.5; break;
                       case 'rate_surge':   generalFireRateMultiplier = 1.5; break;
                       case 'double_coins': hasDoubleCoins = true; break;
                       case 'homing_lite':  hasHomingBullets = true; break;
                       case 'spawn_children': hasSpawnChildren = true; if(lastChildSpawnTime === 0) lastChildSpawnTime = millis(); break;
                       case 'spawn_dad':    hasSpawnDad = true; break;
                  }
                  console.log(`Granted general upgrade: ${key}`);
             }
        }
        if (!hasSpawnChildren) {
             hasSpawnDad = false;
             if(generalUpgradeDefinitions['spawn_dad']) generalUpgradeDefinitions['spawn_dad'].purchased = false;
        }
        showTemporaryMessage("/give all Applied!", 3000);


    } else if (cmd === "baddy all") {
        console.log("Executing '/baddy all'...");

        // ***** NEW: Set the target level to 7 *****
        let targetLevel = 7;
        if (level < targetLevel) {
             level = targetLevel; // Set the actual game level
             console.log(`Level set to ${level}.`);
        } else {
             // If already level 7 or higher, still recalculate difficulty for level 7
             console.log(`Level is ${level} (already >= ${targetLevel}). Recalculating difficulty for Lvl 7.`);
             // Optional: you could choose *not* to lower difficulty if the player is already past level 7.
             // If you want it to always set difficulty to Lvl 7 standard, keep the calculations below.
        }

        // --- Recalculate difficulty metrics ---
        // *** Calculate enemyMaxSpeed based on the NEW target level (7) ***
        let levelForCalc = 7; // Use the target level for consistency
        enemyMaxSpeed = enemyBaseMaxSpeed * (1 + (levelForCalc - 1) * 0.06);
        console.log(`Enemy Max Speed calculated for Level ${levelForCalc}: ${enemyMaxSpeed.toFixed(2)}`);

        // *** Calculate enemySpawnRate based on the NEW target level (7) ***
        enemySpawnRate = max(15, enemyBaseSpawnRate * (1 - (levelForCalc - 1) * 0.09));
        console.log(`Enemy Spawn Rate calculated for Level ${levelForCalc}: ${enemySpawnRate.toFixed(2)}`);

        // Update score needed for the *actual* current level and reset current score
        scoreNeededForLevel = level * 10; // Uses the actual level (which is now 7 or higher)
        score = 0;

        showTemporaryMessage(`Level set to ${level}, Difficulty @ Lvl 7!`, 3000);

    } else {
        console.log("Unknown command:", command);
        showTemporaryMessage("Unknown command: " + command, 3000);
    }
} // End executeCommand

// --- Fully Resets Game State ---

// --- Fully Resets Game State ---
function resetGame() {
    // ... (reset gameState, level, score, player position, etc.) ...

    playerLives = STARTING_LIVES;
    maxPlayerLives = STARTING_LIVES; // *** Reset max lives ***
    playerCoins = 0;
    bullets = [];
    enemies = [];
    droppedCoins = [];
    children = [];
    gameOver = false;
    isPaused = false;

    // Reset All Weapon Stats
    // ... (loop through weapons, reset stats) ...

    // Reset All Weapon Upgrade Levels
    for (let key in upgradesBought) {
        upgradesBought[key] = 0;
    }

    // Reset General Upgrade Purchased Status
    for (let key in generalUpgradeDefinitions) {
        generalUpgradeDefinitions[key].purchased = false;
    }
    // Reset General Upgrade Effect Flags/Multipliers
    generalDamageMultiplier = 1.0;
    generalFireRateMultiplier = 1.0;
    hasHalfPrice = false;
    hasDoubleCoins = false;
    hasHomingBullets = false;
    hasSpawnChildren = false;
    hasSpawnDad = false;
    lastChildSpawnTime = 0;
    // --- *** Reset NEW Flags *** ---
    hasExtraLife = false;
    hasPiercingShots = false;
    hasCoinMagnet = false;
    hasEnemyExplosion = false;
    hasVampirism = false;
    // --- End Reset NEW Flags ---

    offeredGeneralUpgrades = []; // Clear offered upgrades

    // Reset Difficulty Scaling
    enemyMaxSpeed = enemyBaseMaxSpeed;
    enemySpawnRate = enemyBaseSpawnRate;

    // Reset Player Action State
    currentWeapon = 'pistol';
    lastAttackTime = 0;
    isAttacking = false;
    attackVisualEndTime = 0;
    temporaryMessage = "";
    messageEndTime = 0;

    // Reset Command State
    isCommandMode = false;
    currentCommand = "";

    console.log("Game Reset");
} // End resetGame



// --- Clears Enemies, Bullets, Coins ---

function clearLevelEntities() {

    enemies = [];

    bullets = [];

    droppedCoins = [];

    children = []; // Also clear children between levels

    console.log("Level Entities Cleared");

} // End clearLevelEntities



// --- Sets/Draws Temporary UI Messages ---

function showTemporaryMessage(msg, duration = 2000) {

    temporaryMessage = msg;

    messageEndTime = millis() + duration;

} // End showTemporaryMessage

function drawTemporaryMessage() {

    if (temporaryMessage && millis() < messageEndTime) {

        fill(255, 255, 0); // Yellow

        textSize(24);

        textAlign(CENTER, BOTTOM);

        text(temporaryMessage, width / 2, height - 30);

    } else if (temporaryMessage && millis() >= messageEndTime) {

        temporaryMessage = ""; // Clear expired message

    }

} // End drawTemporaryMessage



// --- Draws Level Complete Screen (Might be skipped for CHOICE state now) ---

function drawLevelCompleteScreen() {

    fill(0, 0, 100, 190); // Dark blue overlay

    rectMode(CORNER);

    rect(0, 0, width, height);



    fill(255);

    textAlign(CENTER, CENTER);

    textSize(52);

    text(`Level ${level} Complete!`, width / 2, height * 0.3);

    textSize(32);

    text(`Score: ${score}`, width / 2, height * 0.45);

    text(`Coins: ${playerCoins} 🪙`, width / 2, height * 0.55);

    textSize(28);

    // This text might not be seen if we transition straight to CHOICE

    text("Processing...", width / 2, height * 0.75);

} // End drawLevelCompleteScreen





// --- Draws the Upgrade Choice Screen --- NEW

function drawChoiceScreen() {

    fill(0, 50, 100, 210); // Semi-transparent dark blue overlay

    rectMode(CORNER);

    rect(0, 0, width, height);



    fill(255);

    textAlign(CENTER, CENTER);

    textSize(52);

    text(`Level ${level} Complete!`, width / 2, height * 0.2); // Show level just finished

    textSize(40);

    text("Choose Upgrade Type", width / 2, height * 0.35);



    // Calculate button positions (centered horizontally)

    choiceButtonWeaponX = width / 2 - choiceButtonWidth / 2;

    choiceButtonWeaponY = height * 0.5 - choiceButtonHeight / 2;

    choiceButtonGeneralX = width / 2 - choiceButtonWidth / 2;

    choiceButtonGeneralY = height * 0.7 - choiceButtonHeight / 2;



    // Draw "Weapon Upgrades" Button Area

    // Add hover effect? (Optional)

    fill(0, 100, 0, 200); // Dark green background

    rect(choiceButtonWeaponX, choiceButtonWeaponY, choiceButtonWidth, choiceButtonHeight, 10); // Rounded corners

    fill(255);

    textSize(32);

    text("Weapon Upgrades", choiceButtonWeaponX + choiceButtonWidth / 2, choiceButtonWeaponY + choiceButtonHeight / 2);



    // Draw "General Upgrades" Button Area

    fill(100, 100, 0, 200); // Dark yellow background

    rect(choiceButtonGeneralX, choiceButtonGeneralY, choiceButtonWidth, choiceButtonHeight, 10); // Rounded corners

    fill(255);

    textSize(32);

    text("General Upgrades", choiceButtonGeneralX + choiceButtonWidth / 2, choiceButtonGeneralY + choiceButtonHeight / 2);

} // End drawChoiceScreen



// --- Calculates Weapon Upgrade Costs ---

function getPistolUpgradeCost(currentLevel) { return PISTOL_BASE_COST + (currentLevel * PISTOL_COST_INCREASE); }

function getMachineGunUpgradeCost(currentLevel) { return MACHINEGUN_BASE_COST + (currentLevel * MACHINEGUN_COST_INCREASE); }

function getShotgunUpgradeCost(currentLevel) {

    let levelBeingBought = currentLevel + 1;

    if (levelBeingBought === 5) return SHOTGUN_LVL5_COST;

    else return SHOTGUN_BASE_COST + (currentLevel * SHOTGUN_COST_INCREASE);

}

function getKatanaUpgradeCost(currentLevel) { return KATANA_BASE_COST + (currentLevel * KATANA_COST_INCREASE); }



// --- Draws the Weapon Upgrade Store Screen --- (Renamed comment for clarity)

// --- Draws the Weapon Upgrade Store Screen --- (Renamed comment for clarity)
function drawStoreScreen() {
    fill(20, 20, 20, 230); rectMode(CORNER); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, TOP); textSize(52); text("Weapon Upgrade Store", width / 2, 60); // Title Changed
    textSize(32); text(`Your Coins: ${playerCoins} 🪙`, width / 2, 140); // Simple template literal okay here

    textAlign(LEFT, TOP); let startY = 220; let lineH = 60;
    let startX = width * 0.2; let optionWidth = width * 0.6; textSize(22);

    // Helper to draw each weapon upgrade option
    const drawOption = (key, textKey, upgradeKey) => {
        let optionText = ""; let currentFill = color(255); let cost = 0;
        let weaponData = weapons[upgradeKey];
        if (!weaponData) { /* Error handling */ return; } // Should not happen

        let isMultiLevel = weaponData.maxLevel > 0;
        if (isMultiLevel) {
            let currentLevel = upgradesBought[upgradeKey]; let maxLevel = weaponData.maxLevel;
            let costFunction = null;
            switch(upgradeKey) { /* Select cost function */
                case 'pistol': costFunction = getPistolUpgradeCost; break;
                case 'machinegun': costFunction = getMachineGunUpgradeCost; break;
                case 'shotgun': costFunction = getShotgunUpgradeCost; break;
                case 'katana': costFunction = getKatanaUpgradeCost; break;
            }

            if (currentLevel >= maxLevel) { /* MAX level text */
                 // ***** FIXED THIS LINE *****
                optionText = "[" + textKey + "] " + weaponData.name + " Upgrades (MAX)";
                currentFill = color(120);
            } else if (costFunction) {
                let baseCost = costFunction(currentLevel); // Get base cost
                // Apply discount for display
                let displayCost = baseCost;
                if (hasHalfPrice) { displayCost = Math.ceil(baseCost / 2); }

                let description = getUpgradeDescription(upgradeKey);
                // ***** FIXED THIS LINE *****
                optionText = "[" + textKey + "] " + description + " (" + displayCost + " Coins) - Lvl " + currentLevel + "/" + maxLevel;

                 // Check affordability against the potentially discounted display cost
                if (playerCoins < displayCost) currentFill = color(255, 80, 80);
            } else { /* Error handling */ }
        } else { /* Single purchase logic - currently none */ }

        fill(currentFill); text(optionText, startX, startY, optionWidth); startY += lineH;
    }; // End drawOption helper

    // Draw the weapon upgrade options
    drawOption('1', '1', 'pistol');
    drawOption('2', '2', 'machinegun'); // Ensure 'machinegun' key is correct if you used '3' in UI before
    drawOption('3', '3', 'shotgun');   // Ensure 'shotgun' key is correct if you used '2' in UI before
    drawOption('4', '4', 'katana');

    fill(255); textAlign(CENTER, BOTTOM); textSize(28);
    text(`Press SPACEBAR to Start Level ${level + 1}`, width / 2, height - 60); // Okay here
} // End drawStoreScreenwa



// --- Generates 5 Random, Unpurchased General Upgrades --- NEW

function generateOfferedUpgrades() {

    offeredGeneralUpgrades = []; // Clear previous offers

    const availableUpgradeKeys = [];



    // Find all defined upgrades that haven't been purchased yet

    for (const key in generalUpgradeDefinitions) {

        if (!generalUpgradeDefinitions[key].purchased) {

            // Special check for 'spawn_dad' dependency

            if (key === 'spawn_dad') {

                // Only offer 'spawn_dad' if 'spawn_children' IS purchased

                if (generalUpgradeDefinitions['spawn_children']?.purchased) {

                    availableUpgradeKeys.push(key);

                }

            } else {

                availableUpgradeKeys.push(key); // Add other available upgrades

            }

        }

    }



    // Shuffle the available upgrades using Fisher-Yates algorithm

    for (let i = availableUpgradeKeys.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [availableUpgradeKeys[i], availableUpgradeKeys[j]] = [availableUpgradeKeys[j], availableUpgradeKeys[i]]; // Swap

    }



    // Offer up to 5 upgrades

    offeredGeneralUpgrades = availableUpgradeKeys.slice(0, 5);

    console.log("Offered General Upgrades:", offeredGeneralUpgrades); // Debug log

} // End generateOfferedUpgrades





// --- Draws the General Upgrade Store Screen --- NEW

// --- Draws the General Upgrade Store Screen --- NEW
function drawGeneralStoreScreen() {
    fill(20, 20, 20, 230); // Very dark overlay
    rectMode(CORNER);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, TOP);
    textSize(52);
    text("General Upgrades", width / 2, 60);
    textSize(32);
    text(`Your Coins: ${playerCoins} 🪙`, width / 2, 140); // Okay here

    // Display Offered Upgrade Options
    textAlign(LEFT, TOP);
    let startY = 220;
    let lineH = 70; // Increased spacing for description
    let startX = width * 0.15; // Adjust position
    let optionWidth = width * 0.7; // Width for text wrapping
    textSize(22);

    if (offeredGeneralUpgrades.length === 0) {
        fill(200);
        textAlign(CENTER, CENTER);
        textSize(28);
        text("No more general upgrades available!", width / 2, height / 2);
    } else {
        for (let i = 0; i < offeredGeneralUpgrades.length; i++) {
            let upgradeKey = offeredGeneralUpgrades[i];
            let upgradeData = generalUpgradeDefinitions[upgradeKey];
            let displayNum = i + 1; // Number keys 1-5

            if (!upgradeData) continue; // Skip if data somehow missing

            // Calculate display cost, applying discount if active
            let displayCost = upgradeData.cost;
            if (hasHalfPrice) {
                displayCost = Math.ceil(displayCost / 2); // Apply 50% discount, round up
            }

            // Format the text with description on a new line
            // ***** FIXED THIS LINE *****
            let optionText = "[" + displayNum + "] " + upgradeData.name + " (" + displayCost + " Coins)\n    " + upgradeData.desc;
            let currentFill = color(255); // Default white

            // Check affordability against the display cost
            if (playerCoins < displayCost) {
                currentFill = color(255, 80, 80); // Reddish if cannot afford
            }

            fill(currentFill);
            text(optionText, startX, startY, optionWidth); // Use width for potential wrapping
            startY += lineH;
        }
    }

    // Exit / Continue instruction
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(28);
    text(`Press SPACEBAR to Start Level ${level + 1}`, width / 2, height - 60); // Okay here
} // End drawGeneralStoreScreena





// --- Gets description for an upgrade (Weapon or General) ---

// Modified to include General upgrade descriptions briefly

function getUpgradeDescription(upgradeKey) {

    // Check if it's a weapon upgrade

    let weaponData = weapons[upgradeKey];

    if (weaponData) {

        let isMultiLevel = weaponData.maxLevel > 0;

        if (isMultiLevel) {

            let currentLevel = upgradesBought[upgradeKey];

            let nextLevel = currentLevel + 1;

            let name = weaponData.name;

            if (currentLevel >= weaponData.maxLevel) return `${name} (MAX LEVEL)`;



            // Weapon-specific descriptions

            if (upgradeKey === 'pistol') { /* Pistol */ switch(nextLevel) { case 1: return `Pistol Lvl 1: Damage +1`; case 2: return `Pistol Lvl 2: Fire Rate x1.25`; case 3: return `Pistol Lvl 3: Damage +0.25`; case 4: return `Pistol Lvl 4: Fire Rate x1.30`; case 5: return `Pistol Lvl 5: Fire Rate x1.30`; } }

            else if (upgradeKey === 'machinegun') { /* MG */ switch(nextLevel) { case 1: return `MG Lvl 1: Damage +0.25`; case 2: return `MG Lvl 2: Fire Rate x1.25`; case 3: return `MG Lvl 3: Damage +0.5`; case 4: return `MG Lvl 4: Fire Rate x1.5`; case 5: return `MG Lvl 5: Damage +1.5`; } }

            else if (upgradeKey === 'shotgun') { /* Shotgun */ switch(nextLevel) { case 1: return `Shotgun Lvl 1: Fire Rate x1.2`; case 2: return `Shotgun Lvl 2: Damage +0.5`; case 3: return `Shotgun Lvl 3: Pellets +1`; case 4: return `Shotgun Lvl 4: Fire Rate x1.5`; case 5: return `Shotgun Lvl 5: Dmg +1, Pellets +2`; } }

            else if (upgradeKey === 'katana') { /* Katana */ switch(nextLevel) { case 1: return `Katana Lvl 1: Damage +1`; case 2: return `Katana Lvl 2: Swing Speed x1.2`; case 3: return `Katana Lvl 3: Range x1.15`; case 4: return `Katana Lvl 4: Arc x1.2`; case 5: return `Katana Lvl 5: Dmg +2, Speed x1.2`; } }

            return `${name} Lvl ${nextLevel}: Unknown Effect`; // Fallback

        } else { /* Handle single-purchase weapon upgrades if needed */ }

    }



    // Check if it's a general upgrade (return short name for now, full desc is in store)

    let generalData = generalUpgradeDefinitions[upgradeKey];

    if (generalData) {

        return generalData.name; // Store screen shows full desc

    }



    return "Unknown Upgrade Description"; // Ultimate fallback

} // End getUpgradeDescription



// --- Handles buying a WEAPON upgrade ---

// Updated to apply discount

function buyUpgrade(type) {

    let cost = 0; let message = ""; let upgradeTargetLevel = 0;

    let weaponData = weapons[type];

    if (!weaponData) { console.error(`Attempted buy for unknown weapon type: ${type}`); return; }

    let isMultiLevel = weaponData.maxLevel > 0;



    if (isMultiLevel) {

        let currentLevel = upgradesBought[type]; let maxLevel = weaponData.maxLevel;

        if (currentLevel >= maxLevel) { showTemporaryMessage(`${weaponData.name} already at Max Level!`); return; }



        let costFunction = null; // Determine cost function

        switch(type) { /* ... select cost function ... */

             case 'pistol': costFunction = getPistolUpgradeCost; break;

             case 'machinegun': costFunction = getMachineGunUpgradeCost; break;

             case 'shotgun': costFunction = getShotgunUpgradeCost; break;

             case 'katana': costFunction = getKatanaUpgradeCost; break;

        }

        if (!costFunction) { console.error(`Missing cost function for ${type}`); return; }



        let baseCost = costFunction(currentLevel); // Get base cost for next level



        // *** Apply discount to actual cost ***

        cost = baseCost;

        if (hasHalfPrice) {

            cost = Math.ceil(baseCost / 2);

        }
      



        // Check affordability against the *actual* cost

        if (playerCoins < cost) { showTemporaryMessage("Not enough coins!"); return; }



        playerCoins -= cost; // Deduct actual cost

        upgradeTargetLevel = currentLevel + 1; upgradesBought[type] = upgradeTargetLevel;



        // --- Apply effects ---

        let minFireRate = 50; if (type === 'machinegun') minFireRate = 20;

        switch(type) {

            case 'pistol': /* ... apply pistol effects ... */ break;

            case 'machinegun': /* ... apply mg effects ... */ break;

            case 'shotgun': /* ... apply shotgun effects ... */ break;

            case 'katana': /* ... apply katana effects ... */ break;

        }

        // --- (Detailed effect switch cases omitted for brevity, same as previous version) ---

         // Make sure effects are applied correctly inside the switch based on upgradeTargetLevel

         // Example for pistol Lvl 1: if(upgradeTargetLevel === 1) weaponData.damage += 1; message = `Pistol Lvl 1: Dmg +1`;

         // Apply rounding/limits after the switch for fireRate, rangeMultiplier etc.

         if (weaponData.fireRate !== undefined) weaponData.fireRate = Math.round(Math.max(minFireRate, weaponData.fireRate));

         if (weaponData.rangeMultiplier !== undefined) weaponData.rangeMultiplier = Number(weaponData.rangeMultiplier.toFixed(2));

         console.log(`Bought ${weaponData.name} Lvl ${upgradeTargetLevel}.`);

         // Construct message based on level bought (using getUpgradeDescription is complex here)

         message = `${getUpgradeDescription(type)} Purchased!`; // Simpler message for now





    } else { /* Handle single purchase weapon upgrades if any */

        console.error(`Purchase logic not implemented for single-purchase weapon: ${type}`); return;

    }



    if (message) showTemporaryMessage(message);

    // soundPurchase.play();

} // End buyUpgrade



// --- Handles buying a General Upgrade --- NEW

// --- Handles buying a General Upgrade ---
function buyGeneralUpgrade(offerIndex) {
    if (offerIndex < 0 || offerIndex >= offeredGeneralUpgrades.length) {
        console.error("Invalid general upgrade offer index:", offerIndex);
        return;
    }

    let upgradeKey = offeredGeneralUpgrades[offerIndex];
    let upgradeData = generalUpgradeDefinitions[upgradeKey];

    if (!upgradeData) { console.error("Upgrade data not found for key:", upgradeKey); return; }
    if (upgradeData.purchased) { showTemporaryMessage("Upgrade already purchased!"); return; }

    // Check dependency
    if (upgradeData.requires && !generalUpgradeDefinitions[upgradeData.requires]?.purchased) {
         showTemporaryMessage(`Requires '${generalUpgradeDefinitions[upgradeData.requires]?.name}' first!`);
         return;
    }

    // Check cost (apply discount here)
    let baseCost = upgradeData.cost;
    let cost = baseCost; // Actual cost
    if (hasHalfPrice) {
        cost = Math.ceil(baseCost / 2); // Apply discount
    }

    if (playerCoins < cost) { showTemporaryMessage("Not enough coins!"); return; }

    // --- Purchase Successful ---
    playerCoins -= cost;
    upgradeData.purchased = true; // Mark as purchased in the definition object
    let message = `${upgradeData.name} Purchased!`;

    // Apply immediate flag/multiplier changes
    switch(upgradeKey) {
        case 'half_price':   hasHalfPrice = true; break;
        case 'power_surge':  generalDamageMultiplier = 1.5; break;
        case 'rate_surge':   generalFireRateMultiplier = 1.5; break;
        case 'double_coins': hasDoubleCoins = true; break;
        case 'homing_lite':  hasHomingBullets = true; break;
        case 'spawn_children': hasSpawnChildren = true; if(lastChildSpawnTime === 0) lastChildSpawnTime = millis(); break;
        case 'spawn_dad':    hasSpawnDad = true; break;
        // --- *** NEW Cases *** ---
        case 'extra_life':
            hasExtraLife = true;  // Set the flag
            maxPlayerLives++;     // Increase max lives capacity
            playerLives++;        // Grant the current life immediately
            console.log("Max Lives increased to:", maxPlayerLives);
            break;
        case 'piercing_shots':
            hasPiercingShots = true; // Set flag, logic is in checkCollisions
            break;
        case 'coin_magnet':
            hasCoinMagnet = true;    // Set flag, logic is in handleCoinMovement
            break;
        case 'enemy_explosion':
            hasEnemyExplosion = true; // Set flag, logic is in checkCollisions
            break;
        case 'vampirism_lite':
            hasVampirism = true;     // Set flag, logic is in checkCollisions
            break;
        // --- End NEW Cases ---
    }

    console.log(`Bought General Upgrade: ${upgradeKey}`);
    showTemporaryMessage(message);

    // Remove the bought item from the currently offered list
    offeredGeneralUpgrades.splice(offerIndex, 1);

    // Optional: Play purchase sound
    // soundPurchase.play();
} // End buyGeneralUpgrade




// --- Sets up and starts the next level ---

function startNextLevel() {

    console.log(`Starting Level ${level + 1}`);

    level++;

    enemyMaxSpeed = enemyBaseMaxSpeed * (1 + (level - 1) * 0.06);

    enemySpawnRate = max(15, enemyBaseSpawnRate * (1 - (level - 1) * 0.09));

    scoreNeededForLevel = level * 10;

    clearLevelEntities(); // Clears enemies, bullets, coins, children

    gameState = 'RUNNING';

    temporaryMessage = "";

    showTemporaryMessage(`Level ${level} Start!`, 1500);

} // End startNextLevel



// --- Draw Game Over/Pause Screens ---

function drawGameOver() { /* Fully expanded */

    fill(255, 0, 0, 150); rectMode(CORNER); rect(0, 0, width, height);

    fill(255); textSize(64); textAlign(CENTER, CENTER);

    text("GAME OVER", width / 2, height / 2 - 40);

    textSize(32); text(`Final Score: ${score}`, width / 2, height / 2 + 20);

    text(`Final Coins: ${playerCoins}`, width / 2, height / 2 + 60);

    textSize(24); text("Press 'R' to Restart", width / 2, height / 2 + 110);

}

function drawPauseScreen() { /* Fully expanded */

    fill(0, 0, 0, 180); rectMode(CORNER); rect(0, 0, width, height);

    fill(255); textSize(64); textAlign(CENTER, CENTER);

    text("PAUSED", width / 2, height / 2 - 100);

    textSize(24); let lineSpacing = 35; let startY = height / 2 - 30;

    text("Controls:", width / 2, startY); startY += lineSpacing;

    text("Move: WASD / Arrow Keys", width / 2, startY); startY += lineSpacing;

    text("Attack: Mouse Click", width / 2, startY); startY += lineSpacing;

    text("Change Weapon: 1, 2, 3, 4", width / 2, startY); startY += lineSpacing;

    text("Pause/Unpause: SPACEBAR", width / 2, startY);

    textSize(28); text("Press SPACEBAR to Resume", width / 2, height / 2 + 150);

}



// --- Draw UI ---

// --- Draw UI ---
// --- Draw UI ---
function drawUI() {
    fill(255); textSize(20); textAlign(LEFT, TOP);
    text(`Score: ${score} / ${scoreNeededForLevel}`, 10, 10);
    text(`Level: ${level}`, 10, 35);
    text("Weapon: " + weapons[currentWeapon].name + " [" + getWeaponKey(currentWeapon) + "]", 10, 60);
    text(`Coins: ${playerCoins} 🪙`, 10, 85);

    // Draw General Upgrade Indicators
    let genUpgradeY = 110; let genUpgradeSpacing = 18; // Slightly reduce spacing maybe
    textSize(14); fill(200, 200, 0); // Dim yellow for indicators

    if (hasHalfPrice) { text("Discount", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (generalDamageMultiplier > 1.0) { text(`Dmg x${generalDamageMultiplier.toFixed(1)}`, 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (generalFireRateMultiplier > 1.0) { text(`Rate x${generalFireRateMultiplier.toFixed(1)}`, 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasDoubleCoins) { text("Coin Doubler", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasHomingBullets) { text("Homing Lite", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasSpawnChildren) { text("Children", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasSpawnDad) { text("Dad", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    // --- *** NEW Indicators *** ---
    if (hasExtraLife) { text("Extra Life", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasPiercingShots) { text("Piercing Shots", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasCoinMagnet) { text("Coin Magnet", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasEnemyExplosion) { text("Enemy Explosion", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    if (hasVampirism) { text("Vampirism Lite", 10, genUpgradeY); genUpgradeY += genUpgradeSpacing; }
    // --- End NEW Indicators ---

    fill(255); // Reset color for other UI elements

    // Draw Lives
    let heartSymbol = '❤️'; let livesText = "";
    for (let i = 0; i < playerLives; i++) { livesText += heartSymbol; }
    textAlign(RIGHT, TOP); textSize(20);
    // Append Max lives display only if it has been increased
    let maxLivesDisplay = (maxPlayerLives > STARTING_LIVES) ? ` (Max ${maxPlayerLives})` : "";
    text("Lives: " + livesText + maxLivesDisplay, width - 10, 10);
    textAlign(LEFT, TOP); // Reset alignment

    // Draw Command Input Line
    if (isCommandMode) {
        fill(255);
        textSize(18);
        textAlign(LEFT, BOTTOM);
        let cursor = (frameCount % 60 < 30) ? "|" : " ";
        text("/" + currentCommand + cursor, 10, height - 10);
        textAlign(LEFT, TOP); // Reset alignment
    }
} // End drawUI


// --- Gets Weapon Key for UI ---

function getWeaponKey(weaponName) { /* Fully expanded */

    switch (weaponName) {

        case 'pistol': return '1';

        case 'shotgun': return '2';

        case 'machinegun': return '3';

        case 'katana': return '4';

        default: return '?';

    }

} // End getWeaponKey



// --- Handles Window Resize ---

function windowResized() { /* Fully expanded */

    resizeCanvas(windowWidth, windowHeight);

    // Optional: Recalculate UI positions or player constraints

} // End windowResized
// === NEW HELPER FUNCTION for Coin Magnet ===
function handleCoinMovement() {
    // Only run if upgrade is active, game is running, and not paused
    if (!hasCoinMagnet || isPaused || gameState !== 'RUNNING') return;

    for (let i = droppedCoins.length - 1; i >= 0; i--) {
        let coin = droppedCoins[i];
        let d = dist(player.x, player.y, coin.x, coin.y);

        // Check if coin is within magnet range BUT not right on top of the player
        if (d < COIN_MAGNET_RANGE && d > playerHitboxSize / 4) { // Use smaller inner radius
            let angle = atan2(player.y - coin.y, player.x - coin.x);
            // Apply velocity towards player
            coin.x += cos(angle) * COIN_MAGNET_STRENGTH;
            coin.y += sin(angle) * COIN_MAGNET_STRENGTH;
        }
    }
} // End handleCoinMovement


// === END HELPER FUNCTION DEFINITIONS ===





// ==========================

// === INPUT HANDLING ===

// ==========================



// Add mousePressed for choice screen buttons

function mousePressed() {

    // Check clicks only in the CHOICE state

    if (gameState === 'CHOICE') {

        // Check click on Weapon Upgrade Button

        if (mouseX > choiceButtonWeaponX && mouseX < choiceButtonWeaponX + choiceButtonWidth &&

            mouseY > choiceButtonWeaponY && mouseY < choiceButtonWeaponY + choiceButtonHeight) {

            console.log("Choice: Weapon Upgrades");

            gameState = 'STORE'; // Go to weapon store

        }

        // Check click on General Upgrade Button

        else if (mouseX > choiceButtonGeneralX && mouseX < choiceButtonGeneralX + choiceButtonWidth &&

                 mouseY > choiceButtonGeneralY && mouseY < choiceButtonGeneralY + choiceButtonHeight) {

            console.log("Choice: General Upgrades");

            generateOfferedUpgrades(); // Prepare the list of upgrades

            gameState = 'GENERAL_STORE'; // Go to general store

        }

    }

    // return false; // Might be needed to prevent default browser actions

} // End mousePressed





// Handles weapon firing input (Apply Rate Surge)

function handleAttackInput() {

    if (gameState !== 'RUNNING' || isPaused) return;

    let now = millis();

    let weapon = weapons[currentWeapon];



    // Apply general fire rate multiplier HERE

    let effectiveFireRate = weapon.fireRate / generalFireRateMultiplier;



    // Check cooldown using effective rate

    let readyToAttack = (now - lastAttackTime > effectiveFireRate);

    let tryingToAttack = mouseIsPressed;



    if (tryingToAttack && readyToAttack) {

        if (currentWeapon === 'katana') swingKatana();

        else if (currentWeapon === 'shotgun') fireShotgun();

        else if (currentWeapon === 'pistol') firePistol();

        else if (currentWeapon === 'machinegun') fireMachineGun();

        lastAttackTime = now;

    }

    if (currentWeapon === 'katana' && isAttacking && now > attackVisualEndTime) { isAttacking = false; }

} // End handleAttackInput



// Handles keyboard input for state changes and stores

// Handles keyboard input for state changes, stores, and commands
function keyPressed() {

    // --- Command Mode Input Handling FIRST ---
    if (isCommandMode) {
        if (keyCode === ENTER) { // 13
            console.log("Executing command:", currentCommand);
            executeCommand(currentCommand); // Process the command
            isCommandMode = false;          // Exit command mode
            currentCommand = "";            // Clear the command string
            isPaused = false;               // Unpause the game
        } else if (keyCode === ESCAPE) { // 27
            console.log("Command cancelled.");
            isCommandMode = false;          // Exit command mode
            currentCommand = "";            // Clear the command string
            isPaused = false;               // Unpause the game
        } else if (keyCode === BACKSPACE) { // 8
            // Remove last character
            currentCommand = currentCommand.substring(0, currentCommand.length - 1);
        } else if (key.length === 1) {
             // Append printable characters (including space, keyCode 32)
             // Limit command length to prevent excessive strings (e.g., 50 chars)
             if (currentCommand.length < 50) {
                 currentCommand += key;
             }
        }
        // Prevent command input keys from triggering other game actions
        return;
    } // End of command mode input handling

    // --- Check for Entering Command Mode ---
    // Only allow entering command mode during RUNNING, STORE, or GENERAL_STORE states? Or anytime? Let's allow anytime except game over for now.
    if (key === '/' && !gameOver) {
        isCommandMode = true;
        currentCommand = "";    // Reset command string
        isPaused = true;        // PAUSE the game while typing
        console.log("Entered command mode. Game paused.");
        return; // Stop the '/' key from doing anything else
    }

    // --- Existing Game Input Handling (Only if NOT in command mode) ---
    // Console log moved here to avoid logging during command typing
    // console.log(`Key Pressed: ${key} (${keyCode}), State: ${gameState}, Paused: ${isPaused}`);

    // --- State Transitions (Spacebar) ---
    if (keyCode === 32) { // Spacebar
        if (gameState === 'RUNNING' && !isPaused) { isPaused = true; console.log("Game Paused"); }
        else if (isPaused) { isPaused = false; console.log("Game Resumed"); } // This now also resumes from command pause if space is hit accidentally
        else if (gameState === 'STORE' || gameState === 'GENERAL_STORE') {
            startNextLevel();
        }
        return; // Prevent other key actions
    }

    // --- Restart (R - only when Game Over) ---
    if (gameOver && (key === 'r' || key === 'R')) { resetGame(); return; }

    // --- Store Purchases (Won't trigger if paused by command mode) ---
    if (gameState === 'STORE') {
        if (key >= '1' && key <= '4') {
             const upgradeKeys = ['pistol', 'machinegun', 'shotgun', 'katana']; // Adjust mapping if needed
             let index = parseInt(key) - 1;
             if (index < upgradeKeys.length) buyUpgrade(upgradeKeys[index]);
        }
        return; // Block other keys
    } else if (gameState === 'GENERAL_STORE') {
        if (key >= '1' && key <= '5') {
             let index = parseInt(key) - 1;
             if (index < offeredGeneralUpgrades.length) buyGeneralUpgrade(index);
        }
        return; // Block other keys
    }

    // --- Weapon Switching (Running state only, not if paused) ---
    if (gameState === 'RUNNING' && !isPaused) {
        let weaponChanged = false;
        if (key === '1') { currentWeapon = 'pistol'; weaponChanged = true; }
        else if (key === '2') { currentWeapon = 'shotgun'; weaponChanged = true; } // Check mapping matches store if needed
        else if (key === '3') { currentWeapon = 'machinegun'; weaponChanged = true; } // Check mapping
        else if (key === '4') { currentWeapon = 'katana'; weaponChanged = true; }
        if (weaponChanged) { console.log(`Switched weapon to ${currentWeapon}`); lastAttackTime = 0; isAttacking = false; }
    }

} // End keyPressed


// Handles player movement input based on game state

function handlePlayerMovement() {

    if (gameState !== 'RUNNING' || isPaused) return;

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) player.y -= playerSpeed;

    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) player.y += playerSpeed;

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) player.x -= playerSpeed;

    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) player.x += playerSpeed;

    player.x = constrain(player.x, playerHitboxSize / 2, width - playerHitboxSize / 2);

    player.y = constrain(player.y, playerHitboxSize / 2, height - playerHitboxSize / 2);

} // End handlePlayerMovement



// === END INPUT HANDLING ===





// ==========================

// === PLAYER FUNCTIONS ===

// ==========================

// Draws the player sprite or fallback shape

function drawPlayer() {

  if (playerImage) { image(playerImage, player.x, player.y, playerSize, playerSize); }

  else { fill(0, 150, 255); noStroke(); ellipse(player.x, player.y, playerSize, playerSize); }

} // End drawPlayer

// === END PLAYER FUNCTIONS ===





// ==========================

// === WEAPON FUNCTIONS ===

// ==========================

// Fires a single bullet for the Pistol

function firePistol() {

    let w = weapons.pistol; let a = atan2(mouseY - player.y, mouseX - player.x); let vx = w.bulletSpeed * cos(a); let vy = w.bulletSpeed * sin(a); bullets.push({ x: player.x, y: player.y, vx: vx, vy: vy, damage: w.damage, source: 'player' });

} // End firePistol



// Fires multiple pellets for the Shotgun

function fireShotgun() {

    let w = weapons.shotgun; 
  let bA = atan2(mouseY - player.y, mouseX - player.x); 
  for (let i = 0; i < w.pellets; i++) { 
    let a = bA + random(-w.spread / 2, w.spread / 2); 
    let vx = w.bulletSpeed * cos(a); 
    let vy = w.bulletSpeed * sin(a); 
    bullets.push({ x: player.x, y: player.y, vx: vx, vy: vy, damage: w.damage, source: 'player' }); 
  }

} // End fireShotgun



// Fires a single bullet for the Machine Gun

function fireMachineGun() {

    let w = weapons.machinegun; let a = atan2(mouseY - player.y, mouseX - player.x); let vx = w.bulletSpeed * cos(a); let vy = w.bulletSpeed * sin(a); bullets.push({ x: player.x, y: player.y, vx: vx, vy: vy, damage: w.damage, source: 'player' });

} // End fireMachineGun


// Performs a Katana swing - checks for hits, applies damage, triggers effects
function swingKatana() {
    let w = weapons.katana;
    let currentRange = playerHitboxSize / 2 + (playerHitboxSize * w.rangeMultiplier / 2);
    let attackAngle = atan2(mouseY - player.y, mouseX - player.x);
    let hitOccurred = false;

    for (let i = enemies.length - 1; i >= 0; i--) {
         if (!enemies[i] || enemies[i].hp <= HP_THRESHOLD) continue; // Skip dead
         let enemy = enemies[i];
         let d = dist(player.x, player.y, enemy.x, enemy.y);

         if (d < currentRange + enemySize / 2) { // Check range
              let angleToEnemy = atan2(enemy.y - player.y, enemy.x - player.x);
              let angleDiff = abs(atan2(sin(attackAngle - angleToEnemy), cos(attackAngle - angleToEnemy)));

              if (angleDiff < w.arc / 2) { // Check arc
                  // Apply Damage ONCE
                  enemy.hp -= w.damage * generalDamageMultiplier;
                  hitOccurred = true;

                  // Check if Defeated by Katana Hit
                  let defeatedByKatana = enemy.hp <= HP_THRESHOLD;
                  if (defeatedByKatana) {
                       // ***** CALL HELPER FUNCTION *****
                       handleEnemyDefeat(enemy, 'player'); // Pass enemy object and 'player' source
                       // ***** END CALL HELPER FUNCTION *****

                       // Enemy removal handled by removeDeadEnemies() later
                  } // End if defeated by Katana
              } // End if within arc
         } // End if within range
    } // End loop through enemies

    isAttacking = true;
    attackVisualEndTime = millis() + 100;
    // if (hitOccurred) soundKatanaHit.play(); else soundKatanaMiss.play();
} // End swingKatana


// Draws the visual representation of the Katana swing

function drawAttackVisuals() {

    if (isAttacking && currentWeapon === 'katana') {

        let w = weapons.katana; let currentRange = playerHitboxSize * w.rangeMultiplier; let angle = atan2(mouseY - player.y, mouseX - player.x); let startAngle = angle - w.arc / 2; let endAngle = angle + w.arc / 2; fill(255, 255, 255, 100); noStroke(); arc(player.x, player.y, currentRange * 2, currentRange * 2, startAngle, endAngle, PIE); noFill();

    }

} // End drawAttackVisuals

// === END WEAPON FUNCTIONS ===





// ==========================

// === BULLET FUNCTIONS ===

// ==========================

// Updates bullet positions and removes off-screen bullets (Includes Homing)

function handleBullets() {

    const HOMING_STRENGTH = 0.03; // How strongly bullets steer (adjust)

    const HOMING_RANGE_SQ = 400 * 400; // Max distance squared to look for target



    for (let i = bullets.length - 1; i >= 0; i--) {

        let bullet = bullets[i];

        // Update position

        bullet.x += bullet.vx;

        bullet.y += bullet.vy;



        // --- Homing Logic ---

        if (hasHomingBullets && bullet.source === 'player' && enemies.length > 0) {

            let nearestEnemy = null; let minDistSq = HOMING_RANGE_SQ;

            for (let enemy of enemies) { /* Find nearest enemy */ let dSq = (enemy.x - bullet.x)**2 + (enemy.y - bullet.y)**2; if (dSq < minDistSq) { minDistSq = dSq; nearestEnemy = enemy; } }

            if (nearestEnemy) { /* Steer towards nearest enemy */

                let targetVx = nearestEnemy.x - bullet.x; let targetVy = nearestEnemy.y - bullet.y; let mag = sqrt(targetVx**2 + targetVy**2);

                if (mag > 0) {

                    targetVx /= mag; targetVy /= mag; let currentSpeed = sqrt(bullet.vx**2 + bullet.vy**2);

                    bullet.vx = bullet.vx * (1 - HOMING_STRENGTH) + targetVx * HOMING_STRENGTH * currentSpeed;

                    bullet.vy = bullet.vy * (1 - HOMING_STRENGTH) + targetVy * HOMING_STRENGTH * currentSpeed;

                    let newMag = sqrt(bullet.vx**2 + bullet.vy**2); if (newMag > 0) { bullet.vx = (bullet.vx / newMag) * currentSpeed; bullet.vy = (bullet.vy / newMag) * currentSpeed; }

                }

            }

        }

        // --- End Homing Logic ---



        // Remove bullets far off-screen

        let padding = 150;

        if (bullet.x < -padding || bullet.x > width + padding || bullet.y < -padding || bullet.y > height + padding) { bullets.splice(i, 1); }

    }

} // End handleBullets



// Draws all active bullets

function drawBullets() {

    noStroke(); for (let b of bullets) { fill(b.source === 'enemy' ? color(255, 100, 100) : (b.source === 'child' ? color(0, 255, 255) : color(255, 255, 0))); ellipse(b.x, b.y, bulletSize, bulletSize); } // Added cyan for child bullets

} // End drawBullets

// === END BULLET FUNCTIONS ===





// ==========================

// === ENEMY FUNCTIONS ===

// ==========================

// Handles enemy spawning and movement/attacks
function handleEnemies() {
    if (gameState !== 'RUNNING' || isPaused) return;

    // --- Spawning ---
    // Spawn rate increases slightly faster at higher levels now
    let dynamicSpawnRate = max(10, enemySpawnRate - level * 0.05);
    if (frameCount % floor(dynamicSpawnRate) === 0) {
        spawnEnemy();
    }

    // --- Movement & Attacks ---
    let now = millis(); // Get current time for attack timers

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];

        // --- Movement (Towards Player) ---
        let angleToPlayer = atan2(player.y - e.y, player.x - e.x);
        e.x += e.speed * cos(angleToPlayer);
        e.y += e.speed * sin(angleToPlayer);

        // --- Attacks ---
        // 1. Shooting Enemies (Purple and Yellow)
        if ((e.type === "purple" || e.type === "yellow") && e.shootRate) {
             if (frameCount % e.shootRate === 0) { // Use enemy-specific shootRate
                 let bulletAngle = atan2(player.y - e.y, player.x - e.x);
                 let bulletSpeed = 5; // Standard enemy bullet speed
                 let vx = bulletSpeed * cos(bulletAngle);
                 let vy = bulletSpeed * sin(bulletAngle);
                 bullets.push({
                     x: e.x, y: e.y,
                     vx: vx, vy: vy,
                     damage: e.bulletDamage || 1, // Use defined bulletDamage, default to 1
                     source: 'enemy'
                 });
             }
        }
        // 2. Melee Enemies (Ninja)
        else if (e.type === "ninja" && e.weapon === "katana") {
             let distToPlayer = dist(e.x, e.y, player.x, player.y);
             // Calculate ninja's effective katana reach (base enemy size + range multiplier)
             // Note: Using playerHitboxSize here for consistency, could use a ninja-specific base range
             let ninjaReach = enemySize / 2 + (playerHitboxSize * e.katanaRangeMultiplier) / 2;

             // Check if player is within reach AND attack is off cooldown
             if (distToPlayer < ninjaReach && now - e.lastAttackTime > e.attackRate) {
                 console.log("Ninja attacks!");
                 // Directly damage the player (bypasses bullet collision)
                 // Apply the ninja's specific attack damage
                 playerHit(e.attackDamage || 1); // Pass ninja damage, default to 1 if undefined
                 e.lastAttackTime = now; // Reset attack timer
                 // Optional: Add a small visual effect here (e.g., brief flash)
             }
        }
    }
} // End handleEnemies


// Spawns an enemy off-screen with appropriate stats and visual size
function spawnEnemy() {
    let x, y;
    let edge = floor(random(4));
    let defaultVisualSize = enemySize * ENEMY_VISUAL_SIZE_MULTIPLIER; // Base visual size for Red
    let visualSize = defaultVisualSize; // Default to Red size
    let spawnMargin = defaultVisualSize / 2 + 10; // Margin based on largest potential size initially

    // Determine spawn position off-screen
    if (edge === 0) { x = random(width); y = -spawnMargin; }          // Top edge
    else if (edge === 1) { x = width + spawnMargin; y = random(height); } // Right edge
    else if (edge === 2) { x = random(width); y = height + spawnMargin; } // Bottom edge
    else { x = -spawnMargin; y = random(height); }                     // Left edge

    // --- Enemy Type Determination based on Level ---
    let type = "red";     // Default type
    let hp = 1;           // Default stats
    let maxHp = 1;
    let speed = random(enemyMaxSpeed * 0.8, enemyMaxSpeed * 1.1); // Base speed variation
    let points = 1;
    let color = [255, 0, 0]; // Red
    let coinDrop = 1;
    let useImage = redEnemyImage; // Default to red enemy image
    let enemyProperties = {}; // Object to hold extra properties

    // ===== NEW Level Thresholds =====
    const levelThresholdYellow = 6;
    const levelThresholdNinja = 5;
    const levelThresholdPurple = 4;
    const levelThresholdGreen = 3;
    // Red enemies appear from Level 1 (implicitly)

    let randomRoll = random(); // Roll once for type determination

    // --- Check for enemy types, starting with the highest level requirement ---
    // Adjusted probabilities to make rarer types less common initially
    if (level >= levelThresholdYellow && randomRoll < 0.10) { // 10% chance for Yellow at Lvl 6+
        type = "yellow";
        hp = 6; maxHp = 6;
        speed = enemyMaxSpeed * 1.2; // Same speed as Purple
        points = 6; color = [255, 255, 0]; coinDrop = 6;
        visualSize = defaultVisualSize / 10; useImage = null;
        enemyProperties.bulletDamage = 2; // Double Purple bullet damage
        enemyProperties.shootRate = 100; // Shoots slightly faster than purple

    } else if (level >= levelThresholdNinja && randomRoll < 0.25) { // Next 15% chance for Ninja (Total 25% roll) at Lvl 5+
        type = "ninja";
        hp = 5; maxHp = 5;
        speed = enemyMaxSpeed * 1.35; // Faster speed
        points = 5; color = [80, 80, 80]; coinDrop = 5;
        visualSize = defaultVisualSize / 9; useImage = null;
        enemyProperties.weapon = "katana";
        enemyProperties.katanaRangeMultiplier = 2.8; // Large range
        enemyProperties.attackRate = 600; // Swings every 600ms
        enemyProperties.attackDamage = 2;
        enemyProperties.lastAttackTime = 0;

    } else if (level >= levelThresholdPurple && randomRoll < 0.45) { // Next 20% chance for Purple (Total 45% roll) at Lvl 4+
        type = "purple";
        hp = 3; maxHp = 3;
        speed = enemyMaxSpeed * 1.2; // Faster speed
        points = 3; color = [150, 0, 255]; coinDrop = 3;
        visualSize = defaultVisualSize / 10; useImage = null;
        enemyProperties.bulletDamage = 1;
        enemyProperties.shootRate = 120; // Shoots every 120 frames

    } else if (level >= levelThresholdGreen && randomRoll < 0.70) { // Next 25% chance for Green (Total 70% roll) at Lvl 3+
        type = "green";
        hp = 2; maxHp = 2;
        speed = enemyMaxSpeed * 1.1; // Slightly faster
        points = 2; color = [0, 255, 0]; coinDrop = 2;
        visualSize = defaultVisualSize / 10; useImage = null;

    } // Else: It remains the default "red" type (Remaining 30% chance)

    // Re-calculate spawn margin if a smaller enemy type was chosen
    if (type !== "red") {
        spawnMargin = visualSize / 2 + 10;
         if (edge === 0) { y = -spawnMargin; }
         else if (edge === 1) { x = width + spawnMargin; }
         else if (edge === 2) { y = height + spawnMargin; }
         else { x = -spawnMargin; }
    }

    // Create the enemy object
    enemies.push({
        x: x, y: y,
        hp: hp, maxHp: maxHp,
        speed: speed, type: type,
        points: points, color: color, coinDrop: coinDrop,
        visualSize: visualSize, image: useImage,
        ...enemyProperties // Add specific properties
    });
} // End spawnEnemy

// Draws enemies and their health bars

function drawEnemies() {

    for (let enemy of enemies) {

        noStroke();

        // Draw Body

        if (enemy.image) { image(enemy.image, enemy.x, enemy.y, enemy.visualSize, enemy.visualSize); }

        else { fill(enemy.color[0], enemy.color[1], enemy.color[2]); let sizeToDraw = enemy.visualSize; ellipse(enemy.x, enemy.y, sizeToDraw, sizeToDraw); }

        // Draw Health Bar

        if (enemy.hp < enemy.maxHp) { let hR = constrain(enemy.hp / enemy.maxHp, 0, 1); let cHBW = healthBarWidth * hR; let hBYO = (enemySize / 2) + healthBarHeight + 3; let hBY = enemy.y - hBYO; fill(100, 0, 0, 180); rectMode(CORNER); rect(enemy.x - healthBarWidth / 2, hBY, healthBarWidth, healthBarHeight); fill(0, 255, 0, 220); rect(enemy.x - healthBarWidth / 2, hBY, cHBW, healthBarHeight); }

    }

    ellipseMode(CENTER); rectMode(CORNER); // Reset modes

} // End drawEnemies

// === END ENEMY FUNCTIONS ===
// ==========================
// === CHILDREN FUNCTIONS (Allies) === NEW / EXPANDED
// ==========================

const MAX_CHILDREN = 5; // Maximum number of allied children allowed

// --- Main Handler for Children Logic ---
function handleChildren() {
    // Only run during gameplay and if the upgrade is active
    if (gameState !== 'RUNNING' || isPaused || !hasSpawnChildren) {
        return;
    }

    // --- Spawning ---
    // Determine the correct spawn interval based on upgrades
    let spawnInterval = hasSpawnDad ? CHILD_DAD_SPAWN_INTERVAL : CHILD_BASE_SPAWN_INTERVAL;

    // Check if it's time to spawn a new child and if we are under the limit
    if (millis() - lastChildSpawnTime > spawnInterval && children.length < MAX_CHILDREN) {
        spawnChild();
        lastChildSpawnTime = millis(); // Reset the timer after spawning
    }

    // --- Update Existing Children ---
    // Iterate backwards for safe removal if a child's HP drops
    for (let i = children.length - 1; i >= 0; i--) {
        let child = children[i];

        // Check if the child has been defeated (HP is likely checked/reduced in checkCollisions)
        if (child.hp <= 0) {
            children.splice(i, 1); // Remove the child from the array
            console.log("Child removed due to low HP.");
            continue; // Skip the rest of the update for this removed child
        }

        // --- Movement (Simple Follow Player) ---
        handleChildMovement(child);

        // --- Attacking ---
        handleChildAttack(child);
    }
} // End handleChildren

// --- Spawns a Single Child Unit ---
function spawnChild() {
    let childWeaponKey = 'pistol'; // Default weapon

    // If 'Spawn Dad' upgrade is active, assign a random ranged weapon
    if (hasSpawnDad) {
        const availableWeapons = ['pistol', 'shotgun', 'machinegun']; // Katana excluded for allies
        childWeaponKey = random(availableWeapons);
    }

    // Determine spawn position near the player, but not directly on top
    let spawnAngle = random(TWO_PI); // Random angle around the player
    let spawnDist = playerSize * 0.8; // Distance from player center
    let spawnX = player.x + spawnDist * cos(spawnAngle);
    let spawnY = player.y + spawnDist * sin(spawnAngle);

    // Ensure spawn position is within screen bounds
    spawnX = constrain(spawnX, CHILD_HITBOX_SIZE / 2, width - CHILD_HITBOX_SIZE / 2);
    spawnY = constrain(spawnY, CHILD_HITBOX_SIZE / 2, height - CHILD_HITBOX_SIZE / 2);

    // Create the new child object and add it to the array
    children.push({
        x: spawnX,
        y: spawnY,
        hp: CHILD_LIFE,
        maxHp: CHILD_LIFE, // Store max HP for potential future use (e.g., healing)
        speed: CHILD_SPEED,
        weapon: childWeaponKey, // Assigned weapon key
        lastAttackTime: 0,      // Initialize attack timer
        hitboxSize: CHILD_HITBOX_SIZE, // Store hitbox size for collision checks
        visualSize: CHILD_VISUAL_SIZE  // Store visual size for drawing
    });

    console.log(`Spawned child #${children.length} with weapon: ${childWeaponKey}`);
} // End spawnChild

// --- Handles Movement for a Single Child ---
function handleChildMovement(child) {
    // Calculate distance and angle to the player
    let distToPlayer = dist(child.x, child.y, player.x, player.y);
    let angleToPlayer = atan2(player.y - child.y, player.x - child.x);

    // Define a 'follow distance' - children try to stay roughly this far away
    let followDistance = playerSize * 1.2 + random(-20, 20); // Add some randomness to formation

    // Move towards player if too far, slightly away if too close (simple flocking)
    if (distToPlayer > followDistance + 10) { // Move towards if farther than threshold
         child.x += child.speed * cos(angleToPlayer);
         child.y += child.speed * sin(angleToPlayer);
    } else if (distToPlayer < followDistance - 10) { // Move away if closer than threshold
         child.x -= child.speed * 0.5 * cos(angleToPlayer); // Move away slower
         child.y -= child.speed * 0.5 * sin(angleToPlayer);
    }

    // Basic screen boundary constraint
    child.x = constrain(child.x, child.hitboxSize / 2, width - child.hitboxSize / 2);
    child.y = constrain(child.y, child.hitboxSize / 2, height - child.hitboxSize / 2);
} // End handleChildMovement


// --- Handles Attack Logic for a Single Child ---
function handleChildAttack(child) {
    let weaponData = weapons[child.weapon];

    // Ensure weapon exists and is not melee (children currently only use ranged)
    if (!weaponData || weaponData.name === "Katana") {
        return;
    }

    // Check weapon cooldown - IMPORTANT: Use BASE fire rate, children don't get player rate upgrades
    let now = millis();
    if (now - child.lastAttackTime < weaponData.baseFireRate) {
        return; // Weapon is on cooldown
    }

    // Find the nearest enemy within a defined attack range
    let targetEnemy = null;
    let minDistSq = (450 * 450); // Squared attack range for efficiency (450 pixels)
    for (let enemy of enemies) {
        let dSq = (enemy.x - child.x)**2 + (enemy.y - child.y)**2;
        if (dSq < minDistSq) {
            minDistSq = dSq;
            targetEnemy = enemy;
        }
    }

    // If a valid target is found within range, fire the weapon
    if (targetEnemy) {
        childFireWeapon(child, targetEnemy);
        child.lastAttackTime = now; // Reset the attack timer
    }
} // End handleChildAttack


// --- Creates Bullets for a Child's Weapon ---
function childFireWeapon(child, targetEnemy) {
    let weaponData = weapons[child.weapon]; // Get data for the child's equipped weapon

    // Calculate the angle towards the target enemy
    let angle = atan2(targetEnemy.y - child.y, targetEnemy.x - child.x);

    // --- Use BASE weapon stats for children ---
    // Children do NOT benefit from player's purchased level upgrades or general surges
    let damage = weaponData.baseDamage;
    let bulletSpeed = weaponData.bulletSpeed;
    let pellets = weaponData.basePellets || 1; // Default to 1 if not defined (e.g., pistol)
    let spread = weaponData.spread || 0;       // Default to 0 if not defined

    // Create bullets based on pellet count
    for (let i = 0; i < pellets; i++) {
        let pelletAngle = angle + random(-spread / 2, spread / 2); // Apply spread if applicable
        let vx = bulletSpeed * cos(pelletAngle);
        let vy = bulletSpeed * sin(pelletAngle);

        // Add the bullet to the global bullets array
        bullets.push({
            x: child.x,       // Start at child's position
            y: child.y,
            vx: vx,           // Velocity vector
            vy: vy,
            damage: damage,   // Use BASE damage
            source: 'child'   // Mark the source for collision checks and drawing
        });
    }
    // Optional: Play a distinct, perhaps quieter, sound effect for child shots
    // soundChildShoot.play();
} // End childFireWeapon


// --- Draws All Active Children ---
function drawChildren() {
    ellipseMode(CENTER); // Ensure ellipse is drawn from center
    for (let child of children) {
        fill(0, 180, 255, 220); // Light blue, slightly transparent
        noStroke();
        ellipse(child.x, child.y, child.visualSize, child.visualSize);

        // Optional: Draw a small health indicator if they ever have > 1 HP
        // if (child.hp < child.maxHp && child.maxHp > 1) {
        //     let healthRatio = constrain(child.hp / child.maxHp, 0, 1);
        //     let barWidth = child.visualSize * 0.8;
        //     let barHeight = 5;
        //     let barYOffset = child.visualSize / 2 + barHeight + 2;
        //     fill(100, 0, 0); // Red background
        //     rect(child.x - barWidth / 2, child.y - barYOffset, barWidth, barHeight);
        //     fill(0, 255, 0); // Green foreground
        //     rect(child.x - barWidth / 2, child.y - barYOffset, barWidth * healthRatio, barHeight);
        // }
    }
} // End drawChildren

// === END CHILDREN FUNCTIONS ===


// ==========================
// === COLLISION DETECTION ===
// ==========================
// === COLLISION DETECTION (Complete Version - Includes Sections 3 & 4) ===
function checkCollisions() {
    // Exit if not in the right state or paused
    if (gameState !== 'RUNNING' || isPaused) { return; }

    // Ensure HP_THRESHOLD is accessible (defined globally or at start of function)
    const HP_THRESHOLD = 0.01; // Threshold for checking enemy HP death

    // --- 1. Player/Child Bullets vs Enemies ---
    // Loop backwards through bullets for safe removal
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        // Safety Check 1: Skip if bullet was already removed
        if (!bullet) { continue; }
        // Filter: Only process player/child bullets here
        if (bullet.source !== 'player' && bullet.source !== 'child') { continue; }

        // Loop backwards through enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            // Safety Check 2: Skip if enemy was already removed
            if (!enemies[j]) { continue; }
            let enemy = enemies[j];

            // Safety Check 3: Skip processing hit if enemy is already effectively dead
            if (enemy.hp <= HP_THRESHOLD) {
                continue;
            }

            // --- Hit Detection ---
            let d = dist(bullet.x, bullet.y, enemy.x, enemy.y);
            if (d < bulletSize / 2 + enemySize / 2) { // Hit Detected!

                // --- Apply Damage ---
                let damageToApply = bullet.damage;
                if (bullet.source === 'player') { damageToApply *= generalDamageMultiplier; }
                enemy.hp -= damageToApply; // Reduce HP

                // --- Check if Defeated ---
                let defeated = enemy.hp <= HP_THRESHOLD;
                console.log(`defeated: ${defeated}`)

                

                // --- Process Defeat Effects (if defeated by this hit) ---
                if (defeated) {
                    console.log(`>>> DEFEATED BY BULLET: Enemy[${j}] <<<`); // Optional Log
                    let killerSource = bullet.source;
                    let defeatedX = enemy.x; let defeatedY = enemy.y;
                    let pointsAwarded = enemy.points; 
                    let coinsToDrop = enemy.coinDrop;

                    // Trigger Vampirism
                    if (hasVampirism && killerSource === 'player') { 
                      if (random() < VAMPIRISM_CHANCE) { if (playerLives < maxPlayerLives) { playerLives++; showTemporaryMessage("+1 HP!", 500); } } 
                    }
                    // Trigger Score & Coins
                    if (typeof pointsAwarded === 'number' && typeof coinsToDrop === 'number' && typeof score === 'number') {
                        score += pointsAwarded;
                        if (hasDoubleCoins) { coinsToDrop *= 2; }
                        for (let k = 0; k < coinsToDrop; k++) {
                          let coinX = defeatedX + random(-enemySize / 3, enemySize / 3); 
                          let coinY = defeatedY + random(-enemySize / 3, enemySize / 3);
                          if (typeof coinX === 'number' && typeof coinY === 'number') { 
                            droppedCoins.push({ x: coinX, y: coinY, creationTime: millis() }); 
                          }
                          else {
                            console.error(`!!! Coin Creation Error (Bullet Kill): Invalid coords! x: ${coinX}, y: ${coinY}.`); 
                          }
                        }
                        // console.log(`   SCORE/COIN OK for Enemy[${j}]. New Score: ${score}`); // Optional Log
                    } else { console.error(`!!! REWARD ERROR: Invalid values! points:${pointsAwarded}, coins:${coinsToDrop}, score:${score}`); }
                    // Trigger Explosion Damage Check
                    if (hasEnemyExplosion) {
                        for (let k = enemies.length - 1; k >= 0; k--) {
                            if (!enemies[k] || k === j) { continue; } let otherEnemy = enemies[k];
                            if (otherEnemy.hp > HP_THRESHOLD) { // Check if other enemy is alive
                                let distExplosion = dist(defeatedX, defeatedY, otherEnemy.x, otherEnemy.y);
                                if (distExplosion < EXPLOSION_RADIUS + otherEnemy.visualSize / 2) { otherEnemy.hp -= EXPLOSION_DAMAGE; }
                            }
                        }
                    } // End Explosion
                    // Enemy 'j' is NOT removed here. removeDeadEnemies() handles it.
                } // End if defeated
                
              
                // --- Piercing Logic & Bullet Removal Decision ---
                let removeBullet = true;
                if (bullet.source === 'player' && hasPiercingShots) {
                    bullet.pierceCount = (bullet.pierceCount || 0) + 1;
                    if (bullet.pierceCount <= 1) { removeBullet = false; } // Don't remove yet
                }
                
                // --- Remove Bullet if Needed ---
                if (removeBullet && bullets[i]) { // Check bullet still exists
                    bullets.splice(i, 1);
                    console.log(`We are exiting!!!!!!!`)
                    break; // Exit inner 'j' loop (enemies) for this bullet 'i'
                }
                // If bullet pierced (removeBullet == false), the inner 'j' loop continues

            } // End if hit detected
        } // End inner loop (enemies) - j
        if (!bullets[i]) { continue; } // Safety check for outer loop i
    } // End outer loop (bullets) - i


    // --- 2. Enemy Attacks vs Player ---
    // Player contact damage (non-ninja enemies)
     for (let i = enemies.length - 1; i >= 0; i--) {
         let enemy = enemies[i];
         if (!enemy) { continue; } // Check exists
         if (enemy.type !== "ninja") { // Ninjas use timed attacks
              let dPlayer = dist(player.x, player.y, enemy.x, enemy.y);
              if (dPlayer < playerHitboxSize / 2 + enemySize / 2) { // Player contact!
                  playerHit(1); // Player takes damage
                  // --- Award Score/Coins for Contact Kill ---
                  let pointsAwarded = enemy.points; let coinsToDrop = enemy.coinDrop;
                  if (typeof pointsAwarded === 'number' && typeof coinsToDrop === 'number' && typeof score === 'number') {
                        score += pointsAwarded;
                        if (hasDoubleCoins) { coinsToDrop *= 2; }
                        let contactX = enemy.x; let contactY = enemy.y;
                        for (let k = 0; k < coinsToDrop; k++) {
                             let coinX = contactX + random(-enemySize / 3, enemySize / 3); let coinY = contactY + random(-enemySize / 3, enemySize / 3);
                             if (typeof coinX === 'number' && typeof coinY === 'number') { droppedCoins.push({ x: coinX, y: coinY, creationTime: millis() }); }
                             else { console.error(`!!! Coin Creation Error (Contact Kill): Invalid coords! x: ${coinX}, y: ${coinY}.`); }
                        }
                        // console.log(`   CONTACT KILL SCORE/COIN OK for Enemy[${i}]. New Score: ${score}`); // Optional Log
                    } else { console.error(`!!! CONTACT REWARD ERROR: Invalid values! points:${pointsAwarded}, coins:${coinsToDrop}, score:${score}`); }
                  // --- End Rewards ---
                  enemies.splice(i, 1); // Remove enemy immediately on contact
                  continue; // Go to next enemy
              }
         }
     } // End player contact loop

     // Enemy bullet hits Player check
     for (let i = bullets.length - 1; i >= 0; i--) {
         let bullet = bullets[i];
         if (!bullet || bullet.source !== 'enemy') { continue; }
         let dPlayerBullet = dist(player.x, player.y, bullet.x, bullet.y);
         if (dPlayerBullet < playerHitboxSize / 2 + bulletSize / 2) {
             playerHit(bullet.damage || 1); // Player takes bullet damage
             bullets.splice(i, 1); // Remove bullet
             break; // Player was hit
         }
     } // End enemy bullet vs player loop


    // --- 3. Enemy Bullets vs Children --- <<<< SECTION 3 ADDED/VERIFIED
    // Check if any enemy bullets hit any allied children
    for (let i = bullets.length - 1; i >= 0; i--) {
         let bullet = bullets[i];
         // Check bullet exists and is specifically from an enemy
         if (!bullet || bullet.source !== 'enemy') { continue; }

         // Check against each child
         for (let j = children.length - 1; j >= 0; j--) {
             let child = children[j];
             if (!child) continue; // Safety check

             // Calculate distance between bullet and child center
             let dChildBullet = dist(child.x, child.y, bullet.x, bullet.y);

             // Check collision distance using child's hitbox and bullet size
             if (dChildBullet < child.hitboxSize / 2 + bulletSize / 2) {
                  // console.log(`Child[${j}] hit by Enemy Bullet[${i}]`); // Optional log
                  child.hp -= bullet.damage; // Reduce child HP

                  // Important: Remove the bullet that hit the child
                  bullets.splice(i, 1);

                  // Note: Actual child removal (if hp <= 0) happens in the handleChildren function
                  break; // Bullet hit a child, stop checking this bullet against other children
             }
         } // End loop through children (j)
         if (!bullets[i]) { continue; } // Safety check before outer loop continues
     } // End loop through bullets (i) for child collision check


    // --- 4. Player vs Coins --- <<<< SECTION 4 ADDED/VERIFIED
     for (let i = droppedCoins.length - 1; i >= 0; i--) {
         let coin = droppedCoins[i];
         // Safety checks
         if (!coin) { continue; }
         if (typeof coin.x !== 'number' || typeof coin.y !== 'number') {
             console.error(`Skipping invalid coin object at index ${i} in pickup check.`);
             continue;
         }

         // Calculate distance and pickup radius
         let dPickup = dist(player.x, player.y, coin.x, coin.y);
         let pickupRadius = playerHitboxSize / 2 + coinSize / 2;

         // Check for pickup collision
         if (dPickup < pickupRadius) {
             // console.log(`--- Coin Pickup Detected! Index: ${i} ---`); // Optional Log
             playerCoins++; // Increment player coins
             droppedCoins.splice(i, 1); // Remove coin from array
             continue; // Skip lifetime check
         }

         // Check coin lifetime for expiry
         if (!hasCoinMagnet && millis() - coin.creationTime > COIN_LIFETIME) {
             droppedCoins.splice(i, 1); // Remove old coin
         } else if (millis() - coin.creationTime > COIN_LIFETIME * 2) {
             // Safety remove very old coins even if magnet active
             droppedCoins.splice(i, 1);
         }
     } // End player vs coin loop


    // ***** FINALLY: Call the enemy cleanup function *****
    removeDeadEnemies();

} // End checkCollisions


// --- Ensure removeDeadEnemies is also present and uses threshold ---
function removeDeadEnemies() {
    const HP_THRESHOLD = 0.01; // Use the same threshold
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].hp <= HP_THRESHOLD) {
            // console.log(`Cleanup: Removing Enemy[${i}] (hp:${enemies[i].hp.toFixed(2)})`); // Optional Log
            enemies.splice(i, 1);
        }
    }
} // End removeDeadEnemies

// --- Helper for Player Taking Damage ---
// --- Helper for Player Taking Damage ---
function playerHit(damageTaken = 1) { // *** ADD damageTaken parameter back ***
    if (gameOver || isPaused) return; // Can't get hit if game over or paused

    playerLives -= damageTaken; // Subtract the specified damage
    // console.log(`Player Hit! Damage: ${damageTaken}. Lives remaining: ${playerLives}`); // Log moved below max()
    playerLives = max(0, playerLives); // Prevent negative lives display
    console.log(`Player Hit! Damage: ${damageTaken}. Lives now: ${playerLives}`);


    if (playerLives <= 0) {
        gameOver = true;
        gameState = 'GAME_OVER';
        console.log("Game Over triggered by playerHit");
    }
} // End playerHit


// ==========================
// === ITEM/PICKUP FUNCTIONS ===
// ==========================
// Draw dropped coins (with safety check)
function drawDroppedItems() {
    fill(255, 223, 0); // Gold color
    noStroke();
    // Loop backwards is safer if we ever need to splice here
    for (let i = droppedCoins.length - 1; i >= 0; i--) {
        let coin = droppedCoins[i];

        // --- ADD THIS SAFETY CHECK ---
        // Check if x or y is not a valid number before drawing
        if (typeof coin.x !== 'number' || typeof coin.y !== 'number') {
            console.error(`ERROR in drawDroppedItems: Skipping coin with invalid coordinates. Index: ${i}, x: ${coin.x}, y: ${coin.y}. Coin object:`, JSON.stringify(coin));
            // Optional: You could remove the bad coin here to prevent repeated errors
            // droppedCoins.splice(i, 1);
            continue; // Skip the ellipse() call for this invalid coin
        }
        // --- END SAFETY CHECK ---

        // If coordinates are valid, draw the ellipse (this was likely line 2233)
        ellipse(coin.x, coin.y, coinSize, coinSize);
    }
} // End drawDroppedItems

// Handle coin lifetime (already included in checkCollisions, could be separated)
// function handleDroppedItems() {
//     for (let i = droppedCoins.length - 1; i >= 0; i--) {
//         if (millis() - droppedCoins[i].creationTime > COIN_LIFETIME) {
//             droppedCoins.splice(i, 1);
//         }
//     }
// } // End handleDroppedItems (Merged into checkCollisions for efficiency)

// ==========================
// === P5.JS SETUP FUNCTION ===
// ==========================
function setup() {
    createCanvas(windowWidth, windowHeight);
    player = { x: width / 2, y: height / 2 };
    imageMode(CENTER); // Set image mode for player/enemy sprites
    ellipseMode(CENTER); // Set ellipse mode globally
    rectMode(CORNER); // Default rect mode
    frameRate(60);
    resetGame(); // Initialize game state
    console.log("Setup Complete. Game Initialized.");
} // End setup


// ==========================
// === P5.JS DRAW FUNCTION ===
// ==========================
function draw() {
    background(50, 50, 80);

    // === Game State Logic ===
    switch (gameState) {
        case 'RUNNING':
            if (!isPaused) {
                handlePlayerMovement();
                handleAttackInput();
                handleBullets();
                handleEnemies();
                handleChildren();
                handleCoinMovement(); // <<< *** ADD THIS CALL ***
                checkCollisions();

                // Check Level Complete Condition
                if (score >= scoreNeededForLevel) {
                     gameState = 'CHOICE';
                     score = 0; // Reset score for the next level choice/store
                     console.log(`Level ${level} Complete! Score target reached.`);
                }
            }
            // --- Drawing Order ---
            drawDroppedItems();
            drawPlayer();
            drawChildren();
            drawEnemies();
            drawBullets();
            drawAttackVisuals();
            drawUI(); // Handles command input drawing too
            drawTemporaryMessage();

            // Only draw pause screen if pause not due to command input
            if (isPaused && !isCommandMode) {
                 drawPauseScreen();
            }
            break; // End RUNNING case

        case 'CHOICE':
            // Draw frozen game state elements
            drawDroppedItems(); drawPlayer(); drawChildren(); drawEnemies(); drawBullets();
            // Draw choice UI on top
            drawChoiceScreen(); drawUI(); // Show UI stats like coins
            break;
        case 'STORE':
            drawStoreScreen(); drawTemporaryMessage();
            break;
        case 'GENERAL_STORE':
            drawGeneralStoreScreen(); drawTemporaryMessage();
            break;
        case 'GAME_OVER':
            drawGameOver();
            break;
        // Add default case?
        // default:
        //     console.error("Unhandled game state:", gameState);
        //     break;
    } // End switch gameState

} // End draw

// ==========================
// === END OF CODE ===
// ==========================

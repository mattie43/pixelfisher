import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, CENTER_X } from "../config/gameConfig";
import Fish from "../entities/Fish";
import gsap from "gsap";
import { FISH_TYPES } from "../config/fishConfig";
import { GameUI } from "../components/GameUI";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.initGameState();
  }

  initGameState() {
    this.fisherman = null;
    this.hook = null;
    this.line = null;
    this.hookSpeed = 2;
    this.fishermanSpeed = 300;
    this.hookStrength = 3;
    this.spools = 2;
    this.isLineBreaking = false;
    this.activeFish = new Set();
    this.score = 0;
    this.scoreText = null;
    this.hookStrengthText = null;
    this.spoolsText = null;
    this.reelSpeedText = null;
    this.movementSpeedText = null;
    this.lastCatchTime = 0;
    this.catchCooldown = 100;
    this.fishSpeedMultiplier = 1;
    this.spawnDelay = 2000;
  }

  preload() {
    // Create temporary textures without adding them to the scene
    const fishermanGraphics = new Phaser.GameObjects.Graphics(this);
    fishermanGraphics.fillStyle(0x00ff00).fillRect(0, 0, 80, 120);
    fishermanGraphics.generateTexture("fisherman", 80, 120);

    // Create rectangular hook
    const hookGraphics = new Phaser.GameObjects.Graphics(this);
    hookGraphics.fillStyle(0xffffff).fillRect(0, 0, 8, 16);
    hookGraphics.generateTexture("hook", 8, 16);

    // Create fish textures for different types
    FISH_TYPES.forEach((fishType) => {
      const fishGraphics = new Phaser.GameObjects.Graphics(this);
      fishGraphics
        .fillStyle(fishType.color)
        .fillRect(0, 0, fishType.size.width, fishType.size.height);
      fishGraphics.generateTexture(
        `fish${fishType.strength}`,
        fishType.size.width,
        fishType.size.height
      );
    });
  }

  create() {
    // Reset game state when scene starts
    this.initGameState();

    // Create UI components
    const gameUI = new GameUI(this);

    // Initialize sway time
    this.swayTime = 0;

    // Create fisherman
    this.fisherman = this.add.sprite(CENTER_X, 80, "fisherman");

    // Create fishing hook
    this.hook = this.add.sprite(
      this.fisherman.x,
      this.fisherman.y + 40,
      "hook"
    );

    // Create the fishing line (a graphics object we'll update)
    this.line = this.add.graphics();

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add ESC key for pause
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.pause();
      this.scene.launch("PauseScene");
    });

    // Enable physics
    this.physics.add.existing(this.fisherman, false);
    this.physics.add.existing(this.hook, false);

    // Set hook collision box to match its visual size exactly
    this.hook.body.setSize(8, 16);
    this.hook.body.setOffset(0, 0);

    // Set custom bounds for fisherman movement
    const leftBound = 230; // 210 (panel width) + 20 padding
    const rightBound = GAME_WIDTH - 150; // 150px padding from right edge for shop button
    this.fisherman.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(
        leftBound,
        0,
        rightBound - leftBound,
        GAME_HEIGHT
      )
    );
    this.fisherman.body.setCollideWorldBounds(true);

    // Remove gravity from both objects
    this.fisherman.body.setGravity(0);
    this.hook.body.setGravity(0);

    // Setup fish spawning
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnFish,
      callbackScope: this,
      loop: true,
    });

    // Create UI panel background
    const panelWidth = 208;
    const panelHeight = 120;
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.7);
    panel.fillRect(10, 10, panelWidth, panelHeight);

    // Add score text
    this.scoreText = gameUI.createText(20, 14, "Score: 0", "28px");

    // Add hook strength text
    this.hookStrengthText = gameUI.createText(
      20,
      42,
      `Hook Strength: ${this.hookStrength}`,
      "18px"
    );

    // Add spools text
    this.spoolsText = gameUI.createText(
      20,
      62,
      `Extra Spools: ${this.spools}`,
      "18px"
    );

    // Add reel speed text
    this.reelSpeedText = gameUI.createText(
      20,
      82,
      `Reel Speed: ${this.hookSpeed}`,
      "18px"
    );

    // Add movement speed text
    this.movementSpeedText = gameUI.createText(
      20,
      102,
      `Fisherman Speed: ${this.fishermanSpeed}`,
      "18px"
    );

    // Add shop button in top right
    // const shopButton = gameUI
    //   .createText(GAME_WIDTH - 20, 20, "SHOP", "32px")
    //   .setOrigin(1, 0)
    //   .setInteractive({ useHandCursor: true })
    //   .setBackgroundColor("#4a9f45")
    //   .setPadding(20, 10);

    const shopButton = gameUI.createBorderedButton(
      GAME_WIDTH - 80,
      40,
      "SHOP",
      "32px",
      "#4a9f45"
    );

    // Add black border
    const border = this.add.graphics();
    const bounds = shopButton.getBounds();
    border.lineStyle(2, 0x000000);
    border.strokeRect(
      bounds.x - 2,
      bounds.y - 2,
      bounds.width + 4,
      bounds.height + 4
    );

    // Add hover effects
    shopButton.on("pointerover", () => {
      shopButton.setBackgroundColor("#5bc455");
      border.setAlpha(1);
    });

    shopButton.on("pointerout", () => {
      shopButton.setBackgroundColor("#4a9f45");
      border.setAlpha(0.8);
    });

    // Handle shop button click
    shopButton.on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("ShopScene", { gameScene: this });
    });

    // Enable debug graphics to see collision boxes
    this.physics.world.createDebugGraphic();
  }

  spawnFish() {
    const fish = new Fish(this);
    this.activeFish.add(fish);

    // Simple overlap check without additional conditions
    this.physics.add.overlap(this.hook, fish, this.handleFishCatch, null, this);
  }

  showFloatingText(x, y, text, color) {
    const gameUI = new GameUI(this);
    const floatingText = gameUI
      .createText(x, y, text, "24px")
      .setOrigin(0.5)
      .setColor(color);

    gsap.to(floatingText, {
      y: y - 100, // Float upward
      alpha: 0, // Fade out
      duration: 1,
      ease: "power1.out",
      onComplete: () => {
        floatingText.destroy();
      },
    });
  }

  handleFishCatch(hook, fish) {
    // Prevent catching during line break or cooldown
    if (
      this.isLineBreaking ||
      this.time.now - this.lastCatchTime < this.catchCooldown
    ) {
      return;
    }

    this.lastCatchTime = this.time.now;

    if (fish.strength <= this.hookStrength) {
      // Successfully caught the fish
      const points = fish.scoreValue;
      this.score += points;
      this.scoreText.setText("Score: " + this.score);

      // Show floating score text
      this.showFloatingText(
        this.hook.x,
        this.hook.y,
        `+${points}`,
        "#98FB98" // Light green
      );

      fish.destroy();
      this.activeFish.delete(fish);
    } else {
      // Line breaks
      this.breakLine();
    }
  }

  breakLine() {
    this.isLineBreaking = true;
    this.hook.setVisible(false);
    this.line.setVisible(false);

    // Decrease spools count
    this.spools--;
    this.spoolsText.setText(`Extra Spools: ${this.spools}`);

    // Show floating spool loss text
    this.showFloatingText(
      this.hook.x,
      this.hook.y,
      "-1 SPOOL",
      "#ff6666" // Light red
    );

    // Check for game over
    if (this.spools < 0) {
      // Clean up active fish
      this.activeFish.forEach((fish) => {
        fish.destroy();
      });
      this.activeFish.clear();

      this.scene.start("GameOverScene", { score: this.score });
      return;
    }

    // Stop any current movement
    this.fisherman.body.setVelocityX(0);

    this.time.delayedCall(1000, () => {
      this.isLineBreaking = false;
      this.hook.setVisible(true);
      this.line.setVisible(true);
      this.hook.y = this.fisherman.y + 40;
    });
  }

  update() {
    // Always allow fisherman to stop moving when keys are released
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.fisherman.body.setVelocityX(0);
    }

    // Only process movement inputs if line isn't breaking
    if (!this.isLineBreaking) {
      // Fisherman movement (left/right) with bounds checking
      if (this.cursors.left.isDown && this.fisherman.x > 230) {
        this.fisherman.body.setVelocityX(-this.fishermanSpeed);
      } else if (
        this.cursors.right.isDown &&
        this.fisherman.x < GAME_WIDTH - 100
      ) {
        this.fisherman.body.setVelocityX(this.fishermanSpeed);
      }

      // Hook movement (up/down)
      if (this.cursors.up.isDown && this.hook.y > this.fisherman.y + 40) {
        this.hook.y -= this.hookSpeed;
      } else if (this.cursors.down.isDown && this.hook.y < GAME_HEIGHT - 50) {
        this.hook.y += this.hookSpeed;
      }
    }

    // Update time for swaying motion
    this.swayTime += 0.02;

    // Hook follows fisherman horizontally with swaying motion
    const swayAmount = 5; // Maximum pixels to sway
    const swaySpeed = 1; // Speed of the sway
    const swayOffset = Math.sin(this.swayTime * swaySpeed) * swayAmount;
    this.hook.x = this.fisherman.x + swayOffset;

    // Update fishing line with swaying motion
    this.line.clear();
    if (!this.isLineBreaking) {
      this.line.lineStyle(2, 0xffffff);
      this.line.beginPath();
      this.line.moveTo(this.fisherman.x, this.fisherman.y);
      this.line.lineTo(this.hook.x, this.hook.y);
      this.line.strokePath();
    }

    // Update active fish
    this.activeFish.forEach((fish) => fish.update());
  }
}

import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../config/gameConfig";
import { GameUI } from "../components/GameUI";

export default class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
    this.startTop = 80;
  }

  create(data) {
    // Store reference to game scene
    this.gameScene = data.gameScene;

    // Create UI components
    const gameUI = new GameUI(this);

    // Create semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Shop title
    gameUI.createText(CENTER_X, this.startTop, "SHOP", "48px").setOrigin(0.5);

    // Current points display
    gameUI
      .createText(
        CENTER_X,
        this.startTop + 50,
        `Points: ${this.gameScene.score}`,
        "32px"
      )
      .setOrigin(0.5);

    // Create buy spool button
    const spoolButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 120,
        "Buy Spool (50000 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 50000 ? "#98FB98" : "#ff6666");

    // Create upgrade hook button
    const hookButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 175,
        "Upgrade Hook (10000 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 10000 ? "#98FB98" : "#ff6666");

    // Create reel speed upgrade button
    const reelButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 230,
        "Upgrade Reel Speed (5000 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 5000 ? "#98FB98" : "#ff6666");

    // Create movement speed upgrade button
    const moveButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 285,
        "Upgrade Movement Speed (7500 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 7500 ? "#98FB98" : "#ff6666");

    // Create fish speed upgrade button
    const fishSpeedButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 340,
        "Increase Fish Speed (3000 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 3000 ? "#98FB98" : "#ff6666");

    // Create spawn timer upgrade button
    const spawnButton = gameUI
      .createBorderedButton(
        CENTER_X,
        this.startTop + 395,
        "Reduce Spawn Timer (4000 points)",
        "24px"
      )
      .setColor(this.gameScene.score >= 4000 ? "#98FB98" : "#ff6666");

    // Create close button
    const closeButton = gameUI.createBorderedButton(
      CENTER_X,
      this.startTop + 450,
      "Close Shop",
      "24px"
    );

    // Button interactions
    spoolButton.on("pointerdown", () => {
      if (this.gameScene.score >= 50000) {
        this.gameScene.score -= 50000;
        this.gameScene.spools++;
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);
        this.gameScene.spoolsText.setText(
          `Extra Spools: ${this.gameScene.spools}`
        );
        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    hookButton.on("pointerdown", () => {
      if (this.gameScene.score >= 10000) {
        this.gameScene.score -= 10000;
        this.gameScene.hookStrength++;
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);
        this.gameScene.hookStrengthText.setText(
          `Hook Strength: ${this.gameScene.hookStrength}`
        );
        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    reelButton.on("pointerdown", () => {
      if (this.gameScene.score >= 5000) {
        this.gameScene.score -= 5000;
        this.gameScene.hookSpeed += 0.5;
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);
        this.gameScene.reelSpeedText.setText(
          `Reel Speed: ${this.gameScene.hookSpeed}`
        );
        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    moveButton.on("pointerdown", () => {
      if (this.gameScene.score >= 7500) {
        this.gameScene.score -= 7500;
        this.gameScene.fishermanSpeed += 50;
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);
        this.gameScene.movementSpeedText.setText(
          `Movement Speed: ${this.gameScene.fishermanSpeed}`
        );
        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    fishSpeedButton.on("pointerdown", () => {
      if (this.gameScene.score >= 3000) {
        this.gameScene.score -= 3000;
        this.gameScene.fishSpeedMultiplier += 0.2;
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);
        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    spawnButton.on("pointerdown", () => {
      if (this.gameScene.score >= 4000) {
        this.gameScene.score -= 4000;
        this.gameScene.spawnDelay = Math.max(
          500,
          this.gameScene.spawnDelay - 200
        );
        this.gameScene.scoreText.setText("Score: " + this.gameScene.score);

        // Update spawn timer
        this.gameScene.spawnTimer.reset({
          delay: this.gameScene.spawnDelay,
          callback: this.gameScene.spawnFish,
          callbackScope: this.gameScene,
          loop: true,
        });

        this.scene.restart({ gameScene: this.gameScene }); // Refresh shop display
      }
    });

    closeButton.on("pointerdown", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });

    // Add hover effects
    [
      spoolButton,
      hookButton,
      reelButton,
      moveButton,
      fishSpeedButton,
      spawnButton,
      closeButton,
    ].forEach((button) => {
      button.on("pointerover", () => {
        button.setBackgroundColor("#5a5a5a");
      });

      button.on("pointerout", () => {
        button.setBackgroundColor("#4a4a4a");
      });
    });
  }
}

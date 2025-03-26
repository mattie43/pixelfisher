import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../config/gameConfig";
import { GameUI } from "../components/GameUI";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create() {
    // Create UI components
    const gameUI = new GameUI(this);

    // Create semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Add PAUSED text
    gameUI
      .createText(CENTER_X, CENTER_Y - 100, "PAUSED", "64px")
      .setOrigin(0.5);

    // Create legend and volume panels
    gameUI.createLegendPanel(20, CENTER_Y - 150);
    gameUI.createVolumePanel(GAME_WIDTH - 270, CENTER_Y - 150);

    // Create buttons at the bottom
    const closeButton = gameUI.createBorderedButton(
      CENTER_X - 100,
      CENTER_Y + 200,
      "CLOSE",
      "32px"
    );

    const menuButton = gameUI.createBorderedButton(
      CENTER_X + 100,
      CENTER_Y + 200,
      "MAIN MENU",
      "32px"
    );

    // Add button functionality
    closeButton.on("pointerdown", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });

    menuButton.on("pointerdown", () => {
      this.scene.stop("GameScene");
      this.scene.start("MainMenu");
    });

    // Add ESC key handler to close pause menu
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });
  }
}

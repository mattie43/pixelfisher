import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../config/gameConfig";
import { GameUI } from "../components/GameUI";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // Create UI components
    const gameUI = new GameUI(this);

    // Add title text
    gameUI
      .createText(CENTER_X, CENTER_Y - 200, "Pixel Fisher", "64px")
      .setOrigin(0.5);

    // Add game description
    const description = [
      "Welcome to Pixel Fisher!",
      "",
      "Use arrow keys to move your fisherman and catch fish.",
      "Each fish has different strength and point values.",
      "Be careful - if a fish is too strong, it will break your line!",
      "Use your spools wisely and upgrade your gear in the shop.",
      "",
      "Good luck, and happy fishing!",
    ];

    description.forEach((line, index) => {
      gameUI
        .createText(CENTER_X, CENTER_Y - 100 + index * 30, line, "20px")
        .setOrigin(0.5);
    });

    // Create legend and volume panels
    gameUI.createLegendPanel(20, CENTER_Y - 150);
    gameUI.createVolumePanel(GAME_WIDTH - 270, CENTER_Y - 150);

    // Add start button
    const startButton = gameUI.createBorderedButton(
      CENTER_X,
      CENTER_Y + 200,
      "START GAME",
      "32px",
      "#4a9f45"
    );

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}

import Phaser from "phaser";
import { CENTER_X, CENTER_Y } from "../config/gameConfig";
import { GameUI } from "../components/GameUI";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data) {
    // Create UI components
    const gameUI = new GameUI(this);

    // Add game over text
    gameUI
      .createText(CENTER_X, CENTER_Y - 100, "GAME OVER", "64px")
      .setOrigin(0.5);

    // Add final score
    gameUI
      .createText(CENTER_X, CENTER_Y, `Final Score: ${data.score}`, "32px")
      .setOrigin(0.5);

    // Add return to menu button
    const menuButton = gameUI.createBorderedButton(
      CENTER_X,
      CENTER_Y + 100,
      "RETURN TO MENU",
      "32px"
    );

    // Handle button click
    menuButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}

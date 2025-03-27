import Phaser from "phaser";
import { CENTER_X, CENTER_Y } from "../config/gameConfig";
import { GameUI } from "../components/GameUI";
import { VolumeConfig } from "../config/volumeConfig";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    // Load the game over sound
    this.load.audio("gameOver", "sounds/game-over.mp3");
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

    // Create the game over sound
    const gameOverSound = this.sound.add("gameOver", {
      volume: VolumeConfig.getVolume("sfx") / 100,
    });

    // Listen for SFX volume changes
    this.events.on(VolumeConfig.VOLUME_CHANGE_EVENT, (type, value) => {
      if (type === "sfx") {
        gameOverSound.setVolume(value / 100);
      }
    });

    // Play the game over sound
    gameOverSound.play();

    // Handle button click
    menuButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}

import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../config/gameConfig";
import { GameUI } from "../components/GameUI";
import { VolumeConfig } from "../config/volumeConfig";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    // Load the button press sound
    this.load.audio("buttonPress", "sounds/pressing-button.mp3");
    // Load the background music
    this.load.audio("bgm", "sounds/bgm.mp3");
  }

  create() {
    // Create UI components
    const gameUI = new GameUI(this);

    // Start the background music
    const bgm = this.sound.add("bgm", {
      loop: true,
      volume: VolumeConfig.getVolume("bgm") / 100,
    });
    bgm.play();

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

    // Create the button press sound
    const buttonSound = this.sound.add("buttonPress", {
      volume: VolumeConfig.getVolume("sfx") / 100,
    });

    // Listen for SFX volume changes
    this.events.on(VolumeConfig.VOLUME_CHANGE_EVENT, (type, value) => {
      if (type === "sfx") {
        buttonSound.setVolume(value / 100);
      }
    });

    startButton.on("pointerdown", () => {
      buttonSound.play();
      this.scene.start("GameScene");
    });
  }
}

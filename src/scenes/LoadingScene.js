import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    // Create loading text
    const loadingText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Loading...",
        {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Specifically wait for Pixelify Sans font to be loaded
    document.fonts.load('1em "Pixelify Sans"').then(() => {
      // Font is loaded, proceed to main menu
      this.scene.start("MainMenu");
    });
  }

  create() {
    // This scene doesn't need create as we're handling everything in preload
  }

  update() {
    // This scene doesn't need update
  }
}

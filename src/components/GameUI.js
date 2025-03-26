import { FISH_TYPES } from "../config/fishConfig";
import { VolumeConfig } from "../config/volumeConfig";

export class GameUI {
  constructor(scene) {
    this.scene = scene;
  }

  createText(x, y, text, fontSize = "20px") {
    return this.scene.add.text(x, y, text, {
      fontSize: fontSize,
      fontFamily: "Pixelify Sans",
      color: "#ffffff",
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#000000",
        blur: 0,
        fill: true,
      },
    });
  }

  createBorderedButton(
    x,
    y,
    text,
    fontSize = "20px",
    backgroundColor = "#4a4a4a"
  ) {
    const button = this.createText(x, y, text, fontSize)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setBackgroundColor(backgroundColor)
      .setPadding(20, 10);

    // Add black border
    const border = this.scene.add.graphics();
    const bounds = button.getBounds();
    border.lineStyle(2, 0x000000);
    border.strokeRect(
      bounds.x - 2,
      bounds.y - 2,
      bounds.width + 4,
      bounds.height + 4
    );

    // Make border follow button
    button.on("pointerover", () => {
      // Create a brighter version of the background color
      const brightColor = this.adjustColorBrightness(backgroundColor, 20);
      button.setBackgroundColor(brightColor);
      border.setAlpha(1);
    });

    button.on("pointerout", () => {
      button.setBackgroundColor(backgroundColor);
      border.setAlpha(0.8);
    });

    return button;
  }

  // Helper method to adjust color brightness
  adjustColorBrightness(color, amount) {
    // Remove the # if present
    color = color.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Adjust each component
    const newR = Math.min(255, r + amount);
    const newG = Math.min(255, g + amount);
    const newB = Math.min(255, b + amount);

    // Convert back to hex
    return (
      "#" +
      newR.toString(16).padStart(2, "0") +
      newG.toString(16).padStart(2, "0") +
      newB.toString(16).padStart(2, "0")
    );
  }

  createLegendPanel(x, y) {
    // Create fish legend panel border
    const legendPanelBorder = this.scene.add.graphics();
    legendPanelBorder.lineStyle(2, 0x000000);
    legendPanelBorder.strokeRect(x - 2, y - 2, 254, 304);

    // Create fish legend panel
    const legendPanel = this.scene.add.graphics();
    legendPanel.fillStyle(0x333333, 0.9);
    legendPanel.fillRect(x, y, 250, 300);

    // Add fish legend title
    this.createText(x + 10, y + 10, "Fish Types:", "24px");

    // Add fish types
    FISH_TYPES.forEach((fish, index) => {
      // Add colored rectangle
      const rect = this.scene.add.graphics();
      rect.fillStyle(fish.color);
      rect.fillRect(x + 10, y + 50 + index * 35, 30, 15);

      // Add text
      this.createText(
        x + 50,
        y + 45 + index * 35,
        `${fish.name} (${fish.scoreValue}pts)`
      );
    });

    return legendPanel;
  }

  createVolumePanel(x, y) {
    // Create volume controls panel border
    const volumePanelBorder = this.scene.add.graphics();
    volumePanelBorder.lineStyle(2, 0x000000);
    volumePanelBorder.strokeRect(x - 2, y - 2, 254, 304);

    // Create volume controls panel
    const volumePanel = this.scene.add.graphics();
    volumePanel.fillStyle(0x333333, 0.9);
    volumePanel.fillRect(x, y, 250, 300);

    // Add volume controls
    this.createVolumeControl("Ambience", x + 20, y + 50);
    this.createVolumeControl("SFX", x + 20, y + 150);

    return volumePanel;
  }

  createVolumeControl(label, x, y) {
    // Add label
    this.createText(x, y, label, "24px");

    // Create volume bar background with border
    const barBg = this.scene.add.graphics();
    barBg.lineStyle(2, 0x000000);
    barBg.strokeRect(x - 2, y + 38, 204, 24);
    barBg.fillStyle(0x666666);
    barBg.fillRect(x, y + 40, 200, 20);

    // Create volume bar (default to 100%)
    const bar = this.scene.add.graphics();
    bar.fillStyle(0x98fb98);
    bar.fillRect(x, y + 40, 200, 20);

    // Create slider handle
    const handle = this.scene.add.graphics();
    handle.lineStyle(2, 0x000000);
    handle.strokeRect(0, 0, 14, 34);
    handle.fillStyle(0xffffff);
    handle.fillRect(1, 1, 12, 32);
    handle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 14, 34),
      Phaser.Geom.Rectangle.Contains
    );
    handle.input.cursor = "grab";

    // Create percentage text (initially hidden)
    const percentageText = this.createText(x + 100, y + 70, "100%", "16px")
      .setOrigin(0.5)
      .setAlpha(0);

    let hidePercentageTimer = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Get initial volume value
    const volumeType = label.toLowerCase();
    const initialVolume = VolumeConfig.getVolume(volumeType);
    const initialX = x + (initialVolume / 100) * 200;
    handle.x = initialX;
    handle.y = y + 33;
    bar.clear();
    bar.fillStyle(0x98fb98);
    bar.fillRect(x, y + 40, initialX - x, 20);

    // Make the bar background interactive
    barBg.setInteractive(
      new Phaser.Geom.Rectangle(x, y + 35, 200, 34),
      Phaser.Geom.Rectangle.Contains
    );

    // Handle click on the bar
    barBg.on("pointerdown", (pointer) => {
      if (!isDragging) {
        const newX = Phaser.Math.Clamp(pointer.x, x, x + 200);
        handle.x = newX;

        // Update bar and percentage
        const percentage = Math.round(((newX - x) / 200) * 100);
        percentageText.setText(`${percentage}%`);
        percentageText.setAlpha(1);

        bar.clear();
        bar.fillStyle(0x98fb98);
        bar.fillRect(x, y + 40, newX - x, 20);

        // Update volume state
        VolumeConfig.updateVolume(volumeType, percentage);
        this.scene.events.emit(
          VolumeConfig.VOLUME_CHANGE_EVENT,
          volumeType,
          percentage
        );
      }
    });

    handle.on("pointerdown", (pointer) => {
      isDragging = true;
      startX = pointer.x - handle.x;
      startY = pointer.y - handle.y;
      handle.input.cursor = "grabbing";
      if (hidePercentageTimer) {
        clearTimeout(hidePercentageTimer);
      }
      percentageText.setAlpha(1);
    });

    this.scene.input.on("pointermove", (pointer) => {
      if (isDragging) {
        const newX = Phaser.Math.Clamp(pointer.x - startX, x, x + 200);
        handle.x = newX;

        // Calculate and update percentage
        const percentage = Math.round(((newX - x) / 200) * 100);
        percentageText.setText(`${percentage}%`);

        // Update bar width
        bar.clear();
        bar.fillStyle(0x98fb98);
        bar.fillRect(x, y + 40, newX - x, 20);

        // Update volume state
        VolumeConfig.updateVolume(volumeType, percentage);
        this.scene.events.emit(
          VolumeConfig.VOLUME_CHANGE_EVENT,
          volumeType,
          percentage
        );
      }
    });

    this.scene.input.on("pointerup", () => {
      if (isDragging) {
        isDragging = false;
        handle.input.cursor = "grab";
        // Set timer to hide percentage after 1 second
        hidePercentageTimer = setTimeout(() => {
          percentageText.setAlpha(0);
        }, 1000);
      }
    });

    return { bar, handle, percentageText };
  }
}

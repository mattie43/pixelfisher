import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/gameConfig";
import { FISH_TYPES } from "../config/fishConfig";

export default class Fish extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    // Select fish type based on spawn chances
    const fishType = Fish.selectRandomFishType();

    // Determine starting position (left or right side)
    const startFromLeft = Math.random() < 0.5;
    const x = startFromLeft ? -50 : GAME_WIDTH + 50;
    const y = Phaser.Math.Between(GAME_HEIGHT * 0.3, GAME_HEIGHT * 0.9);

    // Create the fish sprite with the appropriate texture
    super(scene, x, y, `fish${fishType.strength}`);

    // Store fish properties
    this.fishType = fishType;
    this.strength = fishType.strength;
    this.scoreValue = fishType.scoreValue;

    // Set random speed within the fish type's range
    this.speed =
      Phaser.Math.Between(fishType.speedRange.min, fishType.speedRange.max) *
      scene.fishSpeedMultiplier;

    // Set scale based on fish type
    // this.setScale(fishType.scale);

    // Flip sprite if moving right to left
    this.flipX = !startFromLeft;

    // Set velocity
    this.velocity = startFromLeft ? this.speed : -this.speed;

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set the fish's velocity
    this.body.setVelocityX(this.velocity);

    // Set collision box to match visual size exactly
    this.body.setSize(fishType.size.width, fishType.size.height);
    this.body.setOffset(0, 0);
  }

  // Static method to select a random fish type based on spawn chances
  static selectRandomFishType() {
    const random = Math.random();
    let cumulativeChance = 0;

    for (const fishType of FISH_TYPES) {
      cumulativeChance += fishType.spawnChance;
      if (random < cumulativeChance) {
        return fishType;
      }
    }

    // Fallback to common fish if something goes wrong
    return FISH_TYPES[0];
  }

  update() {
    // Remove fish if it's off screen
    if (
      (this.velocity > 0 && this.x > GAME_WIDTH + 100) ||
      (this.velocity < 0 && this.x < -100)
    ) {
      this.destroy();
    }
  }
}

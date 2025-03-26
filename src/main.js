import "./style.css";
import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import GameScene from "./scenes/GameScene";
import ShopScene from "./scenes/ShopScene";
import GameOverScene from "./scenes/GameOverScene";
import PauseScene from "./scenes/PauseScene";
import { GAME_WIDTH, GAME_HEIGHT } from "./config/gameConfig";
import { VolumeConfig } from "./config/volumeConfig";

// Initialize volume configuration
VolumeConfig.init();

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#0077B6",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainMenu, GameScene, ShopScene, GameOverScene, PauseScene],
  parent: "app",
};

new Phaser.Game(config);

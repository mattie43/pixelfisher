// Volume configuration and state management
export const VolumeConfig = {
  // Default volume values (0-100)
  defaultBGMVolume: 50,
  defaultSFXVolume: 100,

  // Current volume values
  currentBGMVolume: 50,
  currentSFXVolume: 100,

  // Volume change event name
  VOLUME_CHANGE_EVENT: "volumeChange",

  // Initialize volumes from localStorage if available
  init() {
    const savedBGM = localStorage.getItem("bgmVolume");
    const savedSFX = localStorage.getItem("sfXVolume");

    if (savedBGM !== null) {
      this.currentBGMVolume = parseInt(savedBGM);
    }
    if (savedSFX !== null) {
      this.currentSFXVolume = parseInt(savedSFX);
    }
  },

  // Update volume and save to localStorage
  updateVolume(type, value) {
    if (type === "bgm") {
      this.currentBGMVolume = value;
      localStorage.setItem("bgmVolume", value);
      // Update any playing BGM volume
      const game = window.game;
      if (game && game.sound) {
        const bgm = game.sound.get("bgm");
        if (bgm) {
          bgm.setVolume(value / 100);
        }
      }
    } else if (type === "sfx") {
      this.currentSFXVolume = value;
      localStorage.setItem("sfXVolume", value);
    }
  },

  // Get current volume value
  getVolume(type) {
    return type === "bgm" ? this.currentBGMVolume : this.currentSFXVolume;
  },
};

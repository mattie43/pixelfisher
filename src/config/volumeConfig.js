// Volume configuration and state management
export const VolumeConfig = {
  // Default volume values (0-100)
  defaultAmbienceVolume: 50,
  defaultSFXVolume: 100,

  // Current volume values
  currentAmbienceVolume: 50,
  currentSFXVolume: 100,

  // Volume change event name
  VOLUME_CHANGE_EVENT: "volumeChange",

  // Initialize volumes from localStorage if available
  init() {
    const savedAmbience = localStorage.getItem("ambienceVolume");
    const savedSFX = localStorage.getItem("sfXVolume");

    if (savedAmbience !== null) {
      this.currentAmbienceVolume = parseInt(savedAmbience);
    }
    if (savedSFX !== null) {
      this.currentSFXVolume = parseInt(savedSFX);
    }
  },

  // Update volume and save to localStorage
  updateVolume(type, value) {
    if (type === "ambience") {
      this.currentAmbienceVolume = value;
      localStorage.setItem("ambienceVolume", value);
    } else if (type === "sfx") {
      this.currentSFXVolume = value;
      localStorage.setItem("sfXVolume", value);
    }
  },

  // Get current volume value
  getVolume(type) {
    return type === "ambience"
      ? this.currentAmbienceVolume
      : this.currentSFXVolume;
  },
};

class UseMusicController {
    constructor(audioElementId) {
      this.music = document.getElementById(audioElementId);
    }
  
    playMusic() {
      this.music.play().catch((error) => console.log("Error playing music:", error));
    }
  
    pauseMusic() {
      this.music.pause();
    }
  
    toggleMusic(isMusicOn) {
      if (isMusicOn) {
        this.playMusic();
      } else {
        this.pauseMusic();
      }
    }
  }
  
  export default UseMusicController;
  
export default class Tumbras extends Phaser.State {

    preload() {
      this.load.video('cut_scene_tumbras', 'video/cut_scene/tumbras.mp4');
    }
  
    create() {
      let that = this;
      this.game.hideNavigation();
  
      this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
  
      let cutSceneTumbras = this.game.add.video('cut_scene_tumbras');
  
      this.game.videoImageTumbras = cutSceneTumbras.addToWorld(0, 0);
      cutSceneTumbras.play();
      cutSceneTumbras.onComplete.add(onClickNextButton);
  
      this.game.nextTumbrasButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);
  
      this.resize(this.game.width, this.game.height);
      
      function onClickNextButton() {
        cutSceneTumbras.destroy();
        that.game.nextTumbrasButton.destroy();
        that.state.start('ShipEnimies');
        that.game.showNavigation();
      }
    }
  
    resize (x, y) {
      console.log("SCALE MODE CREATE TUMBRAS", x, y);
      var scaleModiferX = x/1920;
      var scaleModiferY = y/1080;
  
      var videoScale = Math.min(scaleModiferX, scaleModiferY);
      this.game.videoImageTumbras.scale.set(videoScale);
  
      this.game.nextTumbrasButton.x = scaleModiferX*1710;
      this.game.nextTumbrasButton.y = scaleModiferY*10;
      this.game.nextTumbrasButton.scale.set(videoScale);
    } 
  }
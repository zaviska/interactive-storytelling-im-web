export default class OrdinaryWorld extends Phaser.State {

  preload() {
    this.load.video('cut_scene_ordinary_world', 'video/cut_scene/ordinary_world.mp4');
  }

  create() {
    let that = this;
    this.game.hideNavigation();

    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

    let cutSceneOrdinaryWorld = this.game.add.video('cut_scene_ordinary_world');
    
    this.game.videoImageOrdinaryWorld = cutSceneOrdinaryWorld.addToWorld(0, 0);
    cutSceneOrdinaryWorld.play();
    cutSceneOrdinaryWorld.onComplete.add(onClickNextButton); 
  
    
    this.game.nextOrdinareWorldButton = this.game.add.button(1710, 10, 'nextButton', onClickNextButton, this, 1, 0, 2);

    this.resize(this.game.width, this.game.height);

    function onClickNextButton() {
      cutSceneOrdinaryWorld.destroy();
      that.game.nextOrdinareWorldButton.destroy();
      that.state.start('Farm');
      that.game.showNavigation();
    }
  }

  resize (x, y) {
    var scaleModiferX = x/1920;
    var scaleModiferY = y/1080;

    var videoScale = Math.min(scaleModiferX, scaleModiferY);
    this.game.videoImageOrdinaryWorld.scale.set(videoScale);

    this.game.nextOrdinareWorldButton.x = scaleModiferX*1710;
    this.game.nextOrdinareWorldButton.y = scaleModiferY*10;
    this.game.nextOrdinareWorldButton.scale.set(videoScale);
  } 
}
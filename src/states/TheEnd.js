export default class TheEnd extends Phaser.State {

    preload() {
      this.load.audio('the_end_sound', 'audio/reward/beautiful-mood_terrasound_de.mp3');
      this.game.load.image('the_end', 'image/the_end_350x110px.png', 350, 110);
      this.load.image('air', 'image/item/blue.png');
    }
  
    create() {
      this.game.hideNavigation();

      this.theEnd = this.add.image(785, 300, 'the_end');

      this.delay = 0;
        for (var i = 0; i < 40; i++) {
            this.air = this.game.add.sprite(-100 + (this.game.world.randomX), 900, 'air');
            this.air.scale.set(this.game.rnd.realInRange(0.1, 0.6));
            this.speed = this.game.rnd.between(4000, 6000);
            this.game.add.tween(this.air).to({ y: -256 }, this.speed, Phaser.Easing.Sinusoidal.InOut, true, this.delay, 1000, false);
            this.delay += 200;
        }
  
      let theEndSound = this.game.add.audio('the_end_sound');
      theEndSound.loopFull();
  
    }
  
  }
import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipShadowEmpireLibrary extends Phaser.State {

    preload() {
        this.load.audio('shadow_empire_sound', 'audio/shadow_empire/forgotten-caves_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.tilemap('map', 'image/tilemap/room_3840px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('air', 'image/item/yellow.png');
        this.load.image('background-airship', 'image/background/airship_room_3840x1080px.png');
    }

    create() {
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.shadowEmpireBackgroundSound = this.game.add.audio('shadow_empire_sound');
        this.shadowEmpireBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 8: DAS SCHATTENREICH <hr>"));
        textBox.addText(new Text("Plötzlich drehte sich der Raum und es strömte Blut in den Raum hinein. Wie ein Nebel bildete sich jetzt eine rote Atmosphäre im Raum. Damian hörte seltsame Schreie und Kettengeräusche. Er sah einige Gefange, die ihn einzelne Zellen eingesperrt waren und von Schattengeister bewacht wurden."));
        textBox.addText(new Text("Damian suchte das goldene Buch, um damit wieder zurückkehren zu können. Allerdings bemerkten ihn ein paar Wächter, die ihn verfolgten."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Berühre das goldene Buch bevor die Wächter dich einholen.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background-airship');
        this.game.world.setBounds(0, 0, 3840, 1080);

        this.delay = 0;
        for (var i = 0; i < 40; i++) {
            this.air = this.game.add.sprite(-100 + (this.game.world.randomX), 600, 'air');
            this.air.scale.set(this.game.rnd.realInRange(0.1, 0.6));
            this.speed = this.game.rnd.between(4000, 6000);
            this.game.add.tween(this.air).to({ y: -256 }, this.speed, Phaser.Easing.Sinusoidal.InOut, true, this.delay, 1000, false);
            this.delay += 200;
        }

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;
        
        this.player = createDamianMagic(this.game);
        function createDamianMagic(game) {
            let player = game.add.sprite(0, 100, 'damian-magic');
            player.scale.set(0.97);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(500, 500, 0, 0);
            player.animations.add('left', [9, 8, 7, 6], 8, true);
            player.animations.add('right', [2, 3, 4, 5], 8, true);
            player.animations.add('shootRight', [1, 0]);
            player.animations.add('shootLeft', [10, 11]);
            return player;
        }

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.forEach(setupInvader, this);

        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explode');

        this.explosions.forEach(setupInvader, this);
        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }     
        function setupInvader(invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('explode');
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.strgKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        if (this.nKey.isDown) {
            this.shadowEmpireBackgroundSound.destroy();
            this.state.start('ShipTestLibraryBack');
        }  

        function destroyObject(weapon, object) {
            weapon.kill();
            object.kill();
            ++this.boxCount;

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(object.body.x, object.body.y);
            explosion.play('explode', 30, false, true);

            this.explosionSound.play("", 0, 5, false, true);
        }
       
        this.game.physics.arcade.collide(this.player, this.layer);


        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
        if (this.game.input.activePointer.isDown || this.strgKey.isDown) {
            var bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.player.x+350, this.player.y+300);
                bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer, 1000);
                this.shootSound.play();
                if (this.facing == 'idleRight') {
                    this.player.animations.play('shootRight');
                    this.facing == "idleRight";
                } else if (this.facing == 'idleLeft') {
                    this.player.animations.play('shootLeft');
                    this.facing == "idleLeft";
                }
            }
        } else if (this.cursors.left.isDown || this.aKey.isDown) {
            this.player.body.velocity.x = -350;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        } else if (this.cursors.right.isDown || this.dKey.isDown) {
            this.player.body.velocity.x = 350;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        } else {
            if (this.facing != 'idleRight' || this.facing != 'idleLeft') {
                this.player.animations.stop();
                if (this.facing == 'left') {
                    this.player.frame = 11;
                    this.facing = 'idleLeft';
                } else if (this.facing == 'right') {
                    this.player.frame = 0;
                    this.facing = 'idleRight';
                }
            }
        }
    }
}
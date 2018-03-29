import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipTestArmoryBack extends Phaser.State {

    preload() {
        this.load.audio('airhsip_test_sound', 'audio/test/dance_of_the_imps_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.game.load.tilemap('map', 'image/tilemap/room_3840px.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.game.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_red_378x510px.png', 378, 510);
        this.game.load.image('background-airship', 'image/background/airship_armory_red_sword_3840x900px.png');
    }

    create() {
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.mage = false;
        this.knight = true;
        let textBox = this.game.textBox;

        this.airshipTestBackgroundSound = this.game.add.audio('airhsip_test_sound');
        this.airshipTestBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 9: SIR LORCAN'S RÜCKKEHR <hr>"));
        textBox.addText(new Text("Nachdem Damian in letzter Minute zum goldenen Schwert griff, verschwand die rote Atmosphäre und der Raum drehte sich erneut zurück in die alte Dimension."));
        textBox.addText(new Text("Zunächst erleichtert über die Rückkehr musste Damian jedoch feststellen, dass das goldene Schwert anfing zu bluten. Damian versuchte das Blut zu entfernen, aber das Schwert hörte nicht auf zu bluten..."));
        textBox.addText(new Text("Doch plötzlich trat Kapitän Sir Lorcan in die Waffenkammer ein... "));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Spreche mit Sir Lorcan.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 900, 'background-airship');
        this.game.world.setBounds(0, 0, 3840, 900);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;

        this.lorcan = this.game.add.sprite(0, 300, 'lorcan');
        this.lorcan.frame = 5;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(378, 510, 0, 0);
        this.lorcanTalked = false;
        this.lorcanTalkFText = false;
        this.lorcanMoveSpeed = 3000;
        this.lorcanMovePosition = 1200;
        
        this.player = createDamianSword(this.game);
        function createDamianSword(game) {
            let player = game.add.sprite(1500, 200, 'damian-sword');
            player.scale.set(0.75);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(610, 880, 0, 0);
            player.animations.add('left', [10, 11, 12, 13], 8, true);
            player.animations.add('right', [16, 17, 18, 19], 8, true);
            player.animations.add('slashRight', [5, 6, 7, 8, 9], 16 );
            player.animations.add('slashLeft', [4, 3, 2, 1, 0], 16 );
            return player;
        }
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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

        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        if (this.nKey.isDown) {
            this.airshipTestBackgroundSound.destroy();
            this.state.start('ShipShadowEmpireCell');
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
        function slashObject(player, object) {
            object.kill();
            ++this.boxCount;

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(object.body.x, object.body.y);
            explosion.play('explode', 30, false, true);

            this.explosionSound.play("", 0, 5, false, true);
        }

        if (this.lorcan.x === 0) {
            this.game.add.tween(this.lorcan).to( { x: +this.lorcanMovePosition }, this.lorcanMoveSpeed, Phaser.Easing.Linear.None, true);
            this.lorcan.animations.add('right', [6, 7, 8, 9], 8, true);
            this.lorcan.animations.play('right');
        } else if (this.lorcan.x === this.lorcanMovePosition) {
            this.lorcan.animations.stop();
            this.lorcan.frame = 5;
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.lorcan, this.layer);

        //this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

        this.player.body.velocity.x = 0;
        
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }

        if (this.game.input.activePointer.isDown) {
            if(this.mage === true) {
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
            } else if(this.knight === true) {
                this.swordSound.play();
                this.game.physics.arcade.overlap(this.player, this.box1, slashObject, null, this);
                this.game.physics.arcade.overlap(this.player, this.box2, slashObject, null, this);
                this.game.physics.arcade.overlap(this.player, this.box3, slashObject, null, this);
                if (this.facing == 'idleRight' || this.facing == 'right') {
                    this.player.animations.play('slashRight');
                    this.facing == "idleRight";
                } else if (this.facing == 'idleLeft' || this.facing == 'left') {
                    this.player.animations.play('slashLeft');
                    this.facing == "idleLeft";
                }
            }
        } else if (this.cursors.left.isDown || this.aKey.isDown) {
            this.player.body.velocity.x = -350;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown || this.dKey.isDown) {
            this.player.body.velocity.x = 350;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        } else {
            if (this.facing != 'idleRight' || this.facing != 'idleLeft') {
                this.player.animations.stop();
                if (this.knight === true) {
                    if (this.facing == 'left') {
                        this.player.frame = 14;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 15;
                        this.facing = 'idleRight';
                    }
                } else if (this.mage === true) {
                    if (this.facing == 'left') {
                        this.player.frame = 11;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 0;
                        this.facing = 'idleRight';
                    }
                } else {
                    if (this.facing == 'left') {
                        this.player.frame = 4;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 5;
                        this.facing = 'idleRight';
                    }
                }
            }
        }
    
    }

}
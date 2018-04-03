import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class FarmBack extends Phaser.State {

    preload() {
        this.load.audio('farm_sound', 'audio/farm/piano_rain_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.tilemap('map', 'image/tilemap/farm.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.load.image('tamo', '/image/characters/tamo/tamo_140x270.png', 140, 270);
        this.load.spritesheet('darcono', 'image/characters/darconos/darconos_400x620.png', 400, 620);
        this.load.spritesheet('darcono-baby', 'image/characters/darconos/darcono_baby_280x500.png', 280, 500);
        this.load.image('background', 'image/background/house_farm_airship_3840x900px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.facing = 'left';
        this.jumpTimer = 0;

        this.farmBackgroundSound = this.game.add.audio('farm_sound');
        this.farmBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');

        let textBox = this.game.textBox;
        textBox.addText(new Text("KAPITEL 13: DIE HEIMREISE <hr>"));
        textBox.addText(new Text("Damian war wieder zurück auf der Darcono Farm und freute sich auf seine Familie, auch wenn er ein wenig Angst vor der Reaktion seines Vaters hatte... "));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Spreche mit deinem Vater Tamo.</i></span>"));

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 900, 'background');
        this.game.world.setBounds(0, 0, 3840, 900);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.map.setCollisionBetween(1,4); 

        this.game.physics.arcade.gravity.y = 250;

        this.darconoOne = this.game.add.sprite(3200, 500, 'darcono');
        this.game.physics.enable(this.darconoOne, Phaser.Physics.ARCADE);
        this.darconoOne.body.collideWorldBounds = true;
        this.darconoOne.scale.set(0.6);

        this.darconoTwo = this.game.add.sprite(3500, 500, 'darcono');
        this.game.physics.enable(this.darconoTwo, Phaser.Physics.ARCADE);
        this.darconoTwo.body.collideWorldBounds = true;
        this.darconoTwo.scale.set(0.6);

        this.darconoThree = this.game.add.sprite(3600, 500, 'darcono');
        this.game.physics.enable(this.darconoThree, Phaser.Physics.ARCADE);
        this.darconoThree.body.collideWorldBounds = true;
        this.darconoThree.scale.set(0.6);
        this.darconoThree.body.bounce.set(1);

        this.darconoBabyOne = this.game.add.sprite(3400, 600, 'darcono-baby');
        this.game.physics.enable(this.darconoBabyOne, Phaser.Physics.ARCADE);
        this.darconoBabyOne.body.collideWorldBounds = true;
        this.darconoBabyOne.scale.set(0.4);
        this.darconoBabyOne.body.bounce.set(1);

        this.darconoBabyTwo = this.game.add.sprite(3500, 680, 'darcono-baby');
        this.game.physics.enable(this.darconoBabyTwo, Phaser.Physics.ARCADE);
        this.darconoBabyTwo.body.collideWorldBounds = true;
        this.darconoBabyTwo.scale.set(0.4);

        this.tamo = this.game.add.sprite(420, 600, 'tamo');
        this.game.physics.enable(this.tamo, Phaser.Physics.ARCADE);
        this.tamo.body.collideWorldBounds = true;
        this.tamo.body.setSize(140, 270, 0, 0);
        this.tamoTalked = false;
        this.tamoTalkFText = false;

        function createDamianSword(game) {
            let player = game.add.sprite(2500, 300, 'damian-sword');
            player.scale.set(0.4);
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
        function createDamianMagic(game) {
            let player = game.add.sprite(2500, 300, 'damian-magic');
            player.scale.set(0.55);
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
        if (this.game.knight === true) {
            this.player = createDamianSword(this.game);
        } else {
            this.game.mage = true;
            this.player = createDamianMagic(this.game);
        }

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
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.strgKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    }

    update() {
        let textBox = this.game.textBox;
        let that = this;

        if (this.nKey.isDown) {
            this.farmBackgroundSound.destroy();
            this.state.start('TheEnd');
        }
      
        var style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        function talkToTamo(player, tamo) {
            if (this.fKey.isDown && this.tamoTalked === false) {
                this.tamoTalked = true;
                let tamoPerson = new Person("Tamo Black", "tamo");
                window.startTheEnd = function() {
                    that.farmBackgroundSound.destroy();
                    that.state.start('TheEnd');
                }
                let readyAnswer = [
                    new Answer("Abreisen", "startTheEnd"),
                ];
                this.game.textBox.addText(new Dialog("Damian...! Wo warst du die ganze Zeit?! Ich habe mir solche Sorgen gemacht! Wie siehst du denn jetzt aus, warum hast du diese Rüstung an?!", tamoPerson));
                this.game.textBox.addText(new Text("Damian entschuldigte sich für seine Flucht und erzählte ihm voller Begeisterung von seiner Reise, seinen Kämpfen und dass er zum Luftritter geschlagen wurde. Obwohl Damian's Vater gegen die Ausbildung zum Luftritter war, ist er nun richtig stolz auf seinen Sohn und schenkte ihm einen Darcono, welcher ihn auf seinen Reisen begleiten soll. Außerdem erfuhr Damian, dass seine Schwester Lina stattdessen die Darcono Farm übernehmen wird. Damian verbrachte noch den ganzen Abend mit seiner Familie bis es wieder Zeit wurde Abschied zu nehmen. Denn das Luftschiff wartete bereits auf den Luftritter Damian Black."));
                this.game.textBox.addText(new Decision(readyAnswer))
            } else if (this.tamoTalkFText === false) {
                this.tamoTalkFText = true;
                this.TamoText = this.game.add.text(this.tamo.x, this.tamo.y-50, 'Drücke F: Sprechen', style);
            }
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

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.tamo, this.layer);
        this.game.physics.arcade.collide(this.darconoOne, this.layer);
        this.game.physics.arcade.collide(this.darconoTwo, this.layer);
        this.game.physics.arcade.collide(this.darconoThree, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyOne, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyTwo, this.layer);
        
        let overlapTamo = this.game.physics.arcade.overlap(this.player, this.tamo, talkToTamo, null, this);

        if (overlapTamo === false && this.tamoTalkFText === true) {
            this.TamoText.destroy();
            this.tamoTalkFText = false;
            this.tamoTalked = false;
        }

        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
        if (this.game.input.activePointer.isDown || this.strgKey.isDown) {
            if(this.game.mage === true) {
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
            } else if(this.game.knight === true) {
                this.swordSound.play();
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
                if (this.game.knight === true) {
                    if (this.facing == 'left') {
                        this.player.frame = 14;
                        this.facing = 'idleLeft';
                    } else if (this.facing == 'right') {
                        this.player.frame = 15;
                        this.facing = 'idleRight';
                    }
                } else if (this.game.mage === true) {
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
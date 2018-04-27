import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipReward extends Phaser.State {

    preload() {
        this.load.audio('airhsip_reward_sound', 'audio/reward/beautiful-mood_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.load.spritesheet('kian', 'image/characters/kian/kian_378x510px.png', 378, 510);
        this.load.tilemap('map', 'image/tilemap/room_1920px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('background-airship', 'image/background/airship_room_1920x900px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.airshipRewardBackgroundSound = this.game.add.audio('airhsip_reward_sound');
        this.airshipRewardBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 12: SIR KIANS ERLÖSUNG <hr>"));
        textBox.addText(new Text("Nachdem das Schattenreich vollkommen verschwunden war, befand sich Damian wieder in einem Raum des Luftschiffs. Am Ende des Raums erwartete ihn ein Luftritter, den Damian bisher noch nie auf dem Luftschiff gesehen hatte. Dieser unbekannte Luftritter bat Damian zu sich."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Spreche mit dem unbekannten Luftritter.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 1920, 900, 'background-airship');
        this.game.world.setBounds(0, 0, 1920, 900);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;

        this.kian = this.game.add.sprite(1550, 300, 'kian');
        this.game.physics.enable(this.kian, Phaser.Physics.ARCADE);
        this.kian.body.bounce.y = 0.2;
        this.kian.body.collideWorldBounds = true;
        this.kian.body.setSize(378, 510, 0, 0);
        this.kianTalked = false;
        this.kianTalkFText = false;

        function createDamianSword(game) {
            let player = game.add.sprite(0, 100, 'damian-sword');
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
        /*if (this.nKey.isDown) {
            this.airshipRewardBackgroundSound.destroy();
            this.state.start('RoadBack');
        }*/

        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.kian, this.layer);

        let overlapKian = this.game.physics.arcade.overlap(this.player, this.kian, talkToKian, null, this);

        if (overlapKian === false && this.kianTalkFText === true) {
            this.kianText.destroy();
            this.kianTalkFText = false;
            this.talkToKian = false;
        }

        function talkToKian() {
            if (this.fKey.isDown && this.kianTalked === false) {
                this.kianTalked = true;
                window.goHome = function() {
                    that.airshipRewardBackgroundSound.destroy();
                    that.state.start('RoadBack');
                }
                let yesAnswer = [
                    new Answer("Ja, ich bin bereit.", "goHome"),
                ];
                window.answerName = function() {
                    that.game.textBox.addText(new Dialog("Damian Black, wenn ich mich vorstellen darf, ich bin Sir Kian, der richtige Kapitän der Black Air Knights. Der Kapitän, denn du hier kennengelernt hattest, war in Wirklichkeit ein Anführer der Schattengeister, der seine Gestalt verändert hatte, um junge Leute, wie dich, zu täuschen und für seine Zwecke zu missbrauchen. Sir Lorcan hatte unsere ganze Besatzung im Schattenreich gefangen genommen und dieses königliche Luftschiff übernommen. Damian, du hast mit deiner Heldentat wirklich bewiesen, dass du eines Luftritter würdig bist. Aus Dankbarkeit und zu Ehren möchte ich dich zum Luftritter schlagen. Du gehörst ab sofort zum festen Bestandteil der könglichen Luftritter. Gibt es noch etwas was ich für dich tun kann, bevor wir zu unserem Alltag der Luftritter zurück kehren?", kianPerson));
                    that.game.textBox.addText(new Dialog("Danke Kapitän Sir Kian für diese Ehre. Ich bin sehr glücklich, dass ich dem Königreich Livania dienen kann. Und ja, ich hätte nur eine Bitte, könnte ich meine Familie noch einmal sehen, bevor wir weiter reisen?", damianPerson));
                    that.game.textBox.addText(new Dialog("Nichts lieber als das, Damian. Wir können sofort aufbrechen. Bist du bereit?", kianPerson));
                    that.game.textBox.addText(new Decision(yesAnswer));
                }
                let nameDamian = [
                    new Answer("Mein Name ist Damian Black.", "answerName"),
                ];
                let kianPerson = new Person("Sir Kian", "kian");
                let damianPerson = new Person("Damian Black", "damian");
                this.game.textBox.addText(new Dialog("Danke, dass du uns von dem Fluch der Schattengeister befreit hast. Wie heißt du denn, mein Junge?", kianPerson));
                this.game.textBox.addText(new Decision(nameDamian));
            } else if (this.kianTalkFText === false) {
                this.kianTalkFText = true;
                this.kianText = this.game.add.text(this.kian.x, this.kian.y-50, 'Drücke F: Sprechen', style);
            }
        }

        this.player.body.velocity.x = 0;
        if (this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {
                this.player.body.velocity.y = -250;
                this.jumpTimer = this.game.time.now + 750;
        }
        if (this.game.input.activePointer.isDown || this.strgKey.isDown) {
            if (this.game.mage === true) {
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
            } else if (this.game.knight === true) {
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
        } else if (this.cursors.right.isDown || this.dKey.isDown) {
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
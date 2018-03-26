import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class Ship extends Phaser.State {

    preload() {
        this.load.audio('airhsip_sound', 'audio/airship/fantastic_journey_terrasound_de.mp3');
        this.load.audio('fight_tutorial_sound', 'audio/fight_tutorial/liquid-energy_terrasound_de.mp3');
        this.load.audio('box_sound', 'audio/sound_effects/appear/appear.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('sword_sound', 'audio/sound_effects/sword/sword_swing.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.game.load.tilemap('map', 'image/tilemap/room_airship.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian_amulet', 'image/characters/damian/damian_amulet_room_210x495px.png', 210, 495);
        this.game.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_300x500px.png', 500, 500);
        this.game.load.spritesheet('damian-sword', 'image/characters/damian/damian_swordAttackAndWalk_610x880px.png', 610, 880);
        this.game.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_378x510px.png', 378, 510);
        this.game.load.image('background-airship', 'image/background/airship_room_3840x1080px.png');
        this.game.load.image('bullet', 'image/bullet/magicBullet_100x100.png', 100, 100);
        this.game.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.game.load.image('box', 'image/item/chest_100x100.png', 100, 100);
    }

    create() {
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.mage = false;
        this.knight = false;
        this.roleChose = false;
        this.boxesDestroyed = false;
        this.lorcanTalked = false;
        this.lorcanSecondTalked = false;
        this.lorcanThirdTalked = false;
        this.lorcanTalkFText = false;
        let textBox = this.game.textBox;

        this.airshipBackgroundSound = this.game.add.audio('airhsip_sound');
        this.airshipBackgroundSound.loopFull();
        this.fightTutorialBackgroundSound = this.game.add.audio('fight_tutorial_sound');
        this.shootSound = this.game.add.audio('shoot_sound');
        this.swordSound = this.game.add.audio('sword_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
        this.boxSound = this.game.add.audio('box_sound');
  
        textBox.addText(new Text("KAPITEL 4: DIE ANKUNFT AUF DEM LUFTSCHIFF <hr>"));
        textBox.addText(new Text("Nachdem Damian es geschafft hatte, sich unbemerkt aus dem Haus zu schleichen, stieg er in das Luftschiff der Black Air Knights ein."));
        textBox.addText(new Text("Im Luftschiff erwartete und begrüßte ihn Kapitän Sir Lorcan."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Spreche mit Sir Lorcan. Nachdem du deine Ausbildungsklasse gewählt hast, musst du eine Kampfübung absolvieren.</i></span>"));
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background-airship');
        this.game.world.setBounds(0, 0, 3840, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);

        this.game.physics.arcade.gravity.y = 500;

        this.box1 = this.game.add.sprite(2610, 200, 'box');
        this.game.physics.enable(this.box1, Phaser.Physics.ARCADE);
        this.box1.body.collideWorldBounds = true;
        this.box1.body.bounce.set(1);

        this.box2 = this.game.add.sprite(3060, 0, 'box');
        this.game.physics.enable(this.box2, Phaser.Physics.ARCADE);
        this.box2.body.collideWorldBounds = true;
        this.box2.body.bounce.set(1);

        this.box3 = this.game.add.sprite(3505, 300, 'box');
        this.game.physics.enable(this.box3, Phaser.Physics.ARCADE);
        this.box3.body.collideWorldBounds = true;
        this.box3.body.bounce.set(1);

        this.lorcan = this.game.add.sprite(1000, 300, 'lorcan');
        //this.lorcan.scale.set(2);
        this.lorcan.frame = 4;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(378, 510, 0, 0);
        
        this.player = createDamian(this.game);
        function createDamian(game) {
            let player = game.add.sprite(0, 300, 'damian_amulet');
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(210, 495, 0, 0);
            player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
            player.animations.add('right', [5, 6, 7, 8, 9], 8, true);
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

       /*
        this.boxgroup = this.game.add.group();
        this.boxgroup.enableBody = true;
        this.boxgroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.boxgroup.createMultiple(5, 'box', [0, 1, 2, 4], true);
        this.boxgroup.align(100,-40,100, 10);
        this.boxgroup.x = 2000;
        this.boxgroup.y = 400;
        this.boxgroup.body.collideWorldBounds = true;
        this.boxgroup.body.gravity.x = game.rnd.integerInRange(-50, 50);
        this.boxgroup.body.gravity.y = 100 + Math.random() * 100;
        this.boxgroup.body.bounce.setTo(0.9, 0.9);
        */

        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

        function setupTrackSprite(weapon) {
            weapon.trackSprite(this.player, 0, 0, true);
        }
                
        function setupInvader(invader) {
            invader.anchor.x = -0.5;
            invader.anchor.y = 2.2;
            invader.animations.add('explode');
        }
        this.boxCount = 0;
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

        function collectItem(player, item) {
            item.kill();
        }
        if (this.nKey.isDown) {
            this.airshipBackgroundSound.destroy();
            this.fightTutorialBackgroundSound.destroy();
            this.state.start('ToBeContinued');
        }  
        function createDamianMagic(game, x, y) {
            that.mage = true;
            that.knight = false;
            that.roleChose = true;
            let player = game.add.sprite(x, y, 'damian-magic');
            player.scale.set(0.97);
            game.camera.follow(player);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            player.body.setSize(300, 500, 0, 0);
            player.animations.add('left', [9, 8, 7, 6], 8, true);
            player.animations.add('right', [2, 3, 4, 5], 8, true);
            player.animations.add('shootRight', [1, 0]);
            player.animations.add('shootLeft', [10, 11]);
            return player;
        }
        function createDamianSword(game, x, y) {
            that.knight = true;
            that.mage = false;
            that.roleChose = true;
            let player = game.add.sprite(x, 100, 'damian-sword');
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
        function talkToLorcan(player, lorcan) {
            if (this.fKey.isDown && this.lorcanTalked === false && this.roleChose === false) {
                this.lorcanTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                let tamoPerson = new Person("Tamo Black", "tamo");
                window.beAMage = function() {
                    that.airshipBackgroundSound.destroy();
                    that.fightTutorialBackgroundSound.loopFull();
                    let x = that.player.x;
                    let y = that.player.y;
                    that.player.destroy();
                    that.player = createDamianMagic(that.game, x, y);
                    textBox.addText(new Text("Du bist jetzt ein Magier."));
                    textBox.addText(new Dialog("Du möchtest also ein Magier werden, eine gute Wahl. <br> Nun sollst du deine neue Waffe ausprobieren. Hier deine erste Aufgabe: <br> <i> Siehst du die drei Truhen im nächsten Raum? Ich möchte, dass du sie alle zerstörst. Komme zu mir, wenn du damit fertig bist. </i>", lorcanPerson));
                }
                window.beAKnight = function() {
                    that.airshipBackgroundSound.destroy();
                    that.fightTutorialBackgroundSound.loopFull();
                    let x = that.player.x;
                    let y = that.player.y;
                    that.player.destroy();
                    that.player = createDamianSword(that.game, x, y);
                    that.facing = 'right'; // bugfix
                    textBox.addText(new Text("Du bist jetzt ein Schwertkämpfer."));
                    textBox.addText(new Dialog("Du möchtest also ein Schwertkämpfer werden, eine gute Wahl. Ich wählte einst auch die Schwertkunst. <br> Nun sollst du deine neue Waffe ausprobieren. Hier deine erste Aufgabe: <br> <i> Siehst du die drei Truhen im nächsten Raum? Ich möchte, dass du sie alle zerstörst. Komme zu mir, wenn du damit fertig bist. </i>", lorcanPerson));
                }
                let role = [
                    new Answer("Ein Schwertkämpfer.", "beAKnight"),
                    new Answer("Ein Magier.", "beAMage")
                ];
                this.game.textBox.addText(new Dialog("Willkommen an Bord, Damian! Ich bin Sir Lorcan, Kapitän der Black Air Knights. <br> Es freut mich, dass du dich für uns entschieden hast. Deine Ausbildung soll noch heute beginnen. Möchtest du ein <i>Schwertkämpfer</i> oder ein <i>Magier</i> sein?", lorcanPerson));
                this.game.textBox.addText(new Decision(role));
            } else if (this.fKey.isDown && this.lorcanSecondTalked === false && this.roleChose === true) {
                this.lorcanSecondTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                window.loadBoxes = function () {
                    that.boxSound.play();
                    textBox.addText(new Dialog("Ok, die Truhen sind wieder da. Viel Erfolg!", lorcanPerson));

                    that.box1 = that.game.add.sprite(2610, 200, 'box');
                    that.game.physics.enable(that.box1, Phaser.Physics.ARCADE);
                    that.box1.body.collideWorldBounds = true;
                    that.box1.body.bounce.set(1);

                    that.box2 = that.game.add.sprite(3060, 0, 'box');
                    that.game.physics.enable(that.box2, Phaser.Physics.ARCADE);
                    that.box2.body.collideWorldBounds = true;
                    that.box2.body.bounce.set(1);

                    that.box3 = that.game.add.sprite(3505, 300, 'box');
                    that.game.physics.enable(that.box3, Phaser.Physics.ARCADE);
                    that.box3.body.collideWorldBounds = true;
                    that.box3.body.bounce.set(1);
                }
                window.startToBeContinued = function () {
                    that.airshipBackgroundSound.destroy();
                    that.fightTutorialBackgroundSound.destroy();
                    that.game.hideNavigation();
                    that.state.start('ToBeContinued');
                }
                let repeatTask = [
                    new Answer("Ja, ich möchte diese Aufgabe wiederholen.", "loadBoxes"),
                    new Answer("Nein, das reicht.", "startToBeContinued")
                ];
                window.noAnswer = function() {
                    that.lorcanSecondTalked = false;
                    textBox.addText(new Dialog("Ok, viel Erfolg, Damian!", lorcanPerson));
                }
                window.checkBox = function() {
                    if (that.boxCount >= 3) {
                        that.boxesDestroyed = true;
                        textBox.addText(new Dialog("Sehr gut, Damian! Du hast deine erste Aufgabe erfolgreich abgeschlossen. <br> Möchtest du diese Übung wiederholen?", lorcanPerson));
                        textBox.addText(new Decision(repeatTask));
                    } else {
                        that.lorcanSecondTalked = false;
                        textBox.addText(new Dialog("Netter Versuch, Damian... du musst <i>alle</i> Kisten zerstören!", lorcanPerson));
                    }
                }
                let task = [
                    new Answer("Noch nicht.", "noAnswer"),
                    new Answer("Ich habe alle Kisten zerstört.", "checkBox")
                ];
                this.game.textBox.addText(new Dialog("Hast du alle Kisten zerstört?", lorcanPerson));
                this.game.textBox.addText(new Decision(task));
            } else if (this.fKey.isDown && this.lorcanThirdTalked === false && this.boxesDestroyed === true) {
                this.lorcanSecondTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                window.loadBoxes = function () {
                    that.boxSound.play();
                    that.lorcanThirdTalked = false;
                    textBox.addText(new Dialog("Ok, die Truhen sind wieder da. Viel Erfolg!", lorcanPerson));

                    that.box1 = that.game.add.sprite(2610, 200, 'box');
                    that.game.physics.enable(that.box1, Phaser.Physics.ARCADE);
                    that.box1.body.collideWorldBounds = true;
                    that.box1.body.bounce.set(1);

                    that.box2 = that.game.add.sprite(3060, 0, 'box');
                    that.game.physics.enable(that.box2, Phaser.Physics.ARCADE);
                    that.box2.body.collideWorldBounds = true;
                    that.box2.body.bounce.set(1);

                    that.box3 = that.game.add.sprite(3505, 300, 'box');
                    that.game.physics.enable(that.box3, Phaser.Physics.ARCADE);
                    that.box3.body.collideWorldBounds = true;
                    that.box3.body.bounce.set(1);
                }
                window.startToBeContinued = function () {
                    that.airshipBackgroundSound.destroy();
                    that.fightTutorialBackgroundSound.destroy();
                    that.game.hideNavigation();
                    that.state.start('ToBeContinued');
                }
                let repeat = [
                    new Answer("Nein, ich möchte weiter trainieren.", "loadBoxes"),
                    new Answer("Ja, das reicht.", "startToBeContinued")
                ];
                this.game.textBox.addText(new Dialog("Na, genug trainiert?", lorcanPerson));
                this.game.textBox.addText(new Decision(repeat));
            } else if (this.lorcanTalkFText === false) {
                this.lorcanTalkFText = true;
                this.lorcanText = this.game.add.text(this.lorcan.x, this.lorcan.y-50, 'Drücke F: Sprechen', style);
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
        this.game.physics.arcade.collide(this.lorcan, this.layer);
        this.game.physics.arcade.collide(this.box1, this.layer);
        this.game.physics.arcade.collide(this.box2, this.layer);
        this.game.physics.arcade.collide(this.box3, this.layer);

        this.game.physics.arcade.overlap(this.bullets, this.box1, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.box2, destroyObject, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.box3, destroyObject, null, this);
        let overlapLorcan = this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

        if (overlapLorcan === false && this.lorcanTalkFText === true) {
            this.lorcanText.destroy();
            this.lorcanTalkFText = false;
            this.talkToLorcan = false;
        }
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
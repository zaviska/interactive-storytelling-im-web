import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipTestLibraryBack extends Phaser.State {

    preload() {
        this.load.audio('airhsip_test_sound', 'audio/test/dance_of_the_imps_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_red_378x510px.png', 378, 510);
        this.load.tilemap('map', 'image/tilemap/room_3840px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('background-airship', 'image/background/airship_library_red_book_3840x900px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.airshipTestBackgroundSound = this.game.add.audio('airhsip_test_sound');
        this.airshipTestBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 8: SIR LORCAN'S RÜCKKEHR <hr>"));
        textBox.addText(new Text("Nachdem Damian in letzter Minute zum goldenen Buch griff, verschwand die rote Atmosphäre und der Raum drehte sich erneut zurück in die alte Dimension."));
        textBox.addText(new Text("Zunächst erleichtert über die Rückkehr musste Damian jedoch feststellen, dass das goldene Buch anfing zu bluten. Damian versuchte das Blut zu entfernen, aber das Buch hörte nicht auf zu bluten..."));
        textBox.addText(new Text("Doch plötzlich trat Kapitän Sir Lorcan in die Bibliothek ein... "));
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

        this.player = createDamianMagic(this.game);
        function createDamianMagic(game) {
            let player = game.add.sprite(1500, 200, 'damian-magic');
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
            this.airshipTestBackgroundSound.destroy();
            this.state.start('ShipShadowEmpireCell');
        }*/

        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;

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

        let overlapLorcan = this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

        if (overlapLorcan === false && this.lorcanTalkFText === true) {
            this.lorcanText.destroy();
            this.lorcanTalkFText = false;
            this.talkToLorcan = false;
        }

        function talkToLorcan() {
            if (this.fKey.isDown && this.lorcanTalked === false) {
                this.lorcanTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                window.truthAnswer = function() {
                    that.lorcanTalked = false;
                    textBox.addText(new Dialog("Ich bin sehr enttäuscht von dir. Du hast gegen die Regel verstoßen, jetzt muss ich dich verbannen!", lorcanPerson));
                    textBox.addText(new Decision(begAnswer1));
                }
                window.lieAnswer = function() {
                    that.lorcanTalked = false;
                    textBox.addText(new Dialog("Netter Versuch, Kleiner! Ich weiß, dass du lügst!", lorcanPerson));
                    textBox.addText(new Decision(begAnswer2));
                }
                window.startCutSceneShipShadowEmpireCell = function() {
                    that.airshipTestBackgroundSound.destroy();
                    that.state.start('ShipShadowEmpireCell');
                }
                let begAnswer1 = [
                    new Answer("Bitte verschone mich!", "startCutSceneShipShadowEmpireCell"),
                    new Answer("Es war ein Unfall, ich bin gestolpert und habe ausversehen das Buch berührt.", "lieAnswer")
                ];
                let begAnswer2 = [
                    new Answer("Bitte verschone mich!", "startCutSceneShipShadowEmpireCell"),
                ];
                let questionAnswer = [
                    new Answer("Es tut mir leid, ich wollte das nicht...", "truthAnswer"),
                    new Answer("Es ist nicht so, wie es aussieht. Ich war das nicht, wirklich!", "lieAnswer")
                ];
                this.game.textBox.addText(new Dialog("Damian, gib mir bitte die Schlüssel zur Bibliothek zurück... was, du hast das goldene Buch berührt?!", lorcanPerson));
                this.game.textBox.addText(new Decision(questionAnswer));
            } else if (this.lorcanTalkFText === false) {
                this.lorcanTalkFText = true;
                this.lorcanText = this.game.add.text(this.lorcan.x+200, this.lorcan.y-50, 'Drücke F: Sprechen', style);
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
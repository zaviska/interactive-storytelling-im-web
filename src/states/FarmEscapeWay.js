import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class FarmEscapeWay extends Phaser.State {

    preload() {
        this.load.audio('escape_way_sound', 'audio/escape_way/criminal-cat_terrasound_de.mp3');
        this.game.load.tilemap('map', 'image/tilemap/farm.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian_amulet', 'image/characters/damian/damian_amulet_room_210x495px.png', 210, 495);
        this.game.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_190x260px.png', 190, 260);
        this.game.load.spritesheet('darcono', 'image/characters/darconos/darconos_400x620.png', 400, 620);
        this.game.load.spritesheet('darcono-baby', 'image/characters/darconos/darcono_baby_280x500.png', 280, 500);
        this.game.load.image('background', 'image/background/house_farm_escape_way_3840x1080px.png');
    }

    create() {
        this.facing = 'right';
        this.jumpTimer = 0;

        this.escapeWayBackgroundSound = this.game.add.audio('escape_way_sound');
        this.escapeWayBackgroundSound.loopFull();
    
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 3840, 1080, 'background');
        this.game.world.setBounds(0, 0, 3840, 1080);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.map.addTilesetImage('tiles_ball');
        this.layer = this.map.createLayer('tile-layer_ground');
        //this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4); 

        this.game.physics.arcade.gravity.y = 250;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.darconoOne = this.game.add.sprite(3200, 500, 'darcono');
        this.game.physics.enable(this.darconoOne, Phaser.Physics.ARCADE);
        this.darconoOne.body.collideWorldBounds = true;
        this.darconoOne.scale.set(0.6);
        //this.darconoOne.body.bounce.set(1);

        this.darconoTwo = this.game.add.sprite(3500, 500, 'darcono');
        this.game.physics.enable(this.darconoTwo, Phaser.Physics.ARCADE);
        this.darconoTwo.body.collideWorldBounds = true;
        this.darconoTwo.scale.set(0.6);
        //this.darconoTwo.body.bounce.set(1);

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
        //this.darconoBabyTwo.body.bounce.set(1);

        this.lorcan = this.game.add.sprite(2700, 300, 'lorcan');
        //this.lorcan.scale.set(0.53);
        this.lorcan.frame = 4;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(190, 260, 0, 0);
        this.lorcanTalked = false;
        this.lorcanTalkFText = false;

        this.player = this.game.add.sprite(0, 370, 'damian_amulet');
        this.player.scale.set(0.53);
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.anchor.set(0.75);
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(210, 495, 0, 0);
        this.player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
        this.player.animations.add('right', [5, 6, 7, 8, 9], 8, true);

        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.E);
    
        var style = { font: "24px Arial", fill: "#19de65"};
    }

    update() {
        let textBox = this.game.textBox;
        let style = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};
        let that = this;
   
        if (this.nKey.isDown) {
            this.escapeWayBackgroundSound.destroy();
            this.state.start('AirshipDeparture');
        }

     
        function talkToLorcan(player, lorcan) {
            if (this.fKey.isDown && this.lorcanTalked === false) {
                this.lorcanTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                window.waitAnswer = function() {
                    that.lorcanTalked = false;
                    textBox.addText(new Dialog("Komme wieder, wenn du bereit bist.", lorcanPerson));
                }
                window.startCutSceneAirshipDeparture = function() {
                    that.escapeWayBackgroundSound.destroy();
                    that.state.start('AirshipDeparture');
                }
                let questionAnswer = [
                    new Answer("Ja.", "startCutSceneAirshipDeparture"),
                    new Answer("Noch nicht.", "waitAnswer")
                ];
                this.game.textBox.addText(new Dialog("Möchtest du einsteigen?", lorcanPerson));
                this.game.textBox.addText(new Decision(questionAnswer));
            } else if (this.lorcanTalkFText === false) {
                this.lorcanTalkFText = true;
                this.lorcanText = this.game.add.text(this.lorcan.x, this.lorcan.y-50, 'Drücke F: Sprechen', style);
            }
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.lorcan, this.layer);
        this.game.physics.arcade.collide(this.darconoOne, this.layer);
        this.game.physics.arcade.collide(this.darconoTwo, this.layer);
        this.game.physics.arcade.collide(this.darconoThree, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyOne, this.layer);
        this.game.physics.arcade.collide(this.darconoBabyTwo, this.layer);

        let overlapLorcan = this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

        if (overlapLorcan === false && this.lorcanTalkFText === true) {
            this.lorcanText.destroy();
            this.lorcanTalkFText = false;
            this.talkToLorcan = false;
        }

        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.aKey.isDown) {
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
            if (this.facing != 'idle') {
                this.player.animations.stop();
                if (this.facing == 'left') {
                    this.player.frame = 4;
                }
                else {
                    this.player.frame = 5;
                }
                this.facing = 'idle';
            }
        }
        
        if (
            this.jumpButton.isDown &&
            this.player.body.onFloor() &&
            this.game.time.now > this.jumpTimer) {

            this.player.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now + 750;
        }
    
    }

}
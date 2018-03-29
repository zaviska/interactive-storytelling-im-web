import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipTestLibraryBack extends Phaser.State {

    preload() {
        this.load.audio('airhsip_test_sound', 'audio/test/dance_of_the_imps_terrasound_de.mp3');
        this.game.load.tilemap('map', 'image/tilemap/room_airship.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.game.load.spritesheet('damian_amulet', 'image/characters/damian/damian_amulet_room_210x495px.png', 210, 495);
        this.game.load.spritesheet('lorcan', 'image/characters/lorcan/lorcan_378x510px.png', 378, 510);
        this.game.load.image('background-airship', 'image/background/airship_room_3840x1080px.png');
    }

    create() {
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        this.mage = false;
        this.knight = false;
        let textBox = this.game.textBox;

        this.airshipTestBackgroundSound = this.game.add.audio('airhsip_test_sound');
        this.airshipTestBackgroundSound.loopFull();
  
        textBox.addText(new Text("KAPITEL 9: SIR LORCAN'S RÜCKKEHR <hr>"));
        textBox.addText(new Text("Nachdem Damian in letzter Minute zum goldenen Buch griff, verschwand die rote Atmosphäre und der Raum drehte sich erneut zurück in die alte Dimension."));
        textBox.addText(new Text("Zunächst erleichtert über die Rückkehr musste Damian jedoch feststellen, dass das goldene Buch anfing zu bluten. Damian versuchte das Blut zu entfernen, aber das Buch hörte nicht auf zu bluten. Aus Panik wollte er ein Tuch um das Buch wickeln und es in eine Truhe verstecken. Er hoffte nämlich, dass das Buch dadurch am nächsten Tag aufhört zu bluten."));
        textBox.addText(new Text("Kurze Zeit später kam Kapitän Sir Lorcan zurück auf das Luftschiff und wollte von Damian sofort den Schlüssel zur Bibliothek zurück haben... "));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Verstecke das blutige Buch und spreche mit Sir Lorcan.</i></span>"));
    
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

        this.lorcan = this.game.add.sprite(1000, 300, 'lorcan');
        this.lorcan.frame = 4;
        this.game.physics.enable(this.lorcan, Phaser.Physics.ARCADE);
        this.lorcan.body.bounce.y = 0.2;
        this.lorcan.body.collideWorldBounds = true;
        this.lorcan.body.setSize(378, 510, 0, 0);
        this.lorcanTalked = false;
        this.lorcanTalkFText = false;
        
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
        if (typeof this.lorcanText !== undefined && this.talkToLorcan === true) {
            this.lorcanText.destroy();
            this.lorcanTalkFText = false;
        }
        function talkToLorcan(player, lorcan) {
            if (this.fKey.isDown && this.lorcanTalked === false) {
                this.lorcanTalked = true;
                let lorcanPerson = new Person("Sir Lorcan", "lorcan");
                this.game.textBox.addText(new Dialog("Hallo Damian.", lorcanPerson));
            } else if (this.lorcanTalkFText === false) {
                this.lorcanTalkFText = true;
                this.lorcanText = this.game.add.text(this.lorcan.x, this.lorcan.y-50, 'Drücke F: Sprechen', style);
            }
        }

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.lorcan, this.layer);

        this.game.physics.arcade.overlap(this.player, this.lorcan, talkToLorcan, null, this);

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
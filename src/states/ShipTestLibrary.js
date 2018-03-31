import { Text } from "../textbox/api/Text";
import { Person } from "../textbox/api/Person";
import { Dialog } from "../textbox/api/Dialog";
import { Decision } from "../textbox/api/Decision";
import { Answer } from "../textbox/api/Answer";

export default class ShipTestLibrary extends Phaser.State {

    preload() {
        this.load.audio('airhsip_test_sound', 'audio/test/dance_of_the_imps_terrasound_de.mp3');
        this.load.audio('shoot_sound', 'audio/sound_effects/magic/magic.mp3');
        this.load.audio('explosion_sound', 'audio/sound_effects/explosion/bomb.mp3');
        this.load.spritesheet('explode', 'image/bullet/explode.png', 128, 128);
        this.load.spritesheet('damian-magic', 'image/characters/damian/damian_magicAttackAndWalk_500x500px.png', 500, 500);
        this.load.tilemap('map', 'image/tilemap/room_3840px.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-ground', 'image/tilemap/tiles-ground.png');
        this.load.image('marker', 'image/tilemap/marker_30x30px.png');
        this.load.image('background-airship', 'image/background/airship_library_3840x900px.png');
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        let that = this;
        this.facing = 'right';
        this.jumpTimer = 0;
        let textBox = this.game.textBox;

        this.airshipTestBackgroundSound = this.game.add.audio('airhsip_test_sound');
        this.airshipTestBackgroundSound.loopFull();
        this.shootSound = this.game.add.audio('shoot_sound');
        this.explosionSound = this.game.add.audio('explosion_sound');
  
        textBox.addText(new Text("KAPITEL 7: DAS VERBOTENE BUCH <hr>"));
        textBox.addText(new Text("Nachdem Damian alle Tumbras besiegen konnte, war Kapitän Sir Lorcan sehr stolz auf Damians Mut und Kampfgeist."));
        textBox.addText(new Text("Eines Tages musste Kapitän Sir Lorcan für einen kurzen Zeitraum das Luftschiff verlassen und übergab seinem Lieblingsschüler Damian die Verantwortung für die Kapitän-Bibliothek. Damian bekam somit als einziger den Schlüssel zu dieser Bibliothek. Er durfte jedes Buch lesen bis auf das goldene Buch aus der Kapitän-Bibliothek. Falls er sich nicht an dieses Gebot hielt, drohte ihm der Austritt der Luftritter. Als er alleine in der Bibliothek war, sah er sich fast jedes Buch an, doch seine Neugier wurde immer größer. Er dachte sich, dass es doch niemand merken würde, wenn er dieses goldene Buch nur einmal kurz in den Händen hielt..."));
        textBox.addText(new Text("<span style='color:#19de65;'>Hauptziel: <i>Berühre nicht das goldene Buch.</i></span>"));
    
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

        this.book = this.game.add.sprite(1910, 500, 'marker');
        this.game.physics.enable(this.book, Phaser.Physics.ARCADE);
        this.book.body.allowGravity = false;
        //this.book.visible = false;
        this.bookTouched = false;
        this.bookTouchedFText = false;
        
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
            this.airshipTestBackgroundSound.destroy();
            this.state.start('EnterShadowEmpireLibrary');
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

        let overlapBook = this.game.physics.arcade.overlap(this.player, this.book, touchBook, null, this);

        this.fontStyle = { font: "20px Hind, Arial", fill: "#19de65", backgroundColor: "black"};   
        if (overlapBook === false && this.bookTouchedFText === true) {
            this.bookText.destroy();
            this.bookTouchedFText = false;
        }
        function touchBook(player, item) {
            if (this.fKey.isDown && this.bookTouched === false) {
                this.bookTouched = true;
                this.game.textBox.addText(new Text("Du hast das goldene Buch berührt."));
                this.airshipTestBackgroundSound.destroy();
                this.state.start('EnterShadowEmpireLibrary');   
            } else if (this.bookTouchedFText === false) {
                this.bookTouchedFText = true;
                this.bookText = this.game.add.text(this.book.x-70, this.book.y-120, 'Drücke F: Berühren', this.fontStyle);
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
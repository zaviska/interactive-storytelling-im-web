/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */



export default class Room extends Phaser.State {

    preload() {
        this.load.audio('escape_way_sound', 'audio/escape_way/criminal-cat_terrasound_de.mp3');
        this.game.load.tilemap('map', 'farm/room.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-ground', 'farm/tiles-ground.png');
        this.game.load.spritesheet('damian', 'farm/damian.png', 150, 370);
        this.game.load.image('background-room', 'farm/house_room_1920x1080px.png');
        this.game.load.image('bag', 'farm/backpack_115_155px.png');
    }

    create() {

        this.map;
        this.tileset;
        this.layer;
        this.player;
        this.facing = 'left';
        this.jumpTimer = 0;
        this.cursors;
        this.jumpButton;
        this.background;

        this.escapeWayBackgroundSound = this.game.add.audio('escape_way_sound');
        this.escapeWayBackgroundSound.loopFull();
  
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000000';
        this.background = this.game.add.tileSprite(0, 0, 1920, 1080, 'background-room');
        this.game.world.setBounds(0, 0, 1920, 1080);


        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles-ground');
        this.layer = this.map.createLayer('tile-layer_ground');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,4);


        this.game.physics.arcade.gravity.y = 250;

        this.player = this.game.add.sprite(500, 700, 'damian');
        this.player.scale.set(1.3);
    
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.anchor.set(0.75);
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(152, 385, 0, 0);
        this.player.animations.add('left', [4, 3, 2, 1, 0], 8, true);
        this.player.animations.add('right', [5, 6, 7, 8, 9], 8, true);


        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        this.bag = this.game.add.sprite(1400, 300, 'bag');
        this.game.physics.enable(this.bag, Phaser.Physics.ARCADE);
        this.bag.body.collideWorldBounds = true;


        this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.input.onDown.add(gofull, this);
    
        function gofull() {
            this.game.scale.startFullScreen();
        }
    }

    update() {
        function collectItem(payer, item) {
            item.kill();
        }
      
        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.bag, this.layer);

        this.game.physics.arcade.overlap(this.player, this.bag, takeBag, null, this);
        //this.game.physics.arcade.overlap(this.player, this.door, openDoor, null, this);
        //this.game.physics.arcade.overlap(this.player, this.window, openWindow, null, this);

        
        if(this.nKey.isDown) {
            this.escapeWayBackgroundSound.destroy();
            this.state.start('FarmEscapeWay');
        }

        function takeBag(player, item) {
            if (this.fKey.isDown) {
                this.fText = this.game.add.text(900, 900, 'Damian hat den Rucksack genommen.', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
                item.kill();
            } else {
                this.text = this.game.add.text(this.bag.x, this.bag.y, 'Drücke F: nehmen', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            }
        }

        function openDoor(player, item) {
            if (this.fKey.isDown) {
                this.fText = this.game.add.text(900, 900, 'Die Tür ist verschlossen.', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            } else {
                this.text = this.game.add.text(0, 500, 'Drücke F: öffnen', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            }
        }

        function openWindow(player, item) {
            if (this.fKey.isDown) {
                this.fText = this.game.add.text(900, 900, 'Damian ist aus dem Fenster geklettert.', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            } else {
                this.text = this.game.add.text(0, 500, 'Drücke F: aus dem Fenster klettern', { font: "24px Arial", backgroundColor: "#000000", fill: "#FFFFFF" });
            }
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
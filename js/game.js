
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let platforms;
let player;
let ratio = 2;
let minimize;
let ghosts;
let flag = {};

let positions = [
    { x: 100, y: 300 },
    { x: 200, y: 150 },
    { x: 400, y: 400 },
    { x: 550, y: 100 },
    { x: 675, y: 250 },
    { x: 125, y: 475 },
    { x: 700, y: 475 },
];

function preload() {
    this.load.image('forest', 'assets/forest.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('slime',
        'assets/slime.png', {
        frameWidth: 32,
        frameHeight: 25
    });

    this.load.spritesheet('reverse',
        'assets/slime-reverse.png', {
        frameWidth: 32,
        frameHeight: 25
    });

    this.load.spritesheet('ghost',
        'assets/ghost.png', {
        frameWidth: 100,
        frameHeight: 100
    });

    this.load.spritesheet('death',
        'assets/death.png', {
        frameWidth: 100,
        frameHeight: 100
    });
}

function create() {
    this.add.image(400, 300, 'forest');

    platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 4; i++) {
        platforms.create(100 + i * 200, 585, 'platform');
    }

    positions.forEach(p => {
        platforms.create(p.x, p.y, 'platform');
    });

    player = this.physics.add.sprite(100, 450, 'slime');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    // player.setGravityY(300);

    player.setScale(ratio);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('slime', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('reverse', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 20 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'ghosting',
        frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('death', { start: 0, end: 17 }),
        frameRate: 20,
        repeat: -1
    })

    this.physics.add.collider(player, platforms);
    player.body.setGravityY(0);

    player.anims.play('idle');

    ghosts = this.physics.add.group();

    this.physics.add.collider(player, ghosts, (player, ghost) => {
        if(typeof flag[ghost] == 'undefined' || !flag[ghost]){
            flag[ghost] = true;
            ghost.setBounce(0);
            ghost.body.stop();
            ghost.body.moves = false;
            ghost.anims.play('death', true);
            setTimeout(() => {
                console.log('recover')
                flag[ghost] = false;
                ghost.body.moves = true;
                ghost.x = Phaser.Math.Between(0, 800);
                ghost.y = 0;
                ghost.setBounce(1);
                ghost.body.setAllowGravity(false);
                ghost.setVelocity(Phaser.Math.Between(-200 * ratio, 200 * ratio), Phaser.Math.Between(-100 * ratio, 100 * ratio));
                ghost.setCollideWorldBounds(true);
                ghost.anims.play('ghosting');
            }, 800);
        }

    }, null, this);

    for (let i = 0; i < 3; i++) {
        let ghost = ghosts.create(Phaser.Math.Between(0,800), 0, 'ghost');
        ghost.setBounce(1);
        ghost.body.setAllowGravity(false);
        ghost.setVelocity(Phaser.Math.Between(-200 * ratio, 200 * ratio), Phaser.Math.Between(-100 * ratio, 100 * ratio));
        ghost.setCollideWorldBounds(true);
        ghost.anims.play('ghosting');
    }


    minimize = setInterval(() => {
        player.setScale(ratio);
        // ratio = ratio - 0.1;

    }, 2000);

}

let inProgress = false;

function update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160 * ratio);
        player.anims.play('left', true);
        if (player.x <= 0 + (32 / 2) * ratio) {
            player.x = 800;
        }
    } else if (cursors.right.isDown) {
        player.setVelocityX(160 * ratio);
        player.anims.play('right', true);
        if (player.x >= 800 - (32 / 2 * ratio)) {
            player.x = 0;
        }
    } else {
        player.setVelocityX(0);
        player.anims.play(inProgress ? 'down' : 'idle', true);
    }

    if (cursors.down.isDown && (player.body.touching.down || player.y >= 585) && !inProgress) {
        player.anims.play('down', false);
        inProgress = true;

        setTimeout(() => {
            if (player.y >= 500) {
                player.y = 0;
            } else {
                player.y = player.y + 5;
            }
            inProgress = false;
        }, 400);
    }
}
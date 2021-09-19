
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

let positions = [
    {x: 100, y: 300},
    {x: 200, y: 150},
    {x: 400, y: 400},
    {x: 550, y: 100},
    {x: 675, y: 250}
];

function preload(){
    this.load.image('forest', 'assets/forest.png');
    this.load.image('platform', 'assets/platform.png');
}

function create(){
    this.add.image(400, 300, 'forest');

    platforms = this.physics.add.staticGroup();

    for(let i=0; i<4; i++){
        platforms.create(100 + i*200 ,585,'platform');
    }

    positions.forEach(p =>{
        platforms.create(p.x, p.y, 'platform');
    });

}

function update(){
}
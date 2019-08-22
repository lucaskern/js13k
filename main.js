let { init, Sprite, GameLoop } = kontra

let { canvas } = init()


//Game Settings
let rotateSpeed = 40
let EnemySpeed = 10
let PUDuration = 10

//Match Settings
let score,time
let powerups = []

//soldiers array
let soliders=[]

let soldier = {
  health: true,
  pos: 0,
  type: 0,
  attack: function() {

  }
}

/*
* Game Start
* Init match settings
*/
function gameStart() {
 score = 0
 time = 0

 setInterval(timer, 1000);

 loop.start();    // start the game
}


let sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 20,     // width and height of the sprite rectangle
  height: 40,
  dx: 2          // move the sprite 2px to the right every frame
});

let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    sprite.update()

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width
    }
  },
  render: function() { // render the game state
    sprite.render()
  }
});

//simple count up timer
function timer() {
  console.log("rand");
  ++time
}

/* Rotate the formation left or right
*  Based on direction param
*  Run through soldier array and apply transform for each element
*/
function rotate(direction) {

}

gameStart();
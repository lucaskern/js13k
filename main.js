let {
  init,
  Sprite,
  GameLoop,
  getContext,
  getCanvas,
  initKeys,
  bindKeys,
  keyPressed
} = kontra

let {
  canvas
} = init()

initKeys()

//Game Settings
let rotateSpeed = 40
let EnemySpeed = 10
let PUDuration = 10
let soldierCount = 9
let pressed = 0;

//let canvas = getCanvas()
let ctx = getContext()

//Match Settings
let score, time
let powerups = []

//soldiers array
let soldiers = []
let enemies = []

function Soldier() {
  let self = this
  this.health = true
  this.pos = 0
  this.type = 0
  this.coolDown = 0
  this.attack = function () {
    this.sprite.color = "gold";
    setTimeout(this.sprite.changes, (this.coolDown * 1000))
  }

  this.sprite = Sprite({
    x: self.pos * 100, // starting x,y position of the sprite
    y: 900,
    color: 'blue', // fill color of the sprite rectangle
    width: 40, // width and height of the sprite rectangle
    height: 40,
    changes: function () {
      switch (self.type) {
        case 'swrd':
          self.sprite.color = "blue"
          break
        case 'jav':
          self.sprite.color = "red"
          break
        case 'shld':
          self.sprite.color = "green"
          break
      }

    },
    init: function () {
      this.x = (self.pos * 110) + 40
    },
    render: function() {
      //expand soldier draw here
      this.draw();
    }
  })
}

let enemy = {

}

/*
 * Game Start
 * Init match settings
 */
function gameStart() {
  score = 0
  time = 0
  hp = 20

  setInterval(timer, 1000);

  //Init soldiers array with correct types
  for (let i = 0; i < soldierCount; i++) {
    soldiers[i] = new Soldier()
    soldiers[i].health = 1
    soldiers[i].pos = i
    soldiers[i].sprite.init()

    switch (i) {
      case 0:
      case 3:
      case 6:
        soldiers[i].type = 'swrd'
        soldiers[i].coolDown = 1
        break;
      case 1:
      case 4:
      case 7:
        soldiers[i].type = 'jav'
        soldiers[i].coolDown = 3
        break;
      case 2:
      case 5:
      case 8:
        soldiers[i].type = 'shld'
        soldiers[i].coolDown = 2
        break;
    }

    soldiers[i].sprite.changes();
  }

  console.log(soldiers)

  loop.start(); // start the game
}


let sprite2 = Sprite({
  x: 100, // starting x,y position of the sprite
  y: 80,
  color: 'red', // fill color of the sprite rectangle
  width: 20, // width and height of the sprite rectangle
  height: 40,
  dx: 1 // move the sprite 2px to the right every frame
});

let loop = GameLoop({ // create the main game loop
  update: function () { // update the game state
    sprite2.update()
    for (let i = 0; i < soldiers.length; i++) {
      soldiers[i].sprite.update()
      //soldiers[i].sprite.changes()
    }

    bindKeys(['1','2','3','4','5','6','7','8','9'], function(e) {
      if (!pressed) {
        soldiers[(parseInt(e.key) - 1)].attack()
      }
      pressed = 1
    })


    document.addEventListener('keydown', function(event) {
      
      if (!pressed) {
        if (event.key === 'ArrowLeft') {
          shift('l')
          pressed = 1
        } else if (event.key === 'ArrowRight') {
          shift('r')
          pressed = 1
        }
      }
  });
  
  document.addEventListener('keyup', function(event) {
    pressed = 0
  })
  },
  render: function () { // render the game state
    drawUI()
    sprite2.render()
    for (let i = 0; i < soldiers.length; i++) {
      soldiers[i].sprite.render();
    }
  }
});

//simple count up timer
function timer() {
  ++time
}

function drawUI() {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.width, 70)

  ctx.fillStyle = "white"
  //Timer
  ctx.font = "50px Arial"
  ctx.fillText(time, 500, 50)

  //score
  ctx.font = "30px Arial"
  ctx.fillText(`Score: ${score}`, canvas.width - 150, 50)

  //wave
  ctx.fillText(`Wave: ${Math.round(time / 20) + 1}`, 30, 50)
}

/* Rotate the formation left or right
 *  Based on direction param
 *  Run through soldier array and apply transform for each element
 */
function shift(direction) {
  console.log(soldiers)

  if (direction === 'l') {
    // let first = soldiers.shift()
    // soldier[soldiers.length + 1] = first
    for (let i = 0; i < soldierCount; i++) {
      soldiers[i].pos = soldiers[i].pos === 0 ? 8 : soldiers[i].pos - 1
      soldiers[i].sprite.init()
    }
  } else {
    // let last = soldiers.pop()
    // soldiers.unshift(last)
    for (let i = 0; i < soldierCount; i++) {
      soldiers[i].pos = soldiers[i].pos === 8 ? 0 : soldiers[i].pos + 1
      soldiers[i].sprite.init()
    }
  }
  console.log(soldiers)
  console.log("--------------")
}

gameStart();
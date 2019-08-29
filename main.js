//TODO walk through death process

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
let respawnTime = 3
let reserves = 20
let pressed = 0
let hp = 0 //reserve units

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
  this.cooled = true
  this.attack = function () {
    if (this.cooled && this.health) {
      this.sprite.color = "gold"
      setTimeout(this.sprite.changes, (this.coolDown * 1000))
      this.cooled = false

      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].pos === this.pos && enemies[i].type === this.type) {
          enemies.splice(i, 1)
          score++
        }
      }
    }
  }
  this.kill = function() {
    console.log("killed at pos " + this.pos)
    this.health = false
    this.sprite.changes()
    reserves--

    //this.setTimeout(respawnTime * 1000, soldierDeath())
  }

  this.sprite = Sprite({
    x: self.pos * 100, // starting x,y position of the sprite
    y: 900,
    color: 'blue', // fill color of the sprite rectangle
    width: 40, // width and height of the sprite rectangle
    height: 40,
    changes: function () {
      switch (self.type) {
        case 'sword':
          self.sprite.color = "blue"
          break
        case 'jav':
          self.sprite.color = "red"
          break
        case 'shield':
          self.sprite.color = "green"
          break
      }
      self.cooled = true
      self.health = true
    },
    init: function () {
      this.x = (self.pos * 110) + 40
    },
    render: function() {
      //expand soldier draw here
      if (self.health) {
        this.draw()
        console.log(self.health);
      }
    }
  })
}

function Enemy() {
  let self = this
  this.health = true
  this.pos = 0
  this.type = 0
  this.attack = function () {
    this.sprite.color = "gold"
    setTimeout(this.sprite.changes, (this.coolDown * 1000))
  }
  this.die = function () {
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].sprite.y >= 850) {
        soldiers[enemies[i].pos].kill()
        setTimeout(function() {
          soldierReplace(enemies[i].pos);
      }, 1000)
        soldiers[enemies[i].pos].health = false
        enemies.splice(i, 1)
      }
    }
  }
  this.sprite = Sprite({
    x: self.pos * 100, // starting x,y position of the sprite
    y: 0,
    color: 'blue', // fill color of the sprite rectangle
    width: 40, // width and height of the sprite rectangle
    height: 40,
    changes: function () {
      switch (self.type) {
        case 'sword':
          self.sprite.color = "blue"
          self.sprite.dy = 2
          break
        case 'jav':
          self.sprite.color = "red"
          self.sprite.dy = 3
          break
        case 'shield':
          self.sprite.color = "green"
          self.sprite.dy = 1
          break
      }

    },
    init: function () {
      this.x = (self.pos * 110) + 40
    },
    render: function() {
      //expand enemy draw here
      this.draw()
      self.die()
    }
  })
}

/*
 * Game Start
 * Init match settings
 */
function gameStart() {
  score = 0
  time = 0
  hp = 20

  setInterval(timer, 1000)

  setInterval(enemyFactory, 3000)

  //Init soldiers array with correct types
  for (let i = 0; i < soldierCount; i++) {
    soldiers[i] = new Soldier()
    soldiers[i].health = true
    soldiers[i].pos = i
    soldiers[i].sprite.init()

    switch (i) {
      case 0:
      case 3:
      case 6:
        soldiers[i].type = 'sword'
        soldiers[i].coolDown = 1
        break
      case 1:
      case 4:
      case 7:
        soldiers[i].type = 'jav'
        soldiers[i].coolDown = 3
        break
      case 2:
      case 5:
      case 8:
        soldiers[i].type = 'shield'
        soldiers[i].coolDown = 2
        break
    }

    soldiers[i].sprite.changes()

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
    })
  
    document.addEventListener('keyup', function(event) {
      pressed = 0
    })
  }

  loop.start() // start the game
}

let loop = GameLoop({ // create the main game loop
  update: function () { // update the game state
    for (let i = 0; i < soldiers.length; i++) {
      soldiers[i].sprite.update()
      //soldiers[i].sprite.changes()
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].sprite.update()
    }


  },
  render: function () { // render the game state
    for (let i = 0; i < soldiers.length; i++) {
      soldiers[i].sprite.render()
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].sprite.render()
    }

    //draw UI on top of other elements
    drawUI()
  }
})

//simple count up timer
function timer() {
  ++time
}

function drawUI() {
  //Top ui bg
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.width, 70)
  
  //Timer
  ctx.fillStyle = "white"
  ctx.font = "50px Arial"
  ctx.fillText(time, 500, 50)

  //numbers
  ctx.fillText("1      2      3      4      5      6      7      8      9", 40, 935)

  //score
  ctx.font = "30px Arial"
  ctx.fillText(`Score: ${score}`, canvas.width - 150, 50)

  ctx.fillText(`Units: ${reserves}`, 200, 50)

  //wave
  ctx.fillText(`Wave: ${Math.round(time / 20) + 1}`, 30, 50)

  //death line
  ctx.fillStyle = "red"
  ctx.fillRect(0,850, canvas.width, 2)

}

/* Rotate the formation left or right
 *  Based on direction param
3 *  Run through soldier array and apply transform for each element
 */
function shift(direction) {
  //console.log(soldiers)

  if (direction === 'l') {
    let newSoldiers = []
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

  //realign soldiers so that attacks correspond to correct position
  soldiers.sort((a, b) => (a.pos > b.pos) ? 1 : -1)
}

/*Create enemies of random type
* Bias the position to get an even dist
* Frequency is based on timer/wave
*/
function enemyFactory() {
  let enemyType = ['sword','jav','shield']
  let newEnemy = new Enemy()
  newEnemy.pos = Math.floor(Math.random() * 9)     // returns a random integer from 0 to 100
  newEnemy.type =  enemyType[Math.floor(Math.random() * 3)] 
  newEnemy.sprite.changes()
  newEnemy.sprite.init()
  enemies.push(newEnemy)
}

/*
* Kill and replace a unit
* Start respawn timer
* Reduce reserve count
* Create new soldier and place in correct array loc
*/
function soldierReplace(pos) {
  reserves--
  console.log(soldiers[pos])
  soldiers[pos].health = true
  soldiers[pos].sprite.changes()
}

gameStart()
const game = {
  data: {
    board: [],
    boardItems: {
      weapons: [],
      players: [],
      objects: [],
    },
  },

  ready: false,

  endTurn: function () {
    var item = this.data.boardItems.players.shift()
    this.data.boardItems.players.push(item)
  },
  //generate 2D array inside board
  genBoard: function (columns, rows) {
    for (let y = 0; y < columns; y++) {
      this.data.board.push([])
      for (let x = 0; x < rows; x++) {
        this.data.board[y].push([])
      }
    }
  },
  //create player divs with classname
  genPlayers: function () {
    Object.values(game.data.board).forEach(itemType => {
      itemType.forEach(item => {
        item.forEach(player => {
          if (player.type == 'player') {
            var y = player.position.y
            var x = player.position.x

            var cell = document.getElementById(`cell-${y}-${x}`);
            cell.innerHTML = ''
            var playerDiv = document.createElement("div");
            cell.appendChild(playerDiv);
            playerDiv.className = 'player flex-grow-1'
            playerDiv.id = player.id
          }
        })
      })
    })
  },
  //create weapon divs with classname
  genWeapons: function () {
    Object.values(game.data.board).forEach(itemType => {
      itemType.forEach(item => {
        item.forEach(weapon => {
          if (weapon.type == 'weapon') {
            var y = weapon.position.y
            var x = weapon.position.x

            var cell = document.getElementById(`cell-${y}-${x}`);
            cell.innerHTML = ''
            var weaponDiv = document.createElement("div");
            cell.appendChild(weaponDiv);
            weaponDiv.className = 'weapon flex-grow-1'
          }
        })
      })
    })
  },
  //create obstacles divs with classname
  genObstacles: function () {
    Object.values(game.data.board).forEach(itemType => {
      itemType.forEach(item => {
        item.forEach(obstacle => {
          if (obstacle.id == 'trees') {
            var y = obstacle.position.y
            var x = obstacle.position.x

            var cell = document.getElementById(`cell-${y}-${x}`);
            cell.innerHTML = ''
            var obstacleDiv = document.createElement("div");
            cell.appendChild(obstacleDiv);
            obstacleDiv.className = 'trees flex-grow-1'
          }
          else if (obstacle.id == 'water') {
            var y = obstacle.position.y
            var x = obstacle.position.x

            var cell = document.getElementById(`cell-${y}-${x}`);
            cell.innerHTML = ''
            var obstacleDiv = document.createElement("div");
            cell.appendChild(obstacleDiv);
            obstacleDiv.className = 'water flex-grow-1'
          }
        })
      })
    })
  },
  //randomly populate board
  populateBoard: function () {
    Object.values(this.data.boardItems).forEach(itemType => {
      itemType.forEach(item => {
        while (true) {
          let y = Math.floor(Math.random() * this.data.board.length)
          let x = Math.floor(Math.random() * this.data.board[y].length)

          if (!this.data.board[y][x].length) {
            this.data.board[y][x].push(item)
            item.position = { y, x }
            break
          }
        }
      })
    })
  },
  //generate map with cells
  genMap: function () {
    var board = document.getElementById("board");

    for (var ii = 0; ii < this.data.board.length; ii++) {
      var columns = document.createElement("div");
      columns.className = 'row d-flex flex-grow-1';
      columns.id = "row-" + ii;
      board.appendChild(columns);

      for (var i = 0; i < this.data.board[ii].length; i++) {
        var rows = document.createElement("div");
        rows.className = 'cells border flex-grow-1 border border-dark';
        rows.id = "cell-" + ii + "-" + i;
        columns.appendChild(rows);
      }
    }
  },
  //render cell (needs work!)
  renderCell: function (y, x) {
    var cell = document.getElementById(`cell-${y}-${x}`)
    // var player = document.createElement("div")
    cell.innerHTML = '';
    this.data.board[y][x].forEach(item => {
      var cellItem = document.createElement("div")
      cellItem.className = item.type + ' flex-grow-1';
      cell.appendChild(cellItem);
    })
  },
  //move player
  movePlayer: function (player, newY, newX) {
    if ((newY < this.data.board.length && newY >= 0) && (newX < this.data.board[newY].length && newX >= 0)) {
      var oldY = player.position.y
      var oldX = player.position.x
      var obstacle = this.data.board[newY][newX].find(element => element.type == 'obstacle')
      var playerTwo = this.data.board[newY][newX].find(element => element.type == 'player')
      if (!playerTwo && !obstacle &&
        ((newY <= oldY + 3 || newY >= oldY - 3) ||
          (newX <= oldX + 3 || newX >= oldX - 3)) &&
        ((oldX != newX && oldY == newY) || (oldX == newX && oldY != newY))) {
        this.data.board[oldY][oldX] = this.data.board[oldY][oldX].filter(item => item.id != player.id)
        this.data.board[newY][newX].push(player)
        player.position = { y: newY, x: newX }
        this.renderCell(oldY, oldX)
        this.renderCell(newY, newX)
        player.moves--;
      }
    }
  },
  //Not sure how to make it work yet...
  fight: function (y, x) {
    var player = game.data.boardItems.players[0];
    var player2 = game.data.boardItems.players[1];
    // alert("fight!")
    // player.attack(player2)
    // console.log(player2.health)
    let playerFound
    let directions = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 }
    ]

    for (let index = 0; index < directions.length; index++) {
      const pos = directions[index];
      if ((pos.y < this.data.board.length && pos.y >= 0) && (pos.x < this.data.board[pos.y].length && pos.x >= 0)) {
        playerFound = this.data.board[pos.y][pos.x].find(item => item.type === 'player')
      }
      if (playerFound && playerFound.id != player.id) {
        player.fighting = true;
        player2.fighting = true;
        return true
      }
    }
    return false
  },

  startGame: function (mapSize1) {
    var mapSize = mapSize1;

    if (mapSize == "Small") {
      game.genBoard(6, 6)
      game.genMap()

      var dagger1 = new Weapon('dagger', 30, 10)
      var sword1 = new Weapon('sword', 40, 25)
      var longSword1 = new Weapon('long sword', 60, 30)
      game.data.boardItems.weapons.push(dagger1)
      game.data.boardItems.weapons.push(sword1)
      game.data.boardItems.weapons.push(longSword1)

      for (let i = 0; i <= 2; i++) {
        game.data.boardItems.objects.push(new Obstacle('water'))
        game.data.boardItems.objects.push(new Obstacle('trees'))
      }
    }
    else if (mapSize == "Medium") {
      console.log("start game medium")
      game.genBoard(9, 9)
      game.genMap()

      var dagger1 = new Weapon('dagger', 30, 10)
      var sword1 = new Weapon('sword', 40, 25)
      var longSword1 = new Weapon('long sword', 60, 30)
      game.data.boardItems.weapons.push(dagger1)
      game.data.boardItems.weapons.push(sword1)
      game.data.boardItems.weapons.push(longSword1)
      var dagger2 = new Weapon('dagger', 30, 10)
      var sword2 = new Weapon('sword', 40, 25)
      var longSword2 = new Weapon('long sword', 60, 30)
      game.data.boardItems.weapons.push(dagger2)
      game.data.boardItems.weapons.push(sword2)
      game.data.boardItems.weapons.push(longSword2)
      for (let i = 0; i <= 7; i++) {
        game.data.boardItems.objects.push(new Obstacle('water'))
        game.data.boardItems.objects.push(new Obstacle('trees'))
      }
    }
    else if (mapSize == "Large") {
      game.genBoard(12, 12)
      game.genMap()

      var dagger1 = new Weapon('dagger', 30, 10)
      var sword1 = new Weapon('sword', 40, 25)
      var longSword1 = new Weapon('long sword', 60, 30)
      game.data.boardItems.weapons.push(dagger1)
      game.data.boardItems.weapons.push(sword1)
      game.data.boardItems.weapons.push(longSword1)
      var dagger2 = new Weapon('dagger', 30, 10)
      var sword2 = new Weapon('sword', 40, 25)
      var longSword2 = new Weapon('long sword', 60, 30)
      game.data.boardItems.weapons.push(dagger2)
      game.data.boardItems.weapons.push(sword2)
      game.data.boardItems.weapons.push(longSword2)
      for (let i = 0; i <= 10; i++) {
        game.data.boardItems.objects.push(new Obstacle('water'))
        game.data.boardItems.objects.push(new Obstacle('trees'))
      }
    }
  },

  //swap weapons (not finished yet I think)
  swapWeapons: function (player) {
    var y = player.position.y
    var x = player.position.x

    if (game.ready) {
      var newWeapon = this.data.board[y][x].find(element => element.type == 'weapon')
    }

    var oldWeaponId = player.weapon
    if (newWeapon) {
      if (player.weapon.id == 'fist') {
        this.data.board[y][x] = this.data.board[y][x].filter(element => element.id != newWeapon.id)
        player.weapon = newWeapon

      } else {
        this.data.board[y][x] = this.data.board[y][x].filter(element => element.id != newWeapon.id)
        this.data.board[y][x].push(oldWeaponId)
        player.weapon = newWeapon
      }
    }
  },

  gameOver: function () {
    this.ready = false;
    var endGame = document.getElementById("endGame");
    endGame.style.display = 'flex';
    var gameSettings = document.getElementById("GameSettings");
    gameSettings.style.display = 'hide';

  },

  updateConsole: function (player1, player2) {

    var player1Health = document.getElementById('player1-health');
    var player2Health = document.getElementById('player2-health');

    var player1Card = document.getElementById('player1-card');
    var player2Card = document.getElementById('player2-card');

    var player1Weapon = document.getElementById('player1-weapon');
    var player2Weapon = document.getElementById('player2-weapon');


    if (player1.id == "player1" || player2.id == "player2") {
      player1Health.innerHTML = "Health: " + player1.health;
      player2Health.innerHTML = "Health: " + player2.health;
      player1Weapon.innerHTML = "Weapon: " + player1.weapon.id;
      player2Weapon.innerHTML = "Weapon: " + player2.weapon.id;
      player1Card.className = "card bg-primary";
      player2Card.className = "card"
    }
    else if (player1.id == "player2" || player2.id == "player1") {
      player1Health.innerHTML = "Health: " + player2.health;
      player2Health.innerHTML = "Health: " + player1.health;
      player1Weapon.innerHTML = "Weapon: " + player2.weapon.id;
      player2Weapon.innerHTML = "Weapon: " + player1.weapon.id;
      player2Card.className = "card bg-primary"
      player1Card.className = "card";
    }
  },
}

class Player {
  constructor(id, name, weapon) {
    this.type = 'player'
    this.id = id;
    this.name = name;
    this.weapon = weapon;
    this.health = 100;
    this.position = { y: 0, x: 0 };
    this.moves = 3;
    this.defend = false;
    this.fighting = false;
  }

  attack(target) {
    var attackDamage = 0;
    if (target.defend) {
      attackDamage = this.weapon.damage / 2;
    } else if (!target.defend) {
      attackDamage = this.weapon.damage;
    }
    target.health = target.health - attackDamage

    if (target.health <= 0) {
      return "Game Over";
    }
  }
}

class Weapon {
  constructor(id, damage, defense) {
    this.type = 'weapon'
    this.id = id;
    this.damage = damage;
    this.defense = defense;
    this.position = { y: 0, x: 0 };
  }
}

class Obstacle {
  constructor(id) {
    this.type = 'obstacle';
    this.id = id;
    this.position = { y: 0, x: 0 };
  }
}
document.getElementById("submit").onclick = function () {
  var player1 = document.getElementById('playerOne').value
  var player2 = document.getElementById('playerTwo').value

  if (player1 == "") {
    alert('please enter player one name')
  }
  else if (player2 == "") {
    alert('please enter player two name')
  }
  else {
    var playerOne = new Player("player1", player1, { id: 'fist', damage: 10, defense: 5 })
    var playerTwo = new Player("player2", player2, { id: 'fist', damage: 10, defense: 5 })
    game.data.boardItems.players.push(playerOne)
    game.data.boardItems.players.push(playerTwo)

    var mapSize = document.getElementById("MapSize");
    console.log(mapSize.options[mapSize.selectedIndex].text)
    game.startGame(mapSize.options[mapSize.selectedIndex].text)
    game.populateBoard()
    game.genPlayers()
    game.genWeapons()
    game.genObstacles()
    game.updateConsole(playerOne, playerTwo);

    var player1Header = document.getElementById('player1-header');
    var player2Header = document.getElementById('player2-header');
    player1Header.innerHTML = playerOne.name;
    player2Header.innerHTML = playerTwo.name;

    var gameSettings = document.getElementById("GameSettings");
    gameSettings.style.display = 'none';
    var playerConsole = document.getElementById('console');
    playerConsole.style.display = 'flex';
    game.ready = true;
  }

}

document.getElementById("newGame").onclick = function () {
  game.ready = false;
  game.data.board = [];
  game.data.boardItems.players = [];
  game.data.boardItems.weapons = [];
  game.data.boardItems.objects = [];
  var gameSettings = document.getElementById("GameSettings");
  gameSettings.style.display = 'flex';
  var board = document.getElementById('board');
  board.innerHTML = ""
  var endGame = document.getElementById("endGame");
  endGame.style.display = 'none';
}

document.getElementById("playAgain").onclick = function () {
  var player = game.data.boardItems.players[0];
  var player2 = game.data.boardItems.players[1];
  game.ready = false;
  game.data.board = [];
  game.data.boardItems.players = [];
  game.data.boardItems.weapons = [];
  game.data.boardItems.objects = [];
  var board = document.getElementById('board');
  board.innerHTML = ""
  var playerOne = new Player("player1", player.name, { id: 'fist', damage: 10, defense: 5 })
  var playerTwo = new Player("player2", player2.name, { id: 'fist', damage: 10, defense: 5 })
  game.data.boardItems.players.push(playerOne)
  game.data.boardItems.players.push(playerTwo)

  var mapSize = document.getElementById("MapSize");
  console.log(mapSize.options[mapSize.selectedIndex].text)
  game.startGame(mapSize.options[mapSize.selectedIndex].text)
  game.populateBoard()
  game.genPlayers()
  game.genWeapons()
  game.genObstacles()
  game.updateConsole(player, player2);

  var player1Header = document.getElementById('player1-header');
  var player2Header = document.getElementById('player2-header');
  player1Header.innerHTML = player.name;
  player2Header.innerHTML = player2.name;

  var gameSettings = document.getElementById("GameSettings");
  gameSettings.style.display = 'none';
  game.ready = true;

  var endGame = document.getElementById("endGame");
  endGame.style.display = 'none';
}

//set fight mode so you cant move
$(document).keydown(function (e) {
  if (!game.ready) {
    return;
  }
  var player = game.data.boardItems.players[0];
  var player2 = game.data.boardItems.players[1];

  if (player.moves <= 0) {
    player.moves = 3
    game.endTurn();
    return
  }

  var newY = 0;
  var newX = 0;

  switch (e.which) {

    //player1 controls   
    case 37: // left
      newY = player.position.y
      newX = player.position.x - 1
      //if (player.id == "player1") {
      game.movePlayer(player, newY, newX)
      if (game.fight(newY, newX)) {
        alert("fight!")
      } else {
        player.fighting = false;
        player2.fighting = false;
      }
      // }
      break;

    case 38: // up
      newY = player.position.y - 1
      newX = player.position.x
      //if (player.id == "player1") {
      game.movePlayer(player, newY, newX)
      if (game.fight(newY, newX)) {
        alert("fight!")
      } else {
        player.fighting = false;
        player2.fighting = false;
      }
      // }
      break;

    case 39: // right
      newY = player.position.y
      newX = player.position.x + 1
      // if (player.id == "player1") {
      game.movePlayer(player, newY, newX)
      if (game.fight(newY, newX)) {
        alert("fight!")
      } else {
        player.fighting = false;
        player2.fighting = false;
      }
      //  }
      break;

    case 40: // down
      newY = player.position.y + 1
      newX = player.position.x
      //  if (player.id == "player1") {
      game.movePlayer(player, newY, newX)
      if (game.fight(newY, newX)) {
        alert("fight!")
      } else {
        player.fighting = false;
        player2.fighting = false;
      }
      //   }
      break;

    case 97: // 1 numpad
      console.log("1")
      console.log(player.fighting)
      //   if (player.id == 'player1') {
      if (player.fighting) {
        player.attack(player2)
        console.log(player)
        console.log(player2)
        console.log(player2.health)
        player.moves = 0;
        if (player.health <= 0 || player2.health <= 0) {
          game.gameOver();
        }
      }
      //  }
      break;

    case 98: // 2 numpad
      console.log("2")
      console.log(player.fighting)

      if (player.fighting) {
        player.defend = true;
        player.moves = 0;
      }
      break;

    default: return; // exit this handler for other keys
  }
  game.swapWeapons(player);
  game.updateConsole(player, player2);
  e.preventDefault(); // prevent the default action (scroll / move caret)
});
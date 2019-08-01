const player1 = {
  id: 'wollow',
  damage: 50,
  health: 100
}
const player2 = {
  id: 'imathi',
  damage: 30,
  health: 200
}
var board = [
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
]
const game1 = {

  spawnPlayer(player) {

    var random1 = Math.floor(Math.random() * board.length);
    var random2 = Math.floor(Math.random() * board[random1].length);
    board[random1][random2].push(player)
  },
  gen2dArray: function (cols, rows) {
    var arr = new Array(rows);
    for (i = 0; i < arr.length; i++) {
      rowDivs = document.createElement("div");
      arr[i] = new Array(cols)
      arr[i].push(rowDivs);
    }
    console.log(arr);
    return arr;
  },
  genMap: function (co, ro) {
    var container = document.getElementById("container");
    container.style = "display: flex;"
    var board1 = document.createElement("div");

    board1.style = 'flex-direction: column; height: 100vh;';
    container.appendChild(board1);

    for (var ii = 0; ii < ro; ii++) {
      var columns = document.createElement("div");
      columns.className = 'd-flex flex-grow-1';
      columns.style = 'flex-grow:0;  display: flex;'
      columns.id = "row-" + ii;
      board1.appendChild(columns);

      for (var i = 0; i < co; i++) {
        var rows = document.createElement("div");
        rows.className = 'text-primary border flex-grow-1';
        rows.style = 'display: flex; border-style: solid; height: 100px; width: 100px;'
        rows.id = "cell-" + ii + "-" + i;
        columns.appendChild(rows);
      }
    }
  },
  populateMap: function () {
    for (var i = 0; i < 6; i++) {
      var random1 = Math.floor(Math.random() * 5);
      var random2 = Math.floor(Math.random() * 5);

      var row = document.getElementById("cell-" + random1 + "-" + random2);
      row.style.backgroundColor = "yellow";

    }
  }
}

class Player {
  constructor(id, weapon) {
    this.id = id
    this.weapon = weapon
    this.health = 100
  }


}

const game = {
  data: {
    board: [],
    boardItems: {
      weapons: [],
      players: [],
      objects: [],
    }
  },

  genBoard(columns, rows) {
    for (let y = 0; y < columns; y++) {
      this.data.board[y].push([])
      for (let x = 0; x < rows; x++) {
        this.data.board[y][x].push([])
      }
    }
  }
}

var board = game.genBoard(4, 4)
console.log()
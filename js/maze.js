var Maze = (function() {
  var sizes = {
        cell: 32
      },
      directions = {
        n: { r: -1, c: 0, invert: 's' },
        e: { r: 0, c: 1, invert: 'w' },
        s: { r: 1, c: 0, invert: 'n' },
        w: { r: 0, c: -1, invert: 'e' }
      },
      containers = {},
      canvases = {},
      contexts = {},
      numRows = 4,
      numCols = 4,
      maze;

  function shuffle(arr) {
    var i, j, t;
    for (i = arr.length - 1; i > 0; --i) {
      j = Math.floor((i + 1) * Math.random());
      if (j == i) {
        continue;
      }
      t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }

  function findLeader(a) {
    while (a.leader != a) {
      a = a.leader;
    }
    return a;
  }

  function joinCell(a, b) {
    var leaderA = findLeader(a),
        leaderB = findLeader(b);
    if (leaderA == leaderB) {
      return;
    }
    a.leader = b.leader;
  }

  function initMaze() {
    var cell,
        r, c, i, d, R, C, neighbor;
    maze = new Array(numRows);
    for (r = 0; r < numRows; ++r) {
      maze[r] = new Array(numCols);
      for (c = 0; c < numCols; ++c) {
        cell = maze[r][c] = {
          initOrder: [ 'n', 'e', 's', 'w' ],
          walls: {}
        };
        for (i = 0; i < 4; ++i) {
          cell.walls[cell.initOrder[i]] = true;
        }
        shuffle(cell.initOrder);
        cell.leader = cell;
      }
    }
    for (i = 0; i < 4; ++i) {
      for (r = 0; r < numRows; ++r) {
        for (c = 0; c < numCols; ++c) {
          cell = maze[r][c];
          d = cell.initOrder[i];
          R = r + directions[d].r;
          C = c + directions[d].c;
          if (R < 0 || R >= numRows || C < 0 || C >= numCols) {
            continue;
          }
          neighbor = maze[R][C];
          if (findLeader(neighbor) == findLeader(cell)) {
            continue;
          }
          joinCell(cell, neighbor);
          cell.walls[d] = false;
          neighbor.walls[directions[d].invert] = false;
        }
      }
    }
  }

  function drawLine(x0, y0, x1, y1) {
    var context = contexts.maze;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
  }

  function paintMaze() {
    var unit = sizes.cell,
        r, c,
        x0, y0,
        walls;
    for (r = 0; r < numRows; ++r) {
      y0 = r * unit;
      for (c = 0; c < numCols; ++c) {
        x0 = c * unit;
        walls = maze[r][c].walls;
        if (!walls.n) {
          drawLine(x0, y0, x0 + unit, y0);
        }
        if (!walls.e) {
          drawLine(x0 + unit, y0, x0 + unit, y0 + unit);
        }
        if (!walls.s) {
          drawLine(x0, y0 + unit, x0 + unit, y0 + unit);
        }
        if (!walls.w) {
          drawLine(x0, y0, x0, y0 + unit);
        }
      }
    }
  }

  function initLayout() {
    var canvas,
        container;
    canvases.maze = canvas = document.createElement('canvas');
    contexts.maze = canvas.getContext('2d');
    canvas.width = numCols * sizes.cell;
    canvas.height = numRows * sizes.cell;
    containers.maze = container = document.createElement('div');
    container.id = 'mazeContainer';
    container.style.width = canvas.width + 'px';
    container.style.height = canvas.height + 'px';
    container.appendChild(canvas);
    document.body.appendChild(container);
  }

  function load() {
    initLayout();
    initMaze();
    paintMaze();
  }
  
  return {
    load: load
  };
})();
onload = Maze.load;

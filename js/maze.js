var Maze = (function() {
  var sizes = {
        cell: 32
      },
      containers = {},
      canvases = {},
      contexts = {},
      numRows = 10,
      numCols = 10,
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

  function initMaze() {
    var cell,
        r, c;
    maze = new Array(numRows);
    for (r = 0; r < numRows; ++r) {
      maze[r] = new Array(numCols);
      for (c = 0; c < numCols; ++c) {
        maze[r][c] = cell = {
          neighbors: {},
          initOrder: [ 'n', 'e', 's', 'w' ]
        };
        cell.initOrder.forEach(function (direction) {
          cell.neighbors[direction] = true;
        });
        shuffle(cell.initOrder);
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
        neighbors;
    for (r = 0; r < numRows; ++r) {
      y0 = r * unit;
      for (c = 0; c < numCols; ++c) {
        x0 = c * unit;
        neighbors = maze[r][c];
        if (!neighbors.n) {
          drawLine(x0, y0, x0 + unit, y0);
        }
        if (!neighbors.e) {
          drawLine(x0 + unit, y0, x0 + unit, y0 + unit);
        }
        if (!neighbors.s) {
          drawLine(x0, y0 + unit, x0 + unit, y0 + unit);
        }
        if (!neighbors.w) {
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

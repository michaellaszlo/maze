var Maze = (function() {
  var sizes = {
        cell: 20
      },
      containers = {},
      canvases = {},
      contexts = {},
      numRows = 10,
      numCols = 10,
      maze;

  function initMaze() {
    var r, c;
    maze = new Array(numRows);
    for (r = 0; r < numRows; ++r) {
      maze[r] = new Array(numCols);
      for (c = 0; c < numCols; ++c) {
        maze[r][c] = { neighbors: {} };
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
        if (!('n' in neighbors)) {
          drawLine(x0, y0, x0 + unit, y0);
        }
        if (!('e' in neighbors)) {
          drawLine(x0 + unit, y0, x0 + unit, y0 + unit);
        }
        if (!('s' in neighbors)) {
          drawLine(x0, y0 + unit, x0 + unit, y0 + unit);
        }
        if (!('w' in neighbors)) {
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

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
      buttons = {},
      canvases = {},
      contexts = {},
      numRows = 16,
      numColumns = 16,
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

  function findRoot(a) {
    if (a.parent != a) {
      a.parent = findRoot(a.parent);
    }
    return a.parent;
  }

  function cellString(a) {
    return '[' + a.r + ' ' + a.c + ']';
  }

  function joinCells(a, b, direction) {
    var direction,
        rootA = findRoot(a),
        rootB = findRoot(b);
    if (rootA == rootB) {
      return;
    }
    if (rootA.rank <= rootB.rank) {
      rootA.parent = rootB;
      if (rootA.rank == rootB.rank) {
        rootB.rank += 1;
      }
    } else {
      rootB.parent = rootA;
    }
    a.passage[direction] = b;
    b.passage[directions[direction].invert] = a;
  }

  // Generate a maze using Kruskal's algorithm as described on Wikipedia.
  function makeMaze() {
    var cell,
        r, c,
        walls = [];
    maze = new Array(numRows);
    for (r = 0; r < numRows; ++r) {
      maze[r] = new Array(numColumns);
      for (c = 0; c < numColumns; ++c) {
        cell = maze[r][c] = {
          r: r, c: c,
          passage: {}
        };
        cell.parent = cell;
        cell.rank = 0;
        if (r > 0) {
          walls.push({ a: maze[r - 1][c], b: cell, direction: 's' });
        }
        if (c > 0) {
          walls.push({ a: maze[r][c - 1], b: cell, direction: 'e' });
        }
      }
    }
    shuffle(walls);
    walls.forEach(function (wall) {
      joinCells(wall.a, wall.b, wall.direction);
    });
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
        passage,
        container = containers.maze,
        canvas = canvases.maze,
        context = contexts.maze;
    canvas.width = numColumns * sizes.cell;
    canvas.height = numRows * sizes.cell;
    container.style.width = canvas.width + 'px';
    container.style.height = canvas.height + 'px';
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (r = 0; r < numRows; ++r) {
      y0 = r * unit;
      for (c = 0; c < numColumns; ++c) {
        x0 = c * unit;
        passage = maze[r][c].passage;
        if (!passage.n) {
          drawLine(x0, y0, x0 + unit, y0);
        }
        if (!passage.e) {
          drawLine(x0 + unit, y0, x0 + unit, y0 + unit);
        }
        if (!passage.s) {
          drawLine(x0, y0 + unit, x0 + unit, y0 + unit);
        }
        if (!passage.w) {
          drawLine(x0, y0, x0, y0 + unit);
        }
      }
    }
  }

  function updateLayout(changeNumRows, changeNumColumns) {
    changeNumRows = changeNumRows || 0;
    changeNumColumns = changeNumColumns || 0;
    numRows += changeNumRows;
    numColumns += changeNumColumns;
    containers.numRows.innerHTML = numRows;
    containers.numColumns.innerHTML = numColumns;
    makeMaze();
    paintMaze();
  }

  function initializeLayout() {
    var canvas,
        container,
        buttonNames;
    canvases.maze = canvas = document.createElement('canvas');
    contexts.maze = canvas.getContext('2d');
    containers.maze = container = document.getElementById('maze');
    container.appendChild(canvas);
    document.body.appendChild(container);
    containers.numRows = document.getElementById('numRows');
    containers.numColumns = document.getElementById('numColumns');
    buttonNames = [ 'moreRows', 'fewerRows', 'moreColumns', 'fewerColumns' ];
    buttonNames.forEach(function (name) {
      buttons[name] = document.getElementById(name);
    });
    buttons.moreRows.onclick = function () { updateLayout(1, 0); };
    buttons.fewerRows.onclick = function () { updateLayout(-1, 0); };
    buttons.moreColumns.onclick = function () { updateLayout(0, 1); };
    buttons.fewerColumns.onclick = function () { updateLayout(0, -1); };
  }

  function load() {
    initializeLayout();
    updateLayout();
  }
  
  return {
    load: load
  };
})();
onload = Maze.load;

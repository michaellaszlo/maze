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
      numRows = 13,
      numColumns = 15,
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
    canvas.width = numColumns * sizes.cell + 4;
    canvas.height = numRows * sizes.cell + 4;
    container.style.width = canvas.width + 'px';
    container.style.height = canvas.height + 'px';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#434340';
    context.lineWidth = 2;
    drawLine(0, 1, canvas.width, 1);
    drawLine(canvas.width - 1, 0, canvas.width - 1, canvas.height);
    for (r = 0; r < numRows; ++r) {
      y0 = 3 + r * unit;
      for (c = 0; c < numColumns; ++c) {
        x0 = 1 + c * unit;
        passage = maze[r][c].passage;
        if (!passage.s) {
          drawLine(x0 - 1, y0 + unit, x0 + 1 + unit, y0 + unit);
        }
        if (!passage.w) {
          drawLine(x0, y0 - 1, x0, y0 + 1 + unit);
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
        buttonNames;
    containers.maze = document.getElementById('maze');
    canvases.maze = canvas = document.createElement('canvas');
    M.makeUnselectable(canvas);
    contexts.maze = canvas.getContext('2d');
    containers.maze.appendChild(canvas);
    containers.numRows = document.getElementById('numRows');
    containers.numColumns = document.getElementById('numColumns');
    buttonNames = [ 'moreRows', 'fewerRows', 'moreColumns', 'fewerColumns' ];
    buttonNames.forEach(function (name) {
      buttons[name] = document.getElementById(name);
      M.makeUnselectable(buttons[name]);
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

// https://www.geeksforgeeks.org/implementation-graph-javascript/

// p5js stuff
var gridWidth;
var cellWidth;
var bg;

var grid;
var pathGrid;
var path = [];
var initialized = false;
var select = false;
var enabled = true;
var index;

/**
 * Preload
 */
function preload() {
  bg = loadImage("./images/default.png");
}

/**
 * Runs once on page load
 */
function setup() {
    createCanvas(640, 640);
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(0, 0, 0);
}

/**
 * Main draw loop
 * 
 * Runs ~30x a second
 */
function draw() {
  // Set the background iamge
  background(bg);

  if (initialized) {
    updateGrid();

    drawGrid();
    
    let amt = 255.0 / path.length;
    let c = 0;
    if (path.length != 0) {
      for (let i = 0; i < path.length - 1; ++i) {
        let first = path[i];
        let second = path[i + 1];

        strokeWeight(5);
        stroke(c);

        line(
          first[0] * cellWidth + cellWidth / 2, 
          first[1] * cellWidth + cellWidth / 2,
          second[0] * cellWidth + cellWidth / 2, 
          second[1] * cellWidth + cellWidth / 2
        );
        c += amt;

        stroke(0);
      }
    }
  }
}

// Enable mouse input
function mousePressed() {
  select = true;
}

// Disable mouse input
function mouseReleased() {
  select = false;
}

/**
 * Update Grid
 * 
 * Updates the grid with the mouse input
 */
function updateGrid() {
  var xPos = Math.floor(mouseX / cellWidth);
  var yPos = Math.floor(mouseY / cellWidth);

  if (xPos >= 0 && xPos < gridWidth && yPos >= 0 && yPos < gridWidth && select) {
    if (enabled) {
      grid[yPos][xPos] = true;  
      pathGrid[yPos][xPos] = 0;
    } else {
      grid[yPos][xPos] = false;  
      pathGrid[yPos][xPos] = -1;
    }
    
  }
  
}

/**
 * Update Grid Data
 * 
 * @param a Grid Width, dimensions of the grid
 * @param b Cell Width, pixel dimensions of the cells
 * 
 */
function updateGridData(a, b) {
  gridWidth = a;
  cellWidth = b;

  initGrid();
}

/**
 * Update Background
 * 
 * @param bg_link Link to the background
 * 
 */
function updateBackground(bg_link) {
    bg = loadImage(bg_link);
}

/**
 * Set Enabled
 * 
 * Triggers the grid to enabling cells
 */
function setEnabled() {
  enabled = true;
}

/**
 * Set Disabled
 * 
 * Triggers the grid to disable cells
 */
function setDisabled() {
  enabled = false;
}

function generatePath() {
  // Find the starting point
  found = false;
  var point_x, point_y;
  for (let y = 0; y < gridWidth && !found; ++y) {
    for (let x = 0; x < gridWidth && !found; ++x) {
      if (pathGrid[y][x] == 0) {
        // First non-visited, enabled cell
        found = true;
        point_x = x, point_y = y;
      }
    }
  }

  path = [];
  index = 0;

  console.log(pathGrid);

  let oldGrid = [];

  for (let y = 0; y < gridWidth; ++y) {
    oldGrid[y] = [];
    for (let x = 0; x < gridWidth; ++x) {
      oldGrid[y][x] = pathGrid[y][x];
    }
  }

  //print(point_x + ", " + point_y);
  findPath(point_x, point_y);

  for (let y = 0; y < gridWidth; ++y) {
    pathGrid[y] = [];
    for (let x = 0; x < gridWidth; ++x) {
      pathGrid[y][x] = oldGrid[y][x];
    }
  }

  console.log("Path Length: " + path.length);
  pathString = "";
  for (let i = 0; i < path.length && path.length != 0; ++i) {
    pathString += "(" + path[i][0] + ", " + path[i][1] + ")\n";
  }
  console.log(pathString);
}



/**
 * This is really shit code, but its like 1 am after an 8 hour shift
 */
function findPath(x, y) {
  // If the grid is complted, stop calling
  if (checkGrid()) { return; }

  print(x + ", " + y + "\n");

  if (path.length > 1) {
    let back = path.length - 1
    let dist = abs(path[back][0] - x) + abs(path[back][1] - y);
    let toCopy = back;
    while (dist > 1) {
        --toCopy;
        path.push(path[toCopy]);
        ++back;
        dist = abs(path[back][0] - x) + abs(path[back][1] - y);
    }
  }


  path.push([x, y]);

  pathGrid[y][x] = 1;

  // Right Path
  if (x < gridWidth && pathGrid[y][x + 1] == 0) {
      findPath(x + 1, y);
  }

  // Left Path
  if (x > 0 && pathGrid[y][x - 1] == 0) {
      findPath(x - 1, y);
  }

  // Down Path
  if (y < gridWidth && pathGrid[y + 1][x] == 0) {
      findPath(x, y + 1);
  }

  // Up Path
  if (y > 0 && pathGrid[y - 1][x] == 0) {
      findPath(x, y - 1);
  }
}

function checkGrid() {
  for (let y = 0; y < gridWidth; ++y) {
    for (let x = 0; x < gridWidth; ++x) {
      if (pathGrid[y][x] == 0) { return false; }
    }
  }
  return true;
}

/**
 * Initialize Grid
 * 
 * Initializes a square, fully disabed grid
 */
function initGrid() {
  grid = [];
  pathGrid = [];
  path = [];
  for (let y = 0; y < gridWidth; ++y) {
    grid[y] = [];
    pathGrid[y] = [];
    for (let x = 0; x < gridWidth; ++x) {
      grid[y][x] = 0;
      pathGrid[y][x] = -1;
    }
  }
  initialized = true;
}

/**
 * Draw Grid
 * 
 * Draws the grid, transparent == disabled, translucent == enabled
 */
function drawGrid() {

  strokeWeight(1);

  for (let y = 0; y < gridWidth; ++y) {
    for (let x = 0; x < gridWidth; ++x) {
      if (grid[y][x] == 0){
        noFill();
      } else {
        fill(255, 0, 0, 100);
      }
      rect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }
  }
}
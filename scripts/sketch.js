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

  console.log(pathGrid);

  //print(point_x + ", " + point_y);
  next_point = []
  findPath(point_x, point_y);

  console.log("Path Length: " + path.length);
}



/**
 * This is really shit code, but its like 1 am after an 8 hour shift
 */
function findPath(x, y) {
  path.push([x, y]);    // Push the spot we are on
  pathGrid[y][x] = 1;    // Path the spot as visited

  console.log(x + ", " + y);

  // Left Side
  if (x > 0) {
    if (pathGrid[y][x - 1] == 0) {
      print("left");
      findPath(x - 1, y);
    }
  }

  // Top Side
  else if (y > 0) {
    if (pathGrid[y - 1][x] == 0) {
      print("top");
      findPath(x, y - 1);
    }
  }

  // Right Side
  else if (x < gridWidth - 1) {
    if (pathGrid[y][x + 1] == 0) {
      print("right");
      findPath(x + 1, y);
    }
  }

  // Bottom Side
  else if (y < gridWidth - 1) {
    if (pathGrid[y + 1][x] == 0) {
      print("bottom");
      findPath(x, y + 1);
    }
  } 
  // No immediate path found
  else {
    print("backtrack")
    // Loop back down path and check edges
    var new_point = pathGrid[pathGrid.length - 1];
    findPath(new_point[0], new_point[1]);
  }
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
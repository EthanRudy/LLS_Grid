// https://www.geeksforgeeks.org/implementation-graph-javascript/

// p5js stuff
var gridWidth;
var cellWidth;
var bg;

var grid;
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
    } else {
      grid[yPos][xPos] = false;  
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

/**
 * Initialize Grid
 * 
 * Initializes a square, fully disabed grid
 */
function initGrid() {
  grid = [];
  for (let y = 0; y < gridWidth; ++y) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; ++x) {
      grid[y][x] = 0;
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
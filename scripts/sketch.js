/**
 * OKAY READ THIS
 * 
 * These two js files interact really oddly.
 * They can sometimes talk to eachother via functions, but not access eachothers
 * global vars. Because that totally makes sense. Fuck JS
 * 
 * The general rule of thumb I, Ethan Rudy, have followed is, this file manages
 * HTML events, the map API, and any non-grid interactivity
 * sketch.js on the otherhand handles all canvas events & visuals, pathing, etc.
 */


// p5js stuff, dont mix it with index.js

var gridDimension;      // Grid dimension (its square)
var cellDimensionPix;   // Cell dimensions in pixels
var bg;                 // Background Image

var grid;                 // Selection Grid
var pathGrid;             // Path Grid (modified Selection grid)
var path = [];            // Path array
var initialized = false;  // Flag for if the index.js grid has been initialized
var clicked = false;      // Mouse clicked flag
var enabled = true;       // Cell Enable/Disable flag
/**
 * Preload function
 * 
 * Calls when the page is loading, BEFORE THE CANVAS IS CREATED
 */
function preload() {
  bg = loadImage("./images/default.png");
}

/**
 * Runs once on page full
 */
function setup() {

  // Canvas of max size of the free google static maps API 
  createCanvas(640, 640);

  // Set our fill color to black
  fill(0, 0, 0, 0);

  // Set line width to 1
  strokeWeight(1);

  // Set line color to black
  stroke(0, 0, 0);

  // Okay, I hope you see the pattern of rgb, cuz Im not gonna comment all the changes I make
}

/**
 * Main draw loop
 * 
 * Runs ~30x a second
 */
function draw() {
  // Set the background iamge
  background(bg);

  // If the grid has been initialized
  if (initialized) {
    // Update the grid
    // This polls events and detects mouse input
    updateGrid();

    // Draw the grid to the canvas
    drawGrid();
    
    // TEMPORARY
    // Draw path
    // Does some color stuff too!
    let amt = 255.0 / path.length;
    let c = 0;
    if (path.length != 0) {
      for (let i = 0; i < path.length - 1; ++i) {
        let first = path[i];
        let second = path[i + 1];

        strokeWeight(5);
        stroke(c);

        line(
          first[0] * cellDimensionPix + cellDimensionPix / 2, 
          first[1] * cellDimensionPix + cellDimensionPix / 2,
          second[0] * cellDimensionPix + cellDimensionPix / 2, 
          second[1] * cellDimensionPix + cellDimensionPix / 2
        );
        c += amt;

        stroke(0);
      }
    }
  }
}

// Enable mouse input
function mousePressed() {
  clicked = true;
}

// Disable mouse input
function mouseReleased() {
  clicked = false;
}

/**
 * Update Grid
 * 
 * Updates the grid using the onclick event back in index.js on the HTML button
 * This is an example of index.js being able to access sketch.js functions
 */
function updateGrid() {
  // Convert mouse coordinates to grid coordinates
  var xPos = Math.floor(mouseX / cellDimensionPix);
  var yPos = Math.floor(mouseY / cellDimensionPix);

  // Check bounds
  if (xPos >= 0 && xPos < gridDimension && yPos >= 0 && yPos < gridDimension && clicked) {
    // Enable mode
    if (enabled) {
      grid[yPos][xPos] = true;    // Enabled
      pathGrid[yPos][xPos] = 0;   // Not visited

    // Disable mode
    } else {
      grid[yPos][xPos] = false;   // Disabled
      pathGrid[yPos][xPos] = -1;  // DONT GO HERE, obv its not in the boundary
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
  gridDimension = a;
  cellDimensionPix = b;

  // Reset/Initialize all the grids
  initGrid();
}

/**
 * Update Background
 * 
 * @param bg_link Link to the background
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
 * Generate Path
 * 
 * TEMPRARY PART: Starting point is precomputed to be the most NW point, to make my life easier, do change this
 * 
 * Generates the path after finding the TEMPORARY starting point
 */
function generatePath() {
  // Find the starting point
  // BEGIN TEMPORARY
  found = false;
  var point_x, point_y;
  for (let y = 0; y < gridDimension && !found; ++y) {
    for (let x = 0; x < gridDimension && !found; ++x) {
      if (pathGrid[y][x] == 0) {
        // First non-visited, enabled cell
        found = true;
        point_x = x, point_y = y;
      }
    }
  }
  // END TEMPORARY

  path = [];  // Reset / Init path list

  // Copy the untouched pathGrid over to be replaced later
  // I put this here incase they regenerate the path without changing the grid size
  // Which would just append the new path to the old one and run on a modified pathGrid
  // Hence the copy and reset
  let oldGrid = [];
  for (let y = 0; y < gridDimension; ++y) {
    oldGrid[y] = [];
    for (let x = 0; x < gridDimension; ++x) {
      oldGrid[y][x] = pathGrid[y][x];
    }
  }

  // Find the path
  findPath(point_x, point_y);

  // Reset the pathGrid
  for (let y = 0; y < gridDimension; ++y) {
    pathGrid[y] = [];
    for (let x = 0; x < gridDimension; ++x) {
      pathGrid[y][x] = oldGrid[y][x];
    }
  }

  // Print path length :(
  console.log("Path Length: " + path.length);
}

/**
 * Find Path (recursive)
 * 
 * Simultaneously the best and worst function I've ever written
 */
function findPath(x, y) {
  // If the grid is completely visited, stop calling
  if (checkGrid()) { return; }

  // DEAD END CODE
  // Path is long enough to hit a dead end
  if (path.length > 1) {
    // .back() index like std::vector<>.back() from c++, this code is ported so I didn't have to debug in mozilla
    let back = path.length - 1
    // Distance between the last grid cell visited and where we are trying to go
    let dist = abs(path[back][0] - x) + abs(path[back][1] - y);
    // Index of the cell to backtrack through
    let toCopy = back;

    // While the jump is impossible
    while (dist > 1) {
        --toCopy;
        path.push(path[toCopy]);
        // Backtrack a cell

        ++back;
        dist = abs(path[back][0] - x) + abs(path[back][1] - y);
        // Calculate the new distance
    }
  }


  // Append where we are
  path.push([x, y]);
  // Mark where we are as visited
  pathGrid[y][x] = 1;

  // Right Path is in bounds and not-visited
  if (x < gridDimension && pathGrid[y][x + 1] == 0) {
      findPath(x + 1, y);
  }

  // Left Path is in bounds and not-visited
  if (x > 0 && pathGrid[y][x - 1] == 0) {
      findPath(x - 1, y);
  }

  // Down Path is in bounds and not-visited
  if (y < gridDimension && pathGrid[y + 1][x] == 0) {
      findPath(x, y + 1);
  }

  // Up Path is in bounds and not-visited
  if (y > 0 && pathGrid[y - 1][x] == 0) {
      findPath(x, y - 1);
  }
}

/**
 * Check Grid
 * 
 * @returns If the grid is completed
 */
function checkGrid() {
  for (let y = 0; y < gridDimension; ++y) {
    for (let x = 0; x < gridDimension; ++x) {
      if (pathGrid[y][x] == 0) { return false; }
    }
  }
  return true;
}

/**
 * Initialize Grid
 * 
 * Initializes a square, fully disabled grid, pathGrid
 * Resets path
 * Flags the grid as initialized
 */
function initGrid() {
  grid = [];
  pathGrid = [];
  path = [];
  for (let y = 0; y < gridDimension; ++y) {
    grid[y] = [];
    pathGrid[y] = [];
    for (let x = 0; x < gridDimension; ++x) {
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

  for (let y = 0; y < gridDimension; ++y) {
    for (let x = 0; x < gridDimension; ++x) {
      if (grid[y][x] == 0){
        noFill();
      } else {
        fill(255, 0, 0, 100);
      }
      rect(x * cellDimensionPix, y * cellDimensionPix, cellDimensionPix, cellDimensionPix);
    }
  }
}
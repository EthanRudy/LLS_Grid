// https://www.geeksforgeeks.org/implementation-graph-javascript/

// p5js stuff
var gridWidth;
var cellWidth;
var bg;

var grid;
var initialized = false;
var select = false;
var enabled = true;

// Runs when the page is loading
function preload() {
  bg = loadImage("./images/default.png");
}

// Runs once when the page is loaded
function setup() {
    createCanvas(640, 640);
    fill(0, 0, 0, 0);
    strokeWeight(1);
    stroke(0, 0, 0);
}

// Runs like 30x a second
function draw() {
  // Set the background iamge
  background(bg);

  if (initialized) {
    updateGrid();

    drawGrid();
  }
}

// Enable draw
function mousePressed() {
  select = true;
}

// Disable disable
function mouseReleased() {
  select = false;
}

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


function updateGridData(a, b) {
  gridWidth = a;
  cellWidth = b;

  initGrid();
}

function updateBackground(bg_link) {
    bg = loadImage(bg_link);
}

function setEnabled() {
  enabled = true;
}

function setDisabled() {
  enabled = false;
}

/**
 * 
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

// [https://maps.googleapis.com/maps/api/staticmap?center=33.434129,-111.93277599999999&zoom=18&maptype=satellite&size=640x640&key=AIzaSyBMXidTHFP4iLQDGxo34ODeXp7dMn6869Q] is correct, hosting the image online, or running a local server.[https://github.com/processing/p5.js/wiki/Local-server]
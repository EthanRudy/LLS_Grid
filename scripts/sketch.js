// p5js stuff
var gridWidth;
var cellWidth;
var bg;

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

  for (let x = 0; x < gridWidth; ++x) {
    for (let y = 0; y < gridWidth; ++y) {
      rect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    }
  }
}

function updateGridData(a, b) {
  gridWidth = a;
  cellWidth = b;
}

function updateBackground(bg_link) {
    bg = loadImage(bg_link);
    console.log(bg_link);
}

// [https://maps.googleapis.com/maps/api/staticmap?center=33.434129,-111.93277599999999&zoom=18&maptype=satellite&size=640x640&key=AIzaSyBMXidTHFP4iLQDGxo34ODeXp7dMn6869Q] is correct, hosting the image online, or running a local server.[https://github.com/processing/p5.js/wiki/Local-server]
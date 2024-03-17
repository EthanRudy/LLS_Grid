/*
API KEY
  https://console.cloud.google.com/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_tile&project=modular-rex-411620

  AIzaSyBMXidTHFP4iLQDGxo34ODeXp7dMn6869Q
*/

/**
 * TODO
 * 
 * Calculate the correct zoom amount 
 *  OR
 * Calculate cells per zoom level
 * 
 * The above options are used to calculate how many cells to put on the canvas
 * 
 * Transfer Image to the selection page
 * using the computed URL
 * 
 * Implement a p5js canvas with the transfered image & the # of cells needed
 * 
 * Port the draw code over to p5/processing
 */

var mapObject;          // Map object
var rectangle;    // Rectangle Object
var infowindow;   // Info window

var marker1;      // North West Marker
var marker2;      // South East Marker

var rectangleLat = [];
var rectangleLng = [];

// Map options
var mapOptions;   // Maps API tags


function initMap() {

  var infowindow = new google.maps.InfoWindow();

  mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(33.434625, -111.939896),
    mapTypeId: 'satellite'
  };

  // Create map with given options
  mapObject = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Initialize Marker 1
  marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(33.434669, -111.933374),
    map: mapObject,
    draggable: true,
    title: 'marker1'
  });
  // Add the 'click for info' listener
  google.maps.event.addListener(marker1, 'click', function (evt) {
    infowindow.setContent("Top Left: " + marker1.getPosition().toUrlValue(6));
    infowindow.open(mapObject, this);
  });

  // Initialize Marker 2
  marker2 = new google.maps.Marker({
    position: new google.maps.LatLng(33.433589, -111.932178),
    map: mapObject,
    draggable: true,
    title: 'marker2'
  });
  // Add the 'click for info' listener
  google.maps.event.addListener(marker2, 'click', function (evt) {
    infowindow.setContent("Bottom Right: " + marker2.getPosition().toUrlValue(6));
    infowindow.open(mapObject, this);
  });

  // Initialize Rectangle visuals
  rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: mapObject,
    bounds: new google.maps.LatLngBounds(
      marker1.getPosition(),
      marker2.getPosition())
  });

  // Calculate side lengths
  var leftSideDist = Math.round((marker2.getPosition().lng() - marker1.getPosition().lng()) * 10000) / 100;
  var belowSideDist = Math.round((marker2.getPosition().lat() - marker1.getPosition().lat()) * 10000) / 100;

  // Add drag end events to remake the grid after a marker has been moved
  google.maps.event.addListener(marker1, 'dragend', function () {
    rectangle.setBounds(new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition()));
    leftSideDist = Math.round((marker2.getPosition().lng() - marker1.getPosition().lng()) * 10000) / 100;
    clearGrid();
  });
  google.maps.event.addListener(marker2, 'dragend', function () {
    rectangle.setBounds(new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition()));
    belowSideDist = Math.round((marker2.getPosition().lat() - marker1.getPosition().lat()) * 10000) / 100;
    clearGrid();
  });

  // Make the first initial grid
  //makeGrid();
  var genButton = document.getElementById("grid_button");
  genButton.addEventListener("click", makeGrid);
  var enButton = document.getElementById("enable_button");
  var diButton = document.getElementById("disable_button");
  enButton.addEventListener("click", setEnabled);
  diButton.addEventListener("click", setDisabled);
  var pathButton = document.getElementById("generate_path")
  pathButton.addEventListener("click", generatePath);
}

function makeGrid() {
  // Reset for the new grid
  // Needed to clear out the old grid
  clearGrid();

  var m1Lat = marker1.getPosition().lat();
  var m1Lng = marker1.getPosition().lng();
  var m2Lat = marker2.getPosition().lat();
  var m2Lng = marker2.getPosition().lng();
  
  var leftSideDist = m2Lng - m1Lng;
  var belowSideDist = m2Lat - m1Lat;

  

  // CHANGLE ALL OF THIS TO AUTO CALCULATE ~DONE~
  // https://stackoverflow.com/questions/3024404/transform-longitude-latitude-into-meters
  var circumAtLat = 40075160 * Math.cos(toRadians(m1Lat));
  var dividerLat = Math.abs(belowSideDist) * circumAtLat / 360;
  var dividerLng = Math.abs(leftSideDist) * 40008000 / 360;
  dividerLat = Math.round(dividerLat / 5); // 5 Meters
  dividerLng = Math.round(dividerLng / 5); // 5 Meters

  var excLat = belowSideDist / dividerLat;
  var excLng = leftSideDist / dividerLng;

  // Add data to the info panel
  //document.getElementById('info').innerHTML += "dividerLat=" + dividerLat + ", excLat=" + excLat + "<br>";
  //document.getElementById('info').innerHTML += "dividerLng=" + dividerLat + ", excLng=" + excLng + "<br>";
  //document.getElementById('info').innerHTML += "m1=" + marker1.getPosition().toUrlValue(6) + "<br>";
  //document.getElementById('info').innerHTML += "m2=" + marker2.getPosition().toUrlValue(6) + "<br>";

  // Draw Grid
  for (var i = 0; i < dividerLat; i++) {
    if (rectangleLng[i] == null) rectangleLng[i] = [];

    for (var j = 0; j < dividerLng; j++) {

      if (rectangleLng[i][j] = null) rectangleLng[i][j] = {};


      rectangleLng[i][j] = new google.maps.Rectangle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: mapObject,
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(m1Lat + (excLat * i), m1Lng + (excLng * j)),
          new google.maps.LatLng(m1Lat + (excLat * (i + 1)), m1Lng + (excLng * (j + 1))))

      });
      //document.getElementById('info').innerHTML += "[i=" + i + ",j=" + j + "]:" + rectangleLng[i][j].getBounds() + "<br>";



    } // Lat Loop ends

  } // Lng Loop ends


  document.getElementById('left').value = leftSideDist;
  document.getElementById('bottom').value = belowSideDist;

  let meters_per_pixel = 156543.03392 * Math.cos(mapObject.getCenter().lat() * Math.PI / 180) / Math.pow(2, mapObject.getZoom());
  
  // Canvas is 600 / 600, need amount of 5 m grid cells that fit 
  let canvasGridDim = 600 * meters_per_pixel / 5;
  let pixelsPerSquare = 640.0 / canvasGridDim;

  updateGridData(canvasGridDim, pixelsPerSquare);

  toImage();
}

/**
 * Clear Grid
 * 
 * Clears the current grid rectangles
 */
function clearGrid(){
  for (var x in rectangleLng) {
    for (var y in rectangleLng[x]) {
      if (rectangleLng[x][y] != null && rectangleLng[x][y].setMap) {
        rectangleLng[x][y].setMap(null)
        rectangleLng[x][y] = null;
      }
    }
  }
}


/**
 * To Image
 * 
 * Exports the current map view and data 
 * and pipes it into an image tag
 */
// https://developers.google.com/maps/documentation/maps-static/start
function toImage() {

  // Get both the markers' position
  var nW = marker1.getPosition();
  var sE = marker2.getPosition();

  // Find the center of the selected area
  var latCenter = (nW.lat() + sE.lat()) / 2;
  var lngCenter = (nW.lng() + sE.lng()) / 2;
  // Starter URL
  var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";

  // Set the current center of the map using the calcuated center of the target area
  staticMapUrl += "?center=" + latCenter + "," + lngCenter;

  // Set the current zoom of the map
  staticMapUrl += "&zoom=" + mapObject.getZoom();
  // https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds

  // Set the current visual mode of the map
  staticMapUrl += "&maptype=" + "satellite";

  // Set the output size
  staticMapUrl += "&size=640x640";

  // Set the API key value
  staticMapUrl += "&key=" + "AIzaSyBMXidTHFP4iLQDGxo34ODeXp7dMn6869Q";


  // https://github.com/processing/p5.js/wiki/Embedding-p5.js
  // Set the background image
  updateBackground(staticMapUrl);
}

/**
 * To Radians
 * 
 * @param degrees Angle measurement in degrees
 * 
 * @return Converted angle measurement in radians
 */
function toRadians(degrees){
  return degrees * Math.PI / 180;
}

window.initMap = initMap;



/**
 * meters_per_pixel = 156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, zoom)
 */
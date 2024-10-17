
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

/**
 * TODO:
 * 
 * NEEDED:
 *  Adjust grid to canvas lat lng error
 * 
 * Optional:
 *  Optimize Pathfinding
 */

var mapObject;    // Map API object
var rectangle;    // Rectangle Object
var infowindow;   // Info window

var marker1;      // North West Marker
var marker2;      // South East Marker

var mapOptions;   // Maps API option tags

/**
 * Initialize Map
 * 
 * Is called when the website loads
 * 
 * The follwing happens:
 * - Initializes the map object with som default parameters (mostly for testing and will be changed later)
 * - It places two interactive markers, a NW and SE
 * - Draws the translucent rectangle visualizing the geo-fence
 */
function initMap() {

  // Create the info window
  var infowindow = new google.maps.InfoWindow();

  // Default map options
  mapOptions = {
    zoom: 16,   
    // !READ ME! Zoom is stupid, TLDR: 16 is twice as zoomed as 15, and 17 is twice is zoomed as 16. Zoom Level = (x - 1) * 2 == x == (x + 1) / 2
    // It is an INTEGER, meaning theres no middle ground, everytime you zoom in or out, you lose/gain 2x the detail, not very customizable i know :(

    center: new google.maps.LatLng(33.434625, -111.939896),
    // Tempe default value

    mapTypeId: 'satellite'
    // Default view mode, others are still enabled
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
  // Add the 'click for info' listener to marker 1
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
  // Add the 'click for info' listener to marker 2
  google.maps.event.addListener(marker2, 'click', function (evt) {
    infowindow.setContent("Bottom Right: " + marker2.getPosition().toUrlValue(6));
    infowindow.open(mapObject, this);
  });

  // Initialize Rectangle visuals (Translucent Red)
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

  // Calculate approximate side lengths in arc seconds
  var leftSideDist = Math.round((marker2.getPosition().lng() - marker1.getPosition().lng()) * 10000) / 100;
  var belowSideDist = Math.round((marker2.getPosition().lat() - marker1.getPosition().lat()) * 10000) / 100;

  // Add drag end events to remake the grid after a marker has been moved
  google.maps.event.addListener(marker1, 'dragend', function () {
    rectangle.setBounds(new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition()));
    leftSideDist = Math.round((marker2.getPosition().lng() - marker1.getPosition().lng()) * 10000) / 100;
  });
  google.maps.event.addListener(marker2, 'dragend', function () {
    rectangle.setBounds(new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition()));
    belowSideDist = Math.round((marker2.getPosition().lat() - marker1.getPosition().lat()) * 10000) / 100;
  });




  // HTML Button Listeners

  // Generate Grid Button
  let genButton = document.getElementById("grid_button");
  genButton.addEventListener("click", makeGrid);

  // Enable and Disable Cell(s) Button
  let enButton = document.getElementById("enable_button");
  let diButton = document.getElementById("disable_button");
  enButton.addEventListener("click", setEnabled);
  diButton.addEventListener("click", setDisabled);

  // Generate Path Button
  let pathButton = document.getElementById("generate_path")
  pathButton.addEventListener("click", generatePath);
}

/**
 * Make Grid (Map API)
 * 
 * Creates a grid on the
 */
function makeGrid() {

  // Grabbing positions to make life easier & code readable
  let m1Lat = marker1.getPosition().lat();
  let m1Lng = marker1.getPosition().lng();
  let m2Lat = marker2.getPosition().lat();
  let m2Lng = marker2.getPosition().lng();
  
  // Calculate side lengths
  let leftSideDist = m2Lng - m1Lng;
  let belowSideDist = m2Lat - m1Lat;

  

  // Calculate the correct dimensions based of longitude and latitude
  let circumAtLat = 40075160 * Math.cos(toRadians(m1Lat));
  let dividerLat = Math.abs(belowSideDist) * circumAtLat / 360;
  let dividerLng = Math.abs(leftSideDist) * 40008000 / 360;
  dividerLat = Math.round(dividerLat / 5); // 5 Meters
  dividerLng = Math.round(dividerLng / 5); // 5 Meters

  // Add data to the info panel
  // Uncomment to get them back lol
  /**
   * let excLat = belowSideDist / dividerLat;
   * let excLng = leftSideDist / dividerLng;
   * document.getElementById('info').innerHTML += "dividerLat=" + dividerLat + ", excLat=" + excLat + "<br>";
   * document.getElementById('info').innerHTML += "dividerLng=" + dividerLat + ", excLng=" + excLng + "<br>";
   * document.getElementById('info').innerHTML += "m1=" + marker1.getPosition().toUrlValue(6) + "<br>";
   * document.getElementById('info').innerHTML += "m2=" + marker2.getPosition().toUrlValue(6) + "<br>";
   */


  /**
   * We used to draw the grid on the maps API object, but I thought it was confusing
   * It was here, obv not anymore
   */

  // Set distance
  document.getElementById('left').value = leftSideDist;
  document.getElementById('bottom').value = belowSideDist;

  // Find the meters per pixel ratio
  let meters_per_pixel = 156543.03392 * Math.cos(mapObject.getCenter().lat() * Math.PI / 180) / Math.pow(2, mapObject.getZoom());
  
  // Canvas is 600 / 600, need amount of 5 m grid cells that fit 
  let canvasGridDim = 600 * meters_per_pixel / 5;
  let pixelsPerSquare = 640.0 / canvasGridDim;

  // Send the data to sketch.js
  updateGridData(canvasGridDim, pixelsPerSquare);

  // Convert the maps API data to a static maps API image, yes its two difference services (also to the p5js canvas)
  toImage();
}

/**
 * To Image
 * 
 * Exports the current map view data to the google "static maps" API. 
 * and pipes it to sketch.js
 * 
 * TLDR: Take the current view, and make it an image, and put it in on the canvas
 */
function toImage() {

  // Get both the markers' position
  var nW = marker1.getPosition();
  var sE = marker2.getPosition();

  // Find the center of the selected area
  var latCenter = (nW.lat() + sE.lat()) / 2;
  var lngCenter = (nW.lng() + sE.lng()) / 2;


  // API Request creation

  // Starter URL
  var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";

  // Set the current center of the map using the calcuated center of the target area
  staticMapUrl += "?center=" + latCenter + "," + lngCenter;

  // Set the current zoom of the map
  staticMapUrl += "&zoom=" + mapObject.getZoom();

  // Set the current visual mode of the map
  staticMapUrl += "&maptype=" + "satellite";

  // Set the output size
  staticMapUrl += "&size=640x640";

  // Set the API key value
  staticMapUrl += "&key=" + "API_KEY";

  // Set the background image (pipe to sketh.js)
  updateBackground(staticMapUrl);
}

/**
 * To Radians
 * Degrees to radians, Duh
 * 
 * @param degrees Angle measurement in degrees
 * 
 * @return Converted angle measurement in radians
 */
function toRadians(degrees){
  return degrees * Math.PI / 180;
}

// Load function
window.initMap = initMap;

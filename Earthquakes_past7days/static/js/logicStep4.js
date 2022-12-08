// Add console.log to check to see if our code is working.
console.log("working");





// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let ss = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
//streets.addTo(map);

//earthquake layer for map
let earthquakes = new L.layerGroup();

let overlays = {
    Earthquakes:earthquakes
};


let baseMaps = {
    Streets: streets,
    Satellite: ss
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})


// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// adding airport geojson url
let quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// add style info for markers
function styleInfo (feature) {
    return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5    
    };
};

// create function to determine radii we want based on mag
function getRadius(magnitude) {
    if (magnitude ===0){
        return 1;
    }
    return magnitude * 4;
};

// create function to determine color of circle markers based on mag
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
    return "#ee9c00";
    }
    if (magnitude > 2) {
    return "#eecc00";
    }
    if (magnitude > 1) {
    return "#d4ee00";
    }
    return "#98ee00";
    };



// Grabbing our GeoJSON data.
d3.json(quakeData).then(function(data) {
    
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data,
    { 
        // turn each feature into a circlemarker
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // set style
        style: styleInfo,
        //create popup
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
});
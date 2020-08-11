var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var boundaryUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function markerSize(num) {
  return num * 40000;
}

// d3.json(boundaryUrl, function(d) {
//   return {
//     city : d.city,
//     state : d.state,
//     population : +d.population,
//     land_area : +d["land area"]
//   };
// }).then(function(data) {
//   console.log(data[0]);
// });
// var magnitudes = []

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  eqData = data
  // Once we get a response, send the data.features object to the createFeatures function
  // createFeatures(data.features);
  console.log(data.features[0])

  var locations = []

  for (var i = 0; i < data.features.length; i++) {
    // // Setting the marker radius for the state by passing population into the markerSize function
    // console.log([data.features[i].geometry.coordinates[0],data.features[i].geometry.coordinates[1]])
    latlng = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]    
    // console.log(latlng)
    // var randomColor = '#'+Math.floor(data.features[i].properties.mag*(16777215/)).toString(16);
    if (data.features[i].properties.mag > 7){
      randomColor="#f70505"
    }
    else if (data.features[i].properties.mag > 6){
      randomColor="#f75605"
    }
    else if (data.features[i].properties.mag > 5){
      randomColor="#f78e05"
    }
    else if (data.features[i].properties.mag > 4){
      randomColor="#f7c305"
    }
    else if (data.features[i].properties.mag > 3){
      randomColor="#a6f705"
    }
    else if (data.features[i].properties.mag > 2){
      randomColor="#05f786"
    }
    else {
      randomColor="#05f7f7"
    }

    locations.push(
      L.circle(latlng, {
        stroke: false,
        fillOpacity: 0.75,
        // color: "white",
        // fillColor: "white",
        // radius: 50
        color: randomColor,
        fillColor: randomColor,
        radius: markerSize(data.features[i].properties.mag)
      })
    );
  }
  console.log(locations)

  
  
  var satelite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  });
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: 'pk.eyJ1Ijoiam9lbWlsbGVyNDUwMCIsImEiOiJja2Jud2RwcDkwNjk2Mm5qejBvdGh6ZHJ0In0.GCI6bvKOIR1VYDu87nY8Ow'
  });
  
  var quakes = L.layerGroup(locations);
  
  // Create a baseMaps object
  var baseMaps = {
    "Satelite Map": satelite,
    "Light Map": lightmap,
    "Outdoors": outdoors
  };
    
  // console.log(quakes)
  
  // Create an overlay object
  var overlayMaps = {
    "Earthquakes": quakes
  };
  
  // Define a map object
  var myMap = L.map("map", {
    center: [0,0],
    zoom: 3,
    layers: [satelite, quakes]
  });

  // // Create a control for our layers, add our overlay layers to it
  // L.control.layers(null).addTo(myMap);

  // // Create a legend to display information about our map
  // var info = L.control({
  //   position: "bottomright"
  // });

  // // When the layer control is added, insert a div with the class of "legend"
  // info.onAdd = function() {
  //   var div = L.DomUtil.create("div", "legend");
  //   return div;
  // };
  // // Add the info legend to the map
  // info.addTo(myMap);
  // document.querySelector(".legend").innerHTML = [
  //   // "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
  //   "<p>Legend ", "</p>"
  // ].join("");

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Richter Scale</h4>";
    div.innerHTML += '<i style="background: #f70505"></i><span>7+</span><br>';
    div.innerHTML += '<i style="background: #f75605"></i><span>6+</span><br>';
    div.innerHTML += '<i style="background: #f78e05"></i><span>5+</span><br>';
    div.innerHTML += '<i style="background: #f7c305"></i><span>4+</span><br>';
    div.innerHTML += '<i style="background: #a6f705"></i><span>3+</span><br>';
    div.innerHTML += '<i style="background: #05f786"></i><span>2+</span><br>';
    div.innerHTML += '<i style="background: #05f7f7"></i><span>> 2</span><br>';
    
    

    return div;
  };

  legend.addTo(myMap);

  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Grabbing our GeoJSON data..
  d3.json(boundaryUrl, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });
});

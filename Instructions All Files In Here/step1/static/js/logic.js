//Creating map, adding in layer

var myMap = L.map("map", {
	center: [40.0, -95.0],
	zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);
//Adding in dataset for all week
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



//create a function which determins the color of the circles by magnatiude
function chooseColor(mag) {
  
  if (mag >= 4) {
    return "#FF0000";
  }
  else if (mag >= 3) {
    return "#FFFF00";
  }
  else if (mag >= 2) {
    return "#0000FF";
  }
  else if (mag >=1) {
    return "#00FF00";
  }
  else {
    return "#808080";
  };
};

var geojson;

//Update with All Week data
d3.json(link, function(data) {
  console.log(data);

  geojson = L.geoJson(data, {

    //Add circle markers
    pointToLayer: function(feature, latlng) {

      //pointToLayer to take the coordinates and create circle markers
      return new L.circleMarker(latlng, {

            radius: feature.properties.mag*10,
            color: "white",
            fillColor: chooseColor(feature.properties.mag),
            fillOpacity: .8,
            weight: 2
      });
    },

    //Hover Features

    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 1
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.8
          });
        },
      });

      layer.bindPopup("<h1>Earthquake!!</h1><hr><h2>Location: "+feature.properties.place+"</h2><hr><h3> Magnitude: "+feature.properties.mag+"</h3>");
    }
  }).addTo(myMap);

  // Create Legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    
    var div = L.DomUtil.create("div", "info legend");
    
    //list out the category lables and match colors
    var categories = ["Mag 4+", "Mag 3-4","Mag 2-3", "Mag 1-2", "Mag <1"];
    var colors = ["#FF0000", "#FFFF00", "#0000FF","#00FF00","#808080"];

    //Add header and title to legend
    var legendInfo = "<h3>Legend<h3>"

    div.innerHTML = legendInfo;

    //Labels/colors to legend
    for (i=0; i<colors.length; i++) {

      div.innerHTML +=
      '<li style=\"background:' + colors[i] +'"></li>' +(categories[i] ? categories[i] +'<br>' : '+')

    }

      return div;
  }
  //Post legend on map   
  legend.addTo(myMap)
    



});
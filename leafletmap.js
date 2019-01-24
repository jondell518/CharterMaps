window.onload = function () {
  //Initialize the custom colored icons
  var LGIcon = L.icon({
  	iconUrl: 'LGICON.gif',
  	iconSize: [35, 65],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    /*shadowUrl: 'marker-shadow.png',
    shadowSize: [35, 35],
    shadowAnchor: [0, 0]*/
	});


  var LYIcon = L.icon({
  	iconUrl: 'LYIconCleaned.gif',
  	iconSize: [30, 63],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    /*shadowUrl: 'marker-shadow.png',
    shadowSize: [35, 35],
    shadowAnchor: [0, 0]*/
	});



  var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  minZoom: 5,
  maxZoom: 10,
  }); //This is the defaul basemap
  

  var basemap2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 5,
  maxZoom: 16,
  ext: 'jpg'
}); //This is an extra basemap that as of now is just for testing


   var map = L.map('my-map').setView([49.653926, 8.567507], 6); //Creates the basemap and centers it on Worms for the time being
   basemap.addTo(map); //Adds the basemap to the map
   //L.marker([49.653926, 8.567507], {icon: LGIcon}).addTo(map);


  /*This function takes two inputs: the geoJSON data and the icon you want to use for the layer. It then sets the icon and adds a popup
  on each point with the name of the location (recipient), the year of the grant, and the place it was redacted. It then returns the layer */
  var createNewLayer = function(geoJSON, icon)
  {

    var leafletLayer = L.geoJson(geoJSON, {
      onEachFeature: function (feature, layer){
        layer.setIcon(icon);
        layer.bindPopup(feature.properties.Recpient + "<br>" + "Year: " + feature.properties.Year + "<br>" + "Place Redacted: " + feature.properties.PlaceRedacted).openPopup();
      }
    })

    return leafletLayer;


    //var geojson;
    /*$.ajaxSetup({
    async: false
    }); //This wasnt working before because it made an ayshcronous ajax call, need to override that for it to update funcjson properly
    $.getJSON(geoJSON, function(data) {

    funcjson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
      	layer.setIcon(icon);
        layer.bindPopup(feature.properties.Recpient + "<br> " + "Year: " + feature.properties.Year + "<br>" + "Place Redacted: " + feature.properties.PlaceRedacted).openPopup();
      }// this creates the json layer and adds the popup boxes which show the place name, the year of the charter, and the place the charter was redacted.
    });
  });
    return funcjson;*/
  }; //This function takes an input for the url of the geoJSON file, and then creates a Leaflet JSON layer from it. It then returns the Leaflet JSON layer.
  

    var allRecip = createNewLayer(frankfurtGeoJson,LGIcon); //Set up the layer with all charter recipients
    //var FrankfurtOnly = createNewLayer("FrankfurtR.geojson", LYIcon); //Set up the layer with only the Frankfurt recipients
    //var RegensburgOnly = createNewLayer("RegensburgR.geojson", LYIcon); //Set up the layer with only the Regensburg recipients
    
    var baseTree = {
      label: 'Base Layers',
      children: [
          {label: 'Base Layer 1', layer: basemap},
          {label: 'Base Layer 2', layer: basemap2},


      ]
    }

    L.control.layers.tree(baseTree, null).addTo(map);

  //This is the layer control code, it creates two types: base layers (which don't matter at the moment) and overlays (the different recipient groupings)
  var baseLayers = {
    "Base map": basemap,
    "Base map 2": basemap2
  }

  var overlays = {
  	"Louis The German (827-876)": allRecip,
    /*"Louis the Younger (876-882)": FrankfurtOnly,
    "Carloman (876-880)": RegensburgOnly,
    "Charles the Fat (876-887)": allRecip,
    "Arnulf of Carinthia (887-899)": allRecip*/
  };
  console.log("made it here");
  //L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);
  console.log("made it here");
};


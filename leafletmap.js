window.onload = function () {

  var initIcons = function(imageFile){
  	//Icons taken from pointhi: can be found at https://github.com/pointhi/leaflet-color-markers

 	var icon = L.icon({
  		iconUrl: imageFile,
  		iconSize: [25, 41],
    	iconAnchor: [12, 41],
   		popupAnchor: [0, -34],
    	shadowUrl: 'marker-shadow.png',
    	shadowSize: [41, 41],
	});

	return icon;
  }
  
//Initialize the custom colored icons
var LGIcon, LYIcon, CaIcon, CFIcon, AIcon;
LGIcon= initIcons('marker-icon-red.png');
LYIcon = initIcons('marker-icon-blue.png');
CaIcon = initIcons('marker-icon-orange.png');
CFIcon = initIcons('marker-icon-violet.png');
AIcon = initIcons('marker-icon-green.png');

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


  /*This function takes two inputs: the geoJSON data and the icon you want to use for the layer. It then sets the icon and adds a popup
  on each point with the name of the location (recipient), the year of the grant, and the place it was redacted. It then returns the layer */
  var createNewLayer = function(geoJSON, icon)
  {

    var leafletLayer = L.geoJson(geoJSON, {
      onEachFeature: function (feature, layer){
        layer.setIcon(icon);
        layer.bindPopup(feature.properties.Recipient + "<br>" + "Year: " + feature.properties.Year + "<br>" + "Place Redacted: " + feature.properties.PlaceRedacted).openPopup();
      }
    })

    return leafletLayer;
  }; //This function takes an input for the url of the geoJSON file, and then creates a Leaflet JSON layer from it. It then returns the Leaflet JSON layer.
  

    var ARecipients = createNewLayer(AJSON,AIcon);
    var LGRecipients = createNewLayer(LGJSON, LYIcon); 
   //LGRecipients.addTo(map);
   //ARecipients.addTo(map);
  //This is the layer control code, it creates two types: base layers (which don't matter at the moment) and overlays (the different recipient groupings)
  var baseLayers = {
    "Base map": basemap,
    "Base map 2": basemap2
  }

  var overlays = {

  	"Louis the German (827-876)": LGRecipients,
    "Louis the Younger (876-882)": ARecipients,
    "Carloman (876-880)": ARecipients,
    "Charles the Fat (876-887)": ARecipients,
    "Arnulf of Carinthia (887-899)": ARecipients,

  };

  console.log("made it here");
  //L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);
  console.log("made it here");


  var OMS = L.markerClusterGroup();
  OMS.addLayers(LGRecipients);
  OMS.addLayers(ARecipients);
  map.addLayer(OMS);

};


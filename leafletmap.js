window.onload = function () {

  var initIcons = function(imageFile){
  	//Icons taken from pointhi: can be found at https://github.com/pointhi/leaflet-color-markers

 	var icon = L.icon({
  		iconUrl: imageFile,
  		iconSize: [25, 41],
    	iconAnchor: [12, 41],
   		popupAnchor: [0, -34],
    	shadowUrl: '../icons/marker-shadow.png',
    	shadowSize: [41, 41],
	});

	return icon;
  }
  
//Initialize the custom colored icons
var LGIcon, LYIcon, CaIcon, CFIcon, AIcon;
LGIcon= initIcons('../icons/marker-icon-red.png');
LYIcon = initIcons('../icons/marker-icon-blue.png');
CaIcon = initIcons('../icons/marker-icon-orange.png');
CFIcon = initIcons('../icons/marker-icon-violet.png');
AIcon = initIcons('../icons/marker-icon-green.png');

  /*var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
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

  var basemap3 = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

  var basemap4 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

var basemap5 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});*/

var basemap6 = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	minZoom: 5,
  	maxZoom: 8,
});


   var map = L.map('my-map').setView([49.653926, 8.567507], 6); //Creates the basemap and centers it on Worms for the time being
   basemap6.addTo(map); //Adds the basemap to the map


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
  
  //These take the GeoJSON files and turns them into Leaflet Layers we can add to the map.
    var ARecipients = createNewLayer(AJSON,AIcon);
    var LGRecipients = createNewLayer(LGJSON, LGIcon); 
    
    //These need data and will be uncommented then
    /*var CaRecipients = createNewLayer(CaJSON, CaIcon); 
    var CFRecipients= createNewLayer(CFJSON, CFIcon); 
  	var LYRecipients= createNewLayer(LYJSON, LYIcon);*/

  //This is the layer control code, it creates two types: base layers (which don't matter at the moment) and overlays (the different recipient groupings)
  //This uses two plugins=: Leaflet.MarkerCluster and Leaflet.FeatureGroup.Subgroup

  //The parent group controls the marker cluster group, which the default options have been set to now show the boundaries of a cluster group, and turned down the max cluster radius to a smaller amount
  //since this is really for markers on the same exact spot or very close together. 
  	var parentGroup = L.markerClusterGroup({
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		maxClusterRadius: 5,
	});

	//These are the subgroups which will have the layers added to them later.
	var LGGroup = L.featureGroup.subGroup(parentGroup);
	var ArnulfGroup = L.featureGroup.subGroup(parentGroup);
	
	/*These will be uncommented when I have the data
	var CaGroup = L.featureGroup.subGroup(parentGroup);
	var CFGroup = L.featureGroup.subGroup(parentGroup);
	var LYGroup = L.featureGroup.subGroup(parentGroup);*/
	
	//Add the layers to the subgroups
	LGRecipients.addTo(LGGroup);
	ARecipients.addTo(ArnulfGroup);

	//Add the parent group and then initialize Louis the German as the first subgroup.
	parentGroup.addTo(map);
	LGGroup.addTo(map);
	

	//Create the variables to pass to the layer control which give the layer names
	var baseLayers = {
    /*"Base map": basemap,
    "Base map 2": basemap2,
    "Base map 3": basemap3,
    "Base map 4": basemap4,
    "Base map 5": basemap5,*/
    "Base map 6": basemap6,
  	}

  	var overlays = {

  	"Louis the German (827-876)": LGGroup,
    /*"Louis the Younger (876-882)": LYGroup,
    "Carloman (876-880)": CaGroup,
    "Charles the Fat (876-887)": CFGroup,*/
    "Arnulf of Carinthia (887-899)": ArnulfGroup,

  	};

  	//Add the actual layer control to the map
	console.log("made it here");
  	L.control.layers(baseLayers, overlays, {collapsed: false, autoZIndex: false, hideSingleBase: true,}).addTo(map);
	console.log("made it here");

};


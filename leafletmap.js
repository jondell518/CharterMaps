window.onload = function () {
  //Default variables for controlling the map zoom
  var mapMinZoom = 4;
  var mapMaxZoom = 8;
  var initIcons = function(imageFile){
  //Icons taken from pointhi: can be found at https://github.com/pointhi/leaflet-color-markers

 	var icon = L.icon({
  		iconUrl: imageFile,
  		iconSize: [25, 41],
    	iconAnchor: [12, 41],
   		popupAnchor: [0, -34],
    	shadowUrl: 'icons/marker-shadow.png',
    	shadowSize: [41, 41],
	});

	return icon;
  }
  
//Initialize the custom colored icons
var LGIcon, LYIcon, CaIcon, CFIcon, AIcon;
LGIcon= initIcons('icons/marker-icon-red.png');
LYIcon = initIcons('icons/marker-icon-blue.png');
CaIcon = initIcons('icons/marker-icon-orange.png');
CFIcon = initIcons('icons/marker-icon-violet.png');
AIcon = initIcons('icons/marker-icon-green.png');


//Different Basemaps for testing
  var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  minZoom: mapMinZoom,
  maxZoom: mapMaxZoom,
  }); //This is the default basemap
  

  var basemap2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: mapMinZoom,
	maxZoom: mapMaxZoom,
	ext: 'png'
});


var basemap3 = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	minZoom: mapMinZoom,
  	maxZoom: mapMaxZoom,
});


var map = L.map('my-map').setView([49.653926, 8.567507], 6); //Creates the basemap and centers it on Worms for the time being
basemap3.addTo(map); //Adds the basemap to the map


  /*This function takes three inputs: the GeoJSON data, the icon you want to use for the layer, and the name of the king granting 
  the charter. It then sets the icon and adds a popup on each point with the name of king issuing the charter, 
  the location (recipient), the year of the grant, and the place it was redacted. It then returns the layer. */
  var createNewLayer = function(GeoJSON, icon, king)
  {

    var leafletLayer = L.geoJson(GeoJSON, {
      onEachFeature: function (feature, layer){
        layer.setIcon(icon);
        
        //This just controls whether the popup displays a secondary recipient location (for instance when the location is in a more well known city such as Regensburg)
        if(feature.properties.RecipientAlt != "NA")
        {
        	layer.bindPopup("King: " + king
          	+ "<br>" + "MGH #: " + feature.properties.MGH 
          	+ "<br>" + "Recipient: " + feature.properties.Recipient 
          	+ " in " + feature.properties.RecipientAlt
         	+ "<br>" + "Year: " + feature.properties.Year 
         	+ "<br>" + "Place Redacted: " + feature.properties.PlaceRedacted).openPopup();
        }
        else
        {
        	layer.bindPopup("King: " + king
          	+ "<br>" + "MGH #: " + feature.properties.MGH 
          	+ "<br>" + "Recipient: " + feature.properties.Recipient 
         	+ "<br>" + "Year: " + feature.properties.Year 
         	+ "<br>" + "Place Redacted: " + feature.properties.PlaceRedacted).openPopup();
        }
       
        //Might add URL links for each charter: "<br>" + '<a href=' + feature.properties.url + '>MGH</a>').openPopup();

        //This just adds a tooltip for mousing over an icon, which gives quick access to the name of the recipient.
        layer.bindTooltip(feature.properties.Recipient).openTooltip();
      }
    })

    return leafletLayer;
  }; 

  //These take the GeoJSON files (which have been set as variables in RecipientsOnly.js) and turns them into Leaflet Layers 
  //that we can add to the map.
    var ARecipients = createNewLayer(AJSON,AIcon, "Arnulf");
    var LGRecipients = createNewLayer(LGJSON, LGIcon, "Louis the German"); 
    var CFRecipients = createNewLayer(CFJSON, CFIcon, "Charles the Fat"); 
    var CaRecipients = createNewLayer(CaJSON, CaIcon, "Carloman")
    var LYRecipients= createNewLayer(LYJSON, LYIcon, "Louis the Younger");
   

  //This is the layer control code, it creates two types: base layers (which don't matter at the moment) and overlays (the different recipient groupings)
  //This uses two plugins: Leaflet.MarkerCluster and Leaflet.FeatureGroup.Subgroup

  //The parent group controls the marker cluster group, which the default options have been set to not show the boundaries of a cluster group, and turned down the max cluster radius to a smaller amount
  //since this is really for markers on the same exact spot or very close together. 
  	var parentGroup = L.markerClusterGroup({
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		maxClusterRadius: 10,
	});

	//These are the subgroups which will have the layers added to them later.
	var LGGroup = L.featureGroup.subGroup(parentGroup);
	var ArnulfGroup = L.featureGroup.subGroup(parentGroup);
  	var CFGroup = L.featureGroup.subGroup(parentGroup);
  	var CaGroup = L.featureGroup.subGroup(parentGroup);
  	var LYGroup = L.featureGroup.subGroup(parentGroup);
	

	
	//Add the layers to the subgroups
	LGRecipients.addTo(LGGroup);
	ARecipients.addTo(ArnulfGroup);
  	CFRecipients.addTo(CFGroup);
  	CaRecipients.addTo(CaGroup);
  	LYRecipients.addTo(LYGroup);

	//Add the parent group and then initialize Louis the German as the first subgroup.
	parentGroup.addTo(map);
	LGGroup.addTo(map);
	

	//Create the variables to pass to the layer control which give the layer names
	var baseLayers = {
    "Borders": basemap,
    "Terrain": basemap2,
    "Default": basemap3,
	};

var overlays = {

  	"Louis the German (827-876)": LGGroup,
    "Louis the Younger (876-882)": LYGroup,
    "Carloman (876-880)": CaGroup,
    "Charles the Fat (876-887)": CFGroup,
    "Arnulf of Carinthia (887-899)": ArnulfGroup,

};

  //Add the actual layer control to the map
  L.control.layers(baseLayers, overlays, {collapsed: false, autoZIndex: false, hideSingleBase: true,}).addTo(map);
	
};


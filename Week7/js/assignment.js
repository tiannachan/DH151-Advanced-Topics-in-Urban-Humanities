// Global variables
let map;
let lat = 34.0692;
let lon = -118.3206;
let zl = 11.4;
let path = '';

let geojsonPath = 'data/Los_Angeles_Poverty_Statistics.geojson';
let geojson_data;
let geojson_layer;

let brew = new classyBrew();

let legend = L.control({position: 'bottomright'});

let info_panel = L.control(); //default position: top right

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getGeoJSON();
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
           attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
           maxZoom: 18,
           id: 'mapbox.mapbox-traffic-v1',
           accessToken: 'pk.eyJ1IjoidGlhbm5hY2hhbiIsImEiOiJjbDJ0aGhveTMwNGZ3M2NvZ2FnMWxuYm9oIn0.lGhoBkOhXOgXpA-dbuu70A'})
           .addTo(map);
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('B17020_002E') // add a field to be used
	})
}



function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('YlOrRd');
	brew.classify('quantiles');

	// create the geojson layer
	geojson_layer = L.geoJson(geojson_data,{
		style: getStyle,
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds())

    // create the legend
	createLegend();

	// create the infopanel
	createInfoPanel();
}

    function getStyle(feature){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
            fillOpacity: 0.65
        }
    }

    // Function that defines what will happen on user interactions with each feature
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

        // on mouse over, highlight the feature
        function highlightFeature(e) {
            var layer = e.target;

            // style to use on mouse over
            layer.setStyle({
                weight: 2,
                color: '#666',
                fillOpacity: 0.45
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info_panel.update(layer.feature.properties)
        }

        // on mouse out, reset the style, otherwise, it will remain highlighted
        function resetHighlight(e) {
            geojson_layer.resetStyle(e.target);

            info_panel.update() // resets infopanel
        }

        // on mouse click on a feature, zoom in to it
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }


    function createLegend(){
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
            breaks = brew.getBreaks(),
            labels = [],
            from, to;
            
            for (var i = 0; i < breaks.length; i++) {
                from = breaks[i];
                to = breaks[i + 1];
                if(to) {
                    labels.push(
                        '<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
                        from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
                    }
                }
                
                div.innerHTML = labels.join('<br>');
                return div;
            };
            
            legend.addTo(map);
    }


    function createInfoPanel(){

        info_panel.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };
        
        // method that we will use to update the control based on feature properties passed
        info_panel.update = function (properties) {
            // if feature is highlighted
            if(properties){
                this._div.innerHTML = `<b>${properties.NAME}</b><br>Population whose income in the past 12 months is below federal poverty level: ${properties[fieldtomap]}`;
            }
            // if feature is not highlighted
            else
            {
                this._div.innerHTML = 'Hover over an area';
            }
        };

        info_panel.addTo(map);
    }



//function for sidebar "Explore"
function flyToIndex(lat, lon){
	map.flyTo([lat,lon],14)
};
// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let markers = L.featureGroup();
let jsondata;

let la_bounds = [
	[34.37540468090968,-117.91621685028078],
	[33.650292870379424,-118.8404417037964]
]

let filters = [
	{
		title: 'All victims',
		code: ''
	},
	{
		title: 'Hispanic victims',
		code: 'H'
	},
	{
		title: 'Black victims',
		code: 'B'
	},
	{
		title: 'White victims',
		code: 'W'
	},
	{
		title: 'Asian victims',
		code: 'A'
	},
	{
		title: 'Other victims',
		code: 'O'
	},
]

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getJSON();
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

    map.fitBounds(la_bounds)

}

// function to get the json data
function getJSON(){
	$.getJSON('https://data.lacity.org/resource/2nrs-mtv8.json?$order=date_rptd%20desc',function(data){
		console.log(data)
		jsondata = data;
		mapJSON()
	})
}

function mapJSON(race){

    // if race is not fed, then make it empty
	race = race ||'';

    // clear markers if they are on the map
	markers.clearLayers()

	// marker/circle options
    circleOptions = {
		'weight':10,
		'color':'white',
		'fillColor':'red',
		'radius': 10,
		'opacity':0.5,
		'fillOpacity': 1
	}

    // here is the filter!
	if(race != ''){
		console.log('filtering...')
		filtered_data = jsondata.filter(item => item.vict_descent === race)
	}
	else
	{
		// there is no filter, so just map everything
		filtered_data = jsondata;
	}

	// loop through each entry
	jsondata.forEach(function(item,index){

        // // different color for each major race category
		// if(item.vict_descent==='H'){
		// 	circleOptions.fillColor = 'green'
		// }
		// else if (item.vict_descent==='W'){
		// 	circleOptions.fillColor = 'blue'
		// }
		// else if (item.vict_descent==='B'){
		// 	circleOptions.fillColor = 'red'
		// }
		// else if (item.vict_descent==='A'){
		// 	circleOptions.fillColor = 'orange'
		// }
		// else if (item.vict_descent==='O'){
		// 	circleOptions.fillColor = 'yellow'
		// }

        if(item.lat != '0'){
		    let marker = L.circleMarker([item.lat,item.lon],circleOptions)
		    .on('mouseover',function(){
		    	$('.footer').html(`<span style="font-size:0.5em">${item.date_occ.substring(0,10)}</span><br>Victim of <span class='highlighted-text'>${item.crm_cd_desc}</span> is a <span class='highlighted-text'>${item.vict_age}</span> year old of race <span class='highlighted-text'>${item.vict_descent}</span> of gender <span class='highlighted-text'>${item.vict_sex}</span>`)
		    }) // show data on hover
		markers.addLayer(marker)	
        }
	});

	markers.addTo(map)
}

function createSidebar(){
	// Add description text
	$('.sidebar').append(`
	<p>
		Showing the last 1000 crime incidents reported by the LAPD
	</p>
	`)

	// add sidebar buttons
	filters.forEach(function(item){
		$('.sidebar').append(`
			<div class="sidebar-item" onclick="mapJSON('${item.code}')">${item.title}</div>
		`)
	})
}
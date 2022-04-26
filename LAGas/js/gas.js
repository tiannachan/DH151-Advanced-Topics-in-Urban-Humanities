//1. Global variables
let map;
let lat = 39.50;
let lon = -98.35;
let zl = 4;
let path = "data/gas.csv";
let markers = L.featureGroup();

//2. initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});

//3. create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}


//4. function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data); //see the data in our console
			
			// map the data
			mapCSV(data);

		}
	});
}

//5

function mapCSV(data){

	// loop through each entry
	data.data.forEach(function(item,index) {
		// create a marker
		let marker = L.circleMarker([item.latitude,item.longitude],{
			color: getColor(item.price_current), // you can call the getColor function
			fillColor: getColor(item.price_current),
			fillOpacity: 0.5
		  })

		.on('mouseover',function(){
			this.bindPopup(`<h3><b>${item.loc_name}</b></h3> Current Price: $${item.price_current}<br> Address: ${item.address_1}, ${item.address_2}`).openPopup()
		})

		// add marker to featuregroup		
		markers.addLayer(marker)
	
		// add featuregroup to map
		markers.addTo(map)

        // add entry to sidebar
		$('.sidebar').append(`<div class="sidebar-item" onmouseover="panToImage(${index})"> ● </div>`)
	})

	// fit markers to map
	map.fitBounds(markers.getBounds())
}

function panToImage(index){
	// zoom to level 6 first
	map.setZoom(18);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
}

function getColor(number){
	return number >= 5.8 ? 'red':
			number >= 5.3 ? 'orange':
			number >= 5 ? 'green':
			'grey';
}


function createSidebarButtons(){

	// put all available dates into an array
	// using slice to remove first 4 columns which are not dates
	let dates = csvdata.meta.fields.slice(4)

	// loop through each date and create a hover-able button
	dates.forEach(function(item,index){
		$('.sidebar').append(`<div onmouseover="mapCSV('${item}')" class="sidebar-item" title="${item}">●</div>`)
	})
}
//1. Global variables
let map;
let lat = 39.50;
let lon = -98.35;
let zl = 4;
let path = "data/statelatlong.csv";
let markers = L.featureGroup();

//2. initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});

//3. create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
		maxZoom: 20,
		attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
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
		let marker = new L.marker([item.latitude,item.longitude],{
			title: item.title,
			icon: L.icon ({
				iconUrl: item.Image_Url,
				iconSize: [30, 30]
			})
		})

		.on('mouseover',function(){
			this.bindPopup(`<h3><b>${item.City}</b></h3> Minimum Wage: $${item.MinWage}`).openPopup()
		})

		// add marker to featuregroup		
		markers.addLayer(marker)
	
		// add featuregroup to map
		markers.addTo(map)

        // add entry to sidebar
		$('.sidebar').append(`<div class="sidebar-item" onmouseover="panToImage(${index})"><img src= "${item.Image_Url}" width= "30px"> ${item.City}</div>`)
	})

	// fit markers to map
	map.fitBounds(markers.getBounds())
}

function panToImage(index){
	// zoom to level 6 first
	map.setZoom(7);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
}

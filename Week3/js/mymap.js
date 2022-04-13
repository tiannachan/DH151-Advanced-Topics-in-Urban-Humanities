let data = [
    {
        'id': 0,
        'title': 'Copenhagen, Denmark',
        'lat': 55.620750,
        'lon': 12.650462,
        'description': 'In <i>December 2019</i>, right before the pandemic, I flew from the States to Denmark for a one-month trip in the Northern Europe: I first landed here, reunited with my mother, and we stayed in Copenhagen for a few days. This city is mixed with royal histories and modern architecture, and biking around the city center was so enjoyable. <br><br> Next, we went to <i> Helsingborg, Sweden</i>. To continue my journey, close this tab, and try to find it on the map!',
        'pic': '<img src= images/denmark.jpg width="200px">'
    },
    {
        'id': 1,
        'title': 'Helsingborg, Sweden',
        'lat': 56.041433,
        'lon': 12.697121,
        'description': 'Congratulations! You found the second location! <br><br>We then cross the border of Denmark to Sweden by taking the ForSea Ferries. Although we did not have a chance to visit its capital Stockholm, we love Helsingborg since it is an extraordinary scenic coastal city that retains many historical buildings. <br><br>Next stop, <i>Iceland</i>!',
        'pic': '<img src= images/sweden.jpg width="200px">',
        'zoom': 9
    },
    {
        'id': 2,
        'title': 'Iceland',
        'lat': 64.128288,
        'lon': -21.827774,
        'description': "For our last stop in Northern Europe, we flew to Iceland, one of the least densely populated countries. We stayed at a friend's house of a family of 5, for 3 weeks!! There are so many nature sceneries- It was by far the most fascinating place I have been to. We were so upset of not seeing the aurora by the time we leave, but we surprisingly saw it on the plane! <br><br><i> And then... the pandemic hit.</i> <br><br>After few months back in the states, I decided to go back home (<i>Hong Kong</i>).",
        'pic': '<img src= images/iceland.jpg width="200px">',
        'zoom': 6
    },
    {
        'id': 3,
        'title': 'Hong Kong',
        'lat': 22.371791,
        'lon': 114.119832,
        'description': 'In <i>April 2020</i>, I decided to go back home. Despite our day-to-day lives are drastically changed by the pandemic, I am thankful that I got to reunite with my family and friends there after being away for so long. <br><br>My next stop is <i>Vancouver</i>. Wonder why I went there? Keep going and find it out!',
        'pic': '<img src= images/hk.jpg width="200px">',
        'zoom': 11
    },
    {
        'id': 4,
        'title': 'Vancouver, Canada',
        'lat': 49.193947,
        'lon': -123.183221,
        'description': "Finally, in <i>October 2021</i>, we came back to in person classes! I had a layover in Vancouver for 5 hours before arriving Los Angeles. Fun fact- this is also my first and only time in Canada, haha! <br><br>Let's go to our last stop for today- <i>LA</i>!",
        'pic': '<img src= images/canada.jpg width="200px">',
        'zoom': 14
    },
    {
        'id': 5,
        'title': 'Los Angeles, United States',
        'lat': 34.068729,
        'lon': -118.444838,
        'description': 'And finally we are here! This is where my school UCLA, the #1 public university, is located! Forgot to mention- I am also a transfer! So this is also my first year living in LA and exploring everywhere. So far loving it! ',
        'pic': '<img src= images/la.jpg width="200px">',
        'zoom': 14
    }
    
]

var map = L.map('map').setView([55.620750, 12.650462], 12);

var planeIcon = L.icon ({
    iconUrl:'images/marker.png',
    iconSize: [50, 50]
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// function to fly to a location by a given id number
function flyByIndex(index){
	map.flyTo([data[index].lat,data[index].lon],data[index].zoom)

	// open the popup
	myMarkers.getLayers()[index].openPopup()
}


// before looping the data, create an empty FeatureGroup
let myMarkers = L.featureGroup();


// loop through data
data.forEach(function(item){
	// create marker
	let marker = L.marker([item.lat,item.lon], {
        title: item.title,
        icon: planeIcon
    })
        .bindPopup(`<h3><b>${item.title}</b></h3>${item.pic}<br>${item.description}`)

	// add marker to featuregroup
	myMarkers.addLayer(marker)

	// add data to sidebar with onclick event
	$('.sidebar').append(`<div class="sidebar-item" onclick= 
        "flyByIndex(${item.id})">${item.title}</div>`)
})

// after loop, add the FeatureGroup to map
myMarkers.addTo(map)

// define layers
let layers = {
	"My Markers": myMarkers
}

// add layer control box
L.control.layers(null,layers).addTo(map)


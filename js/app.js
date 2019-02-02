
// global variables used
let map;

// fetch the locations from foursquare api
fetch('https://api.foursquare.com/v2/venues/explore?ll=43.653321,-79.384003&client_id=OGFWLIGUSRAL3E3YGMD1HTMLJP1SIRR4TIV1IHWGILDO2I1N&client_secret=YVZDERQD3UOAKRYN05SHLYODEIYXKSNXA2Q0RD0SNCX5QF4V&v=20180705')
.then(response => response.json())
.then(data => {
	let locations = data.response.groups[0].items.map(item => {
		return {
			position: { lat: item.venue.location.lat, lng: item.venue.location.lng },
			title: item.venue.name,
			id: item.venue.id,
			category: item.venue.categories[0].name,
			address: item.venue.location.address,
			state: item.venue.location.state,
			postalCode: item.venue.location.postalCode
		}
	})	
	console.log(locations);
	initMap (locations);
})
.catch(err => {
	alert('Something went wrong. Please try again later.');
})


// initialise the map 
function initMap(locations) {
  //  a constructor to create a new map JS object. You can use the coordinates
  //the coordinates of my city are given as center
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 43.653321,
      lng: -79.384003
    },
    zoom: 14
  });
  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  //call for our knockout view model
  ko.applyBindings(ViewAppModel(locations));
}
 
// message when map doesn't load 
function mapError() {
  document.getElementById('map').innerHTML = "MAP FAILED TO LOAD";
};


// knockout viewmodel
let ViewAppModel = (locations) => {
	selectedloc = ko.observable('');
	let self = this;
	self.markers = [];

	self.populateInfoWindow = (marker, infoWindow) => {
		marker.content = locations.title;
		console.log(marker.content);
	}
}


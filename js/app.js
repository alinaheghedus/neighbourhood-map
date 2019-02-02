
// global variables used
let map;

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
	//console.log(locationList);
	locationList (locations);

})

function locationList (locations) {
	console.log (locations)
}
 


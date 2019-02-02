
// global variables used
let map;


locations = [
  {
    title: 'Downtown Toronto',
    location: {
      lat: 43.65323167517444,
      lng: -79.38529600606677
    },
    address: "Heart of the city",
    id: "5227bb01498e17bf485e6202",
    li: true
  }, {
    title: 'Nathan Phillips Square',
    location: {
      lat: 43.65227047322295,
      lng: -79.38351631164551
    },
    address: "100 Queen St W",
    id: "4ad4c05ef964a520a6f620e3",
    li: true
  }, {
    title: 'Eggspectation Bell Trinity Square',
    location: {
      lat: 43.65314383888587, 
      lng: -79.38198016678167
    },
    address: "483 Bay Street",
    id: "537773d1498e74a75bb75c1e",
    li: true
  }, {
    title: 'Old City Hall',
    location: {
      lat: 43.652008800876125, 
      lng: -79.3817442232328
    },
    address: "60 Queen Street West",
    id: "4ad4c05ef964a5208ef620e3",
    li: true
  }, {
    title: 'Japango',
    location: {
   	 lat: 43.65526771691681, 
   	 lng: -79.38516506734886
    },
    address: "122 Elizabeth St",
    id: "4ae7b27df964a52068ad21e3",
    li: true
  }, {
    title: 'Textile Museum of Canada',
    location: {
      lat: 43.65439630500274, 
      lng: -79.38650010906946
    },
   	address: "55 Centre Avenue",
    id: "4ad4c05ef964a520e2f620e3",
    li: true
  }, {
  	title: 'Indigo',
    location: {
      lat: 43.65351471121164,
      lng: -79.38069591056922
    },
    address: "220 Yonge St",
    id: "4b2a6eb8f964a52012a924e3",
    li: true
  }
];

/* fetch the locations from foursquare api
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
	(data) => {
		
	}
})
.catch(err => {
	alert('Something went wrong. Please try again later.');
})	
*/


// initialise the map 
function initMap() {
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
  ko.applyBindings(ViewAppModel());
}
 
// message when map doesn't load 
function mapError() {
  document.getElementById('map').innerHTML = "MAP FAILED TO LOAD";
};


// knockout viewmodel
let ViewAppModel = () => {
	selectedloc = ko.observable('');
	let self = this;

	//value ok knockout variable if foursquare doesn't load
	self.error = ko.observable('');

	// markers array
	self.markers = [];

	// populates the infowindow when we click the marker
	self.populateInfoWindow = (marker, infoWindow) => {

		// fetch extra info from foursquare
		$.ajax({
	      url: "https://api.foursquare.com/v2/venues/" + marker.id + '?client_id=OGFWLIGUSRAL3E3YGMD1HTMLJP1SIRR4TIV1IHWGILDO2I1N&client_secret=YVZDERQD3UOAKRYN05SHLYODEIYXKSNXA2Q0RD0SNCX5QF4V&v=20180705',
	      dataType: "json",
	      success: function(data) {
	        var result = data.response.venue;
	        marker.content = '<div>' + result.name + '</div>';
	        marker.place = '<div>' + "latitude=" + result.location.lat + ",longitude=" + result.location.lng + '</div>';
	        marker.address = '<div>' + "address=" + result.address + '</div>';

	        // Check to see if the infowindow is not already opened on this marker.
	        if (infowindow.marker != marker) {
	          infowindow.marker = marker;
	          infowindow.setContent('<div>' + marker.content + marker.place + marker.address + '</div>');
	          infowindow.open(map, marker);
	          infowindow.addListener('closeclick', function() {
	            infowindow.marker = null;
	          });
	        }
	      },
	      error: function(e) {
	        self.error("couldn't fetch extra info from foursquare");
	      }
	    });
	  };	

	}
}


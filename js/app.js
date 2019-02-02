
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
    zoom: 35
  });
  largeInfoWindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  //call for our knockout view model
  ko.applyBindings(ViewAppModel());
}
 
// message when map doesn't load 
function mapError() {
  document.getElementById('map').innerHTML = "Not Loading, try again later";
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
	self.populateInfoWindow = (marker, infowindow) => {

		// fetch extra info from foursquare
		$.ajax({
	      url: "https://api.foursquare.com/v2/venues/" + marker.id + '?client_id=OGFWLIGUSRAL3E3YGMD1HTMLJP1SIRR4TIV1IHWGILDO2I1N&client_secret=YVZDERQD3UOAKRYN05SHLYODEIYXKSNXA2Q0RD0SNCX5QF4V&v=20180705',
	      dataType: "json",
	      success: function(data) {
	        var result = data.response.venue;
	        console.log(result);
	        marker.content = '<div>' + result.name + '</div>';
	        marker.place = '<div>' + "latitude=" + result.location.lat + ",longitude=" + result.location.lng + '</div>';
	        marker.address = '<div>' + "address=" + result.location.address + '</div>';
	        marker.description = '<div>' + "description=" + result.description + '</div>';


	        // Check to see if the infowindow is not already opened on this marker.
	        if (infowindow.marker != marker) {
	          infowindow.marker = marker;
	          infowindow.setContent('<div>' + marker.content + marker.place + marker.address + marker.description + '</div>');
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

	  // change clicked marker color
	  self.makeMarkerIcon = function(markerColor) {
	    var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2', new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(21, 34));
	    return markerImage;
	  };

	  // default marker color
	  var defaultColor = makeMarkerIcon('d11aff');

	  // clicked marker color
	  var clickedColor = makeMarkerIcon('6600ff');


	  // create markers
	  for (i = 0; i < locations.length; i++) {

	    // Get info from the locations array.
	    let position = locations[i].location;
	    let title = locations[i].title;
	    let address = locations[i].address;
	    let id = locations[i].id;
	    let li = locations[i].li;

	    // Create each marker
	    let marker = new google.maps.Marker({
	      map: map,
	      position: position,
	      title: title,
	      animation: google.maps.Animation.DROP,
	      icon: defaultColor,
	      id: id,
	      li: ko.observable(li),
	      address: address
	    });

	    // Put the markers in an array
	    self.markers.push(marker);

	    // Extend map's boundary
	    bounds.extend(marker.position);

	    // click event listener to open the infowindow
	    // and change clicked marker's color
	    marker.addListener('click', function() {
	      populateInfoWindow(this, largeInfoWindow);
	      bounds.extend(this.position);

	      for (var i = 0; i < self.markers.length; i++) {
	        if (self.markers[i].id != this.id) {
	          self.markers[i].setIcon(defaultColor);
	        } else {
	          self.markers[i].setIcon(clickedColor);
	        }
	      }
	    });	  
	  }
	  map.fitBounds(bounds);

	  // filter the location list
	  self.change = function(data, event) {
	    for (var i = 0; i < self.markers.length; i++) {
	      if (self.markers[i].title == data.title) {
	        self.populateInfoWindow(markers[i], largeInfoWindow);
	        markers[i].setIcon(clickedColor);
	        bounds.extend(self.markers[i].position);
	      } else {
	        markers[i].setIcon(defaultColor);
	      }
	    }
	  };

	  self.mapError = function() {
   		 document.getElementById('map').innerHTML = "Not loading, try again later";
  	  };

  	  self.test = function(viewModel, event) {
	    if (selectedloc().length === 0) {
	      for (var i = 0; i < self.markers.length; i++) {
	        self.markers[i].setMap(map);
	        self.markers[i].li(true);
	        markers[i].setIcon(defaultColor);
	        map.fitBounds(bounds);
	      }
	    } else {
	      for (var j = 0; j < self.markers.length; j++) {
	        if (self.markers[j].title.toLowerCase().indexOf(selectedloc().toLowerCase()) >= 0) {
	          self.markers[j].setMap(map);
	          self.markers[j].li(true);
	          markers[j].setIcon(defaultColor);
	        } else {
	          self.markers[j].setMap(null);
	          self.markers[j].li(false);
	          markers[j].setIcon(defaultColor);
	        }
	      }
	    }
	    largeInfoWindow.close();
	  };
}


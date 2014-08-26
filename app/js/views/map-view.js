// Backbone Map View
var Backbone = require('Backbone');
Backbone.$ = require('jquery');

var map;

module.exports = Backbone.View.extend({
  //tagName: 'section',


  initialize: function() {
    this.render();
  },

  render: function() {
    var template = require('../templates/map-template.hbs');
    var data = this.model.attributes;
    //console.log(data);
    // this.$el.html(template(data));
    this.mapLocations();

    return this;
  },

  mapLocations: function(){

    this.model.set('mapOptions', {
      zoom: 15

    });


    this.model.set('map', new google.maps.Map(this.$el, this.model.get('mapOptions')));

  // Try HTML5 geolocation

  console.log('first spot');
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


      var infowindow = new google.maps.InfoWindow({
        map: this.model.get('map'),
        position: pos,
        // content: 'Location found using HTML5.'
      });

      map.setCenter(pos);
      console.log('first spot');
      var request = {
        location: pos,
        radius: 500,
        types: ['store']
      };
      console.log('first spot');
      // infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, this.callback);

    }, function() {
      this.handleNoGeolocation(true);

    });
  } else {
    // Browser doesn't support Geolocation
    this.handleNoGeolocation(false);
  }
},


callback: function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      this.createMarker(results[i]);
    }
  }
},

createMarker: function (place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
},


handleNoGeolocation: function (errorFlag) {
  var content;
  if (errorFlag) {
    content = 'Error: The Geolocation service failed.';
  } else {
    content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

// google.maps.event.addDomListener(window, 'load', initialize);
});

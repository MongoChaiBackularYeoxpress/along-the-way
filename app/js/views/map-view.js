// Backbone Map View
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  render: function() {
    this.mapLocations(this.model);
    return this;
  },

  mapLocations: function(model){
    var map;
    var service;
    var infowindow;
    var mapOptions = {
          zoom: 15
        };

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        model.set('map', map);

        // if position is inputed from form, else current location
        if(model.get('position')){
          var pos = model.get('position');
        } else {
          var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        }

        infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: 'Location found using HTML5.'
        });

        var request = {
          location: pos,
          radius: 500,
          types: ['bar']
        };

        //location points
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }

        function createMarker(place) {
          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }

        map.setCenter(pos);

      });
    }
  }

});

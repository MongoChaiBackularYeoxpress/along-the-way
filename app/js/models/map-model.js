// Backbone Map Model
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.Model.extend({

  defaults: {
    startPoint: '',
    endPoint: '',
    radius: 402,
    map: '',
    category: 'bar',
    position: '',
    mapOptions: {zoom: 15, panControl: false},
    infowindow: '',
    markerArray: []
  },

  getLocation: function(){
    var self = this;
    if(!self.get('startPoint')){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
          var originPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          self.set('startPoint', originPoint);
        });
      } 
    }
  },

  calcRoute: function(start, end, directionsDisplay, directionsService, service) {
    var self = this;
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var polyline = new google.maps.Polyline({
          path: [],
          strokeWeight: 0
        });
        var bounds = new google.maps.LatLngBounds();
        self.buildSegments(polyline, bounds, service, response);
        var map = self.get('map');
        polyline.setMap(map);
        map.fitBounds(bounds);
        directionsDisplay.setDirections(response);
      }
    });
  },

  buildSegments: function(polyline, bounds, service, response) {
    var self = this;
    var numCount = 0;
    var legs = response.routes[0].legs;
    for (var i = 0; i < legs.length; i++) {
      var steps = legs[i].steps;
      for (var j = 0; j < steps.length; j++) {
        var nextSegment = steps[j].path;
        self.extendBounds(nextSegment, polyline, bounds, numCount, service);
      }
    }
  },

  extendBounds: function(nextSegment, polyline, bounds, numCount, service) {
    var self = this;
    for (var k = 0; k < nextSegment.length; k++) {
      polyline.getPath().push(nextSegment[k]);
      bounds.extend(nextSegment[k]);
      self.searchPoint(numCount, polyline, service);
      numCount++;
    }
  },

  searchPoint: function(numCount, polyline, service) {
    var self = this;
    var cat = self.get('category');
    var rad = self.get('radius');
    if((numCount % 10) == 0){
      var requestLoc = {
        location: polyline.getPath().getAt(numCount),
        radius: [rad],
        types: [cat]
      };
      setTimeout(function(){
        service.nearbySearch(requestLoc, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              self.createMarker(results[i]);
            }
          }
        });
      }, numCount * 10);
    }
  },

  createMarker: function(place, model) {
    var self = this;
    var infowindow = self.get('infowindow');
    var placeLoc = place.geometry.location;
    var image = "./mcby-marker-icon.png";
    var marker = new google.maps.Marker({
      map: self.get('map'),
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      icon: image
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(self.get('map'), this);
    });
  }
});

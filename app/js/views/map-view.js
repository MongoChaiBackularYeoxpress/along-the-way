// Backbone Map View
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.model.on('change:startPoint', this.callMapLocations, this);
    this.model.on('change:endPoint', this.callMapLocations, this);
    this.createMap(this.model);  
    this.render();
  },

  render: function() {
    this.model.getLocation();
    return this;
  },

  callMapLocations: function(){
    this.mapLocations(this.model);
  },

  createMap: function(model){
    map = new google.maps.Map(document.getElementById('map-canvas'), model.get('mapOptions'));
    model.set('map', map);
  },

  mapLocations: function(model){
    var map = model.get('map');
    var pos = model.get('startPoint');
    var endPoint = model.get('endPoint');
    var infowindowOptions = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'Your location.'
    });
    model.set('infowindow', infowindowOptions);

    var service = new google.maps.places.PlacesService(map);

    map.setCenter(pos);

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);

    model.calcRoute(pos, endPoint, directionsDisplay, directionsService, service);
  }
});

// Backbone Map View
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.model.on('change:startPoint', this.render, this);
    this.model.on('change:endPoint', this.render, this);
    this.model.on('change:category', this.render, this);
    this.model.on('change:radius', this.render, this);
    this.model.getLocation();
    this.generateMap(this.model);
    this.render();
  },

  render: function(){
    this.generateMap(this.model);
    return this;
  },

  generateMap: function(model){
    model.set('map', '');
    map = new google.maps.Map(document.getElementById('map-canvas'), model.get('mapOptions'));
    model.set('map', map);
    this.autoComplete();
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
  },
  autoComplete: function () {
    var acOptions = {
      types: ['establishment']
    };
    var autoCompleteStart = new google.maps.places.Autocomplete(document.getElementById('start'), acOptions);
    var autoCompleteEnd = new google.maps.places.Autocomplete(document.getElementById('destination'), acOptions);
  }
});

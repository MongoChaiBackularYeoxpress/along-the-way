// Backbone initialize models/views files
var $ = require('jquery');
var MapModel = require('./models/map-model');
var MapView = require('./views/map-view');

var mapModel = new MapModel();
var mapView = new MapView({model: mapModel});

$('#map-canvas').html(mapView.$el);





// Backbone Form View
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({

  events: {
   'click #sub' : 'getFormValues'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var template = require('../templates/form-template.hbs');
    // var data = this.model.attributes;
    this.$el.html(template());
    return this;
  },

  getFormValues: function() {
    var self = this;
    console.log(self);
    var geocoder = new google.maps.Geocoder();
    var start = this.$el.find('#start').val();
    var end = this.$el.find('#destination').val();
    var cat = this.$el.find('#category').val();
    var radius = parseInt(this.$el.find('#radius').val());
    self.model.set('category', cat);
    self.model.set('radius', radius);
    console.log(start);
    if (start !== 'Start') {
      geocoder.geocode( { 'address': start}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var originPoint = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          console.log(originPoint);
          console.log(self);
          self.model.set('startPoint', originPoint);
        } 
      });
    }
    if (end !== 'Destination') {
      geocoder.geocode( { 'address': end}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var destinationPoint = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          self.model.set('endPoint', destinationPoint);
        } else {
          alert("Please enter a valid address.");
        }
      });
    }
  }
});
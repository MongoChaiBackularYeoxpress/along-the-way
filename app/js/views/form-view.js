// Backbone Form View
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({

  events: {
    'click #sub' : 'getFormValues'
  },

  initialize: function() {
    geocoder = new google.maps.Geocoder();
    this.render();
  },

  render: function() {
    var template = require('../templates/form-template.hbs');
    var data = this.model.attributes;
    this.$el.html(template(data));
    return this;
  },

  getFormValues: function() {
    var start = this.$el.find('start').val();
    var end = this.$el.find('end').val();
    if (start !== 'Start') {
      geocoder.geocode( { 'address': start}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          this.model.set('startPoint', [results[0].geometry.location.lat(), 
                                        results[0].geometry.location.lng()]);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    };
    geocoder.geocode( { 'address': end}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        this.model.set('endPoint', results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
});
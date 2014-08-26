// Backbone Map Model
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.Model.extend({
  defaults: {
    position: '',
    map: ''
  },

  findLocations: function (position) {
    console.log('this is our findLocations function in models.');
  }

  // startingPoint: function (start){}
});

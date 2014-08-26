// Backbone Map Model
var Backbone = require('Backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.Model.extend({
  defaults: {
    name: 'Testies',
    position: '',
    map: ''
  },

  findLocations: function (position) {
    console.log('this is our findLocations function in models.');
  },



  // startingPoint: function (start){}
});

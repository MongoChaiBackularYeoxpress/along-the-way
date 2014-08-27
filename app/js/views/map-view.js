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
    var directionsDisplay;

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

        //location points
        service = new google.maps.places.PlacesService(map);

        map.setCenter(pos);

        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();

        var jeffersonGolf = new google.maps.LatLng(47.5662742, -122.3042107);
        directionsDisplay.setMap(map);

        calcRoute(pos, jeffersonGolf);

        function calcRoute(start, end) {
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
              var numCount = 0;
              var legs = response.routes[0].legs;
              for (i=0;i<legs.length;i++) {
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                  var nextSegment = steps[j].path;
                  for (k=0;k<nextSegment.length;k++) {

                      polyline.getPath().push(nextSegment[k]);
                      bounds.extend(nextSegment[k]);

                      if((k % 10) == 0){
                        (function(index) {
                          var requestLoc = {
                            location: polyline.getPath().getAt(index),
                            radius: 500,
                            types: ['bar']
                          };
                          //console.log(polyline.getPath().getAt(index));
                          setTimeout(function(){
                            service.nearbySearch(requestLoc, callback);
                          }, k*100);

                        })(k);
                      }
                      numCount++;
                      //console.log(func);
                }

                  // var requestLoc = {
                  //     location: nextSegment[1],
                  //     radius: 500,
                  //     types: ['bar']
                  //   };
                  //   console.log(requestLoc);
                  //   service.nearbySearch(requestLoc, callback);

                  //   var requestLoc2 = {
                  //     location: nextSegment[15],
                  //     radius: 500,
                  //     types: ['bar']
                  //   };
                  //   console.log(nextSegment[15]);
                  //   console.log(requestLoc2);
                  //   service.nearbySearch(requestLoc2, callback);
                }
              }

              polyline.setMap(map);
              map.fitBounds(bounds);

              directionsDisplay.setDirections(response);
            }
          });
        }

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
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }


      });
    }
  }

});

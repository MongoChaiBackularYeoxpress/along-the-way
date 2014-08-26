'use strict';

var chai = require('chai');
var Backbone = require('backbone');
var sinon = require('sinon');
var expect = chai.expect;

var MapModel = require('../../../app/js/models/map-model');

describe('Backbone Map Model', function() {
  var mapModel;

  before(function(done) {
    this.mock = sinon.mock(Backbone);
    mapModel = new MapModel();
    done();
  });

  it('should be a backbone object', function(done) {
    mapModel.set('name', 'test name');
    expect(mapModel).to.be.ok;
    expect(mapModel.get('name')).to.eql('test name');
    done();
  });

  after(function() {
    this.mock.verify();
  });
});

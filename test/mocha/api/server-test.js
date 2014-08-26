'use strict';

require('../../../server');
var chai = require('chai');
var chaithttp = require('chai-http');

chai.use(chaithttp);
var expect = chai.expect;

describe('check server running', function() {
  it('should get 200 (check server is running)', function(done) {
    chai.request('http://localhost:3000')
      .get('/')
      .res(function(res) {
        expect(res).to.have.status(200);
        done();
      });
  });

});

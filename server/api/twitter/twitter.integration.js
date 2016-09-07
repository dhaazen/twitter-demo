'use strict';

var app = require('../..');
import request from 'supertest';

var newThing;

describe('Twitter API:', function() {
  describe('GET /api/twitter', function() {
    let response;

    beforeEach(function(done) {
      request(app)
        .get('/api/twitter')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          response = res.body;
          done();
        });
    });

    it('should respond with an Array of 10 tweets', function() {
      expect(response.length).to.equal(10);
    });
  });
});

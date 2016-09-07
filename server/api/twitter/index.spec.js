'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var thingCtrlStub = {
  index: 'controller.index',
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var thingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './twitter.controller': thingCtrlStub
});

describe('Twitter API Router:', function() {
  it('should return an express router instance', function() {
    expect(thingIndex).to.equal(routerStub);
  });

  describe('GET /api/twitter', function() {
    it('should route to controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'controller.index')
        ).to.have.been.calledOnce;
    });
  });
});

'use strict';

import main from './main.component';
import {
  MainController
} from './main.component';

describe('Component: MainComponent', function() {
  beforeEach(angular.mock.module(main));

  var scope;
  var mainComponent;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/twitter')
      .respond(['{}', '{}', '{}', '{}']);

    scope = $rootScope.$new();
    mainComponent = $componentController('main', {
      $http,
      $scope: scope
    });
  }));

  it('should attach the array of data to the controller twitterData object', function() {
    mainComponent.$onInit();
    $httpBackend.flush();
    expect(mainComponent.twitterData.length)
      .to.equal(4);
  });
});

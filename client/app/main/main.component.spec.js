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
      .respond([{}, {}, {}, {}]);
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

  it('should the Controller to have a timer function set when initialized', function() {
    mainComponent.$onInit();
    $httpBackend.flush();
    expect(mainComponent.timer).to.not.be.undefined;
  });

  it('should parse tweet text and put last link into tweetLink attribute', function() {
    mainComponent.$onInit();
    var parsedText = mainComponent._grabLinkToTweet({
      text: 'Some https://fake.com/1 other http://fake.com/2',
    });

    expect(parsedText.tweetLink).to.equal('http://fake.com/2');
  });

  it('should parse tweet text and remove last link', function() {
    mainComponent.$onInit();
    var parsedText = mainComponent._grabLinkToTweet({
      text: 'Some https://fake.com/1 text http://fake.com/2',
    });

    expect(parsedText.text).to.equal('Some https://fake.com/1 text');
  });

  it('should parse tweet text and include friendly links', function() {
    mainComponent.$onInit();
    var parsedText = mainComponent._replaceTweetLinks({
      text: 'Some https://fake.com/1 other http://fake.com/2 text',
      entities: {
        urls: [
          {display_url: 'https://real.com/1'},
          {display_url: 'http://real.com/2'}
        ]
      }
    });

    expect(parsedText).to.equal('Some <a href="https://fake.com/1">https://real.com/1</a> other <a href="http://fake.com/2">http://real.com/2</a> text')
  });

  // it('should parse tweet text and replace hashtags with links', function() {
  //   mainComponent.$onInit();
  //   mainComponent.timer;
  //   expect(mainComponent.timer)
  //     .to.not.be.undefined;
  // });
  // it('should parse tweet text and replace @ with links to user', function() {
  //   mainComponent.$onInit();
  //   mainComponent.timer;
  //   expect(mainComponent.timer)
  //     .to.not.be.undefined;
  // });
});

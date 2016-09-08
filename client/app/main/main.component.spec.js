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

  describe('Main Component Initialization', function() {
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
  });

  describe('MainComponent._grabLinkToTweet', function() {
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
  });

  describe('MainComponent._replaceTweetLinks', function() {
    it('should parse tweet text and return same text if no match', function() {
      mainComponent.$onInit();
      var parsedText = mainComponent._replaceTweetLinks({
        text: 'Some text'
      });

      expect(parsedText).to.equal('Some text')
    });

    it('should parse tweet text and include friendly links for matches', function() {
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
  });

  describe('MainComponent._replaceUsernameReferences', function() {
    it('should parse tweet text and return same text if no match', function() {
      mainComponent.$onInit();
      var parsedText = mainComponent._replaceTweetLinks({
        text: 'Some text'
      });

      expect(parsedText).to.equal('Some text')
    });

    it('should parse tweet text and replace @username with links', function() {
      mainComponent.$onInit();
      var parsedText = mainComponent._replaceUsernameReferences({
        text: 'Some @someuser1 other @someuser2 text'
      });

      expect(parsedText).to.equal('Some <a href="https://twitter.com/someuser1">@someuser1</a> other <a href="https://twitter.com/someuser2">@someuser2</a> text')
    });
  });

  describe('MainComponent._replaceHashTags', function() {
    it('should parse tweet text and return same text if no match', function() {
      mainComponent.$onInit();
      var parsedText = mainComponent._replaceTweetLinks({
        text: 'Some text'
      });

      expect(parsedText).to.equal('Some text')
    });

    it('should parse tweet text and replace hashtags with links', function() {
      mainComponent.$onInit();
      var parsedText = mainComponent._replaceHashTags({
        text: 'Some #DFC other #LeadGeneration text'
      });

      expect(parsedText).to.equal('Some <a href="https://twitter.com/hashtag/DFC?src=hash">#DFC</a> other <a href="https://twitter.com/hashtag/LeadGeneration?src=hash">#LeadGeneration</a> text')
    });
  });
});

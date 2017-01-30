var assert = require('assert');
require('./config.test');
require('../node_modules/angular-cookies/angular-cookies.min');
var sinon = require('../node_modules/sinon/lib/sinon');
var chai = require('chai')
  , spies = require('chai-spies');

chai.use(spies);

var should = chai.should()
  , expect = chai.expect;
require('../main');
//require('../app.table.component');

describe('Test appController', function() {
  beforeEach(ngModule('appModule'));

  beforeEach(global.inject(function($rootScope, $controller, $compile, $httpBackend) {
    scope = $rootScope.$new();
    ctrl = $controller('appController', {$scope: scope});
    compile = $compile;
    httpBackend = $httpBackend;
  }));

  it('Should mount appController component', inject(function() {
    assert.equal(scope.add_result, "Bikes operations");
  }));

  it('Should set show_table to true', inject(function() {
  	element = compile(angular.element('<button type="submit" ng-click="send()" style="display: infline;" class="btn btn-lg btn-success">Get bikes</button>'))(scope);
    httpBackend
    	.expectPOST("http://localhost:3000/api/bikes/")
    	.respond(
    		200,
    		{"bikes":
	    		[{
					"name": "Litening C:68",
					"description": "The bike for the professionals - thanks to our high-end C:68 Carbon frame and race optimized geometry.",
					"image": {
						"thumb": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68-thumb.jpg",
						"large": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68.jpg"
					},
					"class": ["endurance", "race"]
				}]
			}
		);
    element.triggerHandler('click');
    httpBackend.flush();
  	assert.equal(scope.show_table,true)
  }));

  it('Should call submitForm with add', inject(function() {
  	element = compile(angular.element('<form ng-controller="appController" ng-submit="submitForm()"  class="form-group" style="padding: 2%;"><input type="submit" ngClick="Submit"  value="Add" class="btn btn-md btn-success form-control"><ng-form>'))(scope);
    var spy = sinon.stub(scope,"send");
    httpBackend
    	.expectPOST("http://localhost:3000/api/bikes/add/")
    	.respond(
    		200,
    		{"bike":
	    		{
					"name": "Litening C:68",
					"description": "The bike for the professionals - thanks to our high-end C:68 Carbon frame and race optimized geometry.",
					"image": {
						"thumb": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68-thumb.jpg",
						"large": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68.jpg"
					},
					"class": ["endurance", "race"]
				}
			}
		);
    element.triggerHandler('submit');
    httpBackend.flush();
  	assert.equal(spy.called,true)
  }));

  it('Should call submitForm with update', inject(function() {
  	element = compile(angular.element('<update-directive bike="bike" />'))(scope);
  	scope.$digest();
    var spy = sinon.stub(scope,"submitParentForm");
    element.triggerHandler('submit');
    
  	assert.equal(spy.called,true)
  }));  

});
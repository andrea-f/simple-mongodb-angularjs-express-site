var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

//var sinon = require('sinon');
var chaiHttp = require('chai-http');
var app = require('../app');

chai.use(chaiHttp);

/*
 *****************
 * BIKE SERVER TESTING
 *****************
 */

describe("Bike server testing", function() {
	
	beforeEach(function() {
    });

    afterEach(function() {
	});


    /* TEST BIKE RETRIEVAL WITHOUT AUTH KEY */
	it("Check that error object is returned when making the request without an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.length.should.be.eql(0);
              done();
        });
	})

    /* TEST BIKE RETRIEVAL WITH AUTH KEY */
	it("Check that array is returned when making the request with an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/')
            .send({"api_key": "123345677889"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.bikes.should.be.a('array');
                //res.body.length.should.be.eql(0);
              done();
        });
	})

	/* TEST BIKE ADDING WITH AUTH KEY */
	it("Check that object is returned when making the request to save with an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/add')
            .send({
            	"api_key": "123345677889",
            	"id": 1,
				"name": "STO CAZZZO",
				"description": "The bike for the professionals - thanks to our high-end C:68 Carbon frame and race optimized geometry.",
				"image": {
					"thumb": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68-thumb.jpg",
					"large": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68.jpg"
				},
				"class": ["endurance", "race"]
        	})
            .end((err, res) => {
            	// Remove added so we don't pollute the database.
            	var bike_id = new ObjectID(res.body.bike._id);
                Bike.findByIdAndRemove(bike_id, function(err, resp) {});	
                res.should.have.status(200);
                res.body.bike.should.be.a('object');
              done();
        });
	})

	/* TEST DELETING BIKE WITH AUTH KEY */
	it("Check that object is returned when deleting an entry with an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/delete')
            .send({
            	"api_key": "123345677889",
            	"id": "588f29ea191cf2ace7a04ae9"
        	})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
        });
	})

	/* TEST GETTING ONE BIKE WITH AUTH KEY */
	it("Check that object is returned when getting one bike with an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/get')
            .send({
            	"api_key": "123345677889",
            	"id": "588e9fbb5769e89efd8773fb"
        	})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
        });
	})

	/* TEST UPDATING ONE BIKE WITH AUTH KEY */
	it("Check that object is returned when updating one bike with an API key.", function(done) {
		this.timeout(6000);
		chai.request(app)
            .post('/api/bikes/update')
            .send({
            	"api_key": "123345677889",
            	"id": "588e9fbb5769e89efd8773fb",
				"name": "I got updated",
				"description": "The bike for the professionals - thanks to our high-end C:68 Carbon frame and race optimized geometry.",
				"image": {
					"thumb": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68-thumb.jpg",
					"large": "https://buto-files.s3.amazonaws.com/interview-task/images/litening-c68.jpg"
				},
				"class": ["endurance", "race"]
        	})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.bike.should.be.a('object');
              done();
        });
	})

	

});
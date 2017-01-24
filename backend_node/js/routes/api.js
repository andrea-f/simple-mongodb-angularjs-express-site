var express = require('express');
var router = express.Router();

/*
 * Get all bikes 
 */
router.post('/bikes', isLoggedIn, function(req, res, next) {
	Bike.find({}, null, {sort:{name:1}}, function(err, bikes){
		res.json({
			bikes: bikes
		});
	});
});

/*
 * Get a bike 
 */
router.post('/bikes/get/', isLoggedIn, function(req, res, next) {
	var bike_id = new ObjectID(req.body.bikeId);
	// TODO: validate input data
	Bike.findOne({_id: bike_id}, function (err, bike) {
		if(!err) {
			if (bike) {
				console.log("returning bike: " + bike.name);
				res.json({
					bike: bike
				});
			} else {
				console.log("Bike with id: " + bike_id + " not found!");
				res.json({
					error: "Bike with id: " + bike_id + " not found!"
				});
			}
		}
	});

});

/*
 * Add a bike 
 */
router.post('/bikes/add/', isLoggedIn, function(req, res, next) {
	console.log("Add bike! ");
	// TODO: Validate input data!
	console.log(req.body);
	// TODO: Make bike_hash a MD5 hash, or maybe check by name
	var bike_hash = req.body.name;
	Bike.findOne({hash: bike_hash}, function (err, bike) {
		if(!err) {
			new Bike({
				name         : req.body.name, 
				description  : req.body.description, 
				hash         : bike_hash,
				class        : req.body.class,
				image        : req.body.image
			})
			.save(function(err, bike) {
				res.json({
					bike: bike
				});
			});
		}
	});
});

/*
 * Delete a bike by bike ID
 */
router.post('/bikes/delete/', isLoggedIn, function(req, res, next) {
	var bike_id = new ObjectID(req.body.bikeId);
	// TODO: Validate input data
	console.log("Bike to remove: "+bike_id)
	Bike.findByIdAndRemove(bike_id, function(err, resp) {
		if (resp) {
			console.log("Removed bike: "+ resp.name)
			res.json({
				response: "Removed bike with id: " + resp.name
			});
		} else {
			console.log("No such bike: " + bike_id)
			res.json({
				response: "No such bike: " + bike_id
			});
		}
	});	
});

/*
 * Update a bike 
 */
router.post('/bikes/update/', isLoggedIn, function(req, res, next) {
	var bike_id = new ObjectID(req.body.bikeId);
	var new_name = req.body.name;
	// TODO:
	// Check which fields are in post request and are valid, then update
	// Currently only updates name
	Bike.findByIdAndUpdate(bike_id, { name: new_name }, { new: true }, function(err, resp) {
		if (err) {
			res.json({
				error: "Error in updating bike id: " + bike_id
			});
		} else {
			if (resp) {
				console.log("Updated bike: "+ resp.name);
				res.json({
					response: "Updated bike with id: " + resp.name
				});
			} else {
				console.log("No such bike to update: " + bike_id)
				res.json({
					response: "No such bike to update: " + bike_id
				});
			}
		}
	});	

});

// TODO: Add authentication
function isLoggedIn(req, res, next) {
	return next();
}


module.exports = router;

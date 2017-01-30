var express = require('express');
var router = express.Router();
var fs = require('fs');
var Jimp = require("jimp");

/*
 * Get all bikes 
 */
router.post('/bikes', isLoggedIn, function(req, res, next) {
	var sort_by;
	switch(req.body.sort_by) {
		case "description":
			sort_by = {description:1} 
			break;
		case "name":
		default:
			sort_by = {name:1} 
			break;
	};
	Bike.find({}, null, {sort: sort_by}, function(err, bikes){
		res.json({
			bikes: bikes
		});
	});
});

/*
 * Load JSON of bikes 
 */
router.post('/bikes/populate/', isLoggedIn, function(req, res, next) {
	var json_file = JSON.parse(fs.readFileSync('/Users/afassina/Workspace/private/bto/andrea-f/backend_node/js/data/bikes.json', 'utf8'));
	console.log(json_file)
	Bike.insertMany(json_file.items).then(function(err, bikes){
		console.log(err, bikes)
		if (err) res.json(err);
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
	
	var count = 0;
	for (var key in req.body) {
		count += 1;
	}
	if (count === 0) {
		res.json({
			"errors": {}, 
			"message":"No input submitted!"
		});
	} else {
		if (req.body.image.large === req.body.image.thumb) {
			return createThumbImage(req, res, "add");
		} else {
			return saveBike(req, res);
		}
	}
});

/*
 * Delete a bike by bike ID
 */
router.post('/bikes/delete/', isLoggedIn, function(req, res, next) {
	Bike.findByIdAndRemove(req.body.id, function(err, resp) {
		if (resp) {
			console.log("Removed bike: "+ resp.name)
			res.json({
				response: "Removed bike with name: " + resp.name
			});
		} else {
			console.log("No such bike: " + req.body.id)
			res.json({
				response: "No such bike: " + req.body.id
			});
		}
	});	
});

/*
 * Update a bike 
 */
router.post('/bikes/update/', isLoggedIn, function(req, res, next) {
	if (req.body.image.large === req.body.image.thumb) {
		return createThumbImage(req, res, "update");
	} else {
		return updateBike(req, res);
	}

});

/*
 * Performs the actual update operation in db
 */
function updateBike(req, res) {
	var bike_id = new ObjectID(req.body.id);
	delete req.body['id'];
	var update_object = req.body;
	if ((typeof update_object['class'] !== 'undefined') && (Object.prototype.toString.call(update_object['class']) ) !== "[object Array]") {
		update_object['class'] = update_object['class'].split(',');
	};
	Bike.findByIdAndUpdate(bike_id, update_object, { new: true, runValidators: true }, function(err, bike) {
		if (err) {
			res.status = 500;
			res.json(err);
		} else {
			if (bike) {
				console.log("Updated bike: "+ bike.name);
				res.json({
					bike: bike
				});
			} else {
				console.log("No such bike to update: " + bike_id)
				res.json({
					response: "No such bike to update: " + bike_id
				});
			}
		}
	});	
}

/*
 * Performs the actual save operation in db
 */
function saveBike(req, res){
	var opts = { runValidators: true };
	Bike.findOne({name: req.body.name}, opts, function (err, bike) {
		if(!err) {
			new Bike({
				name         : req.body.name, 
				description  : req.body.description, 
				class        : req.body.class.split(','),
				image        : req.body.image//function(){return encode_image(req.body.image.thumb);}
			})
			.save(function(err, bike) {
				//console.log(err,bike)
				if (err) {
					res.status = 500;
					res.json(err);
				} else {
					//console.log(bike)
					res.json({
						bike: bike
					});
				}
			});
		} else {
			console.log(err)
			res.status = 500;
			res.json({
				"errors": err
			});			
		}

	});
}

/*
 * Perform token based authentication:
 * if request is from same host, then skip header auth, otherwise check
 */
var pretty_awesome_api_keys = ['123345677889']
function isLoggedIn(req, res, next) {
	for (var key in req) {
		console.log(key)
	}
	var origin_noport = "",
		host_noport = "";
	try {
		var host = req.get('host'),
		localhost = req.headers.origin;
		host_noport = host.split(':')[0]
		origin_noport = localhost.split(':')[1].replace("//","")
		browser_request = true;
	} catch (err) {
		browser_request = false;
	}
	if ((host_noport === origin_noport) && (browser_request)) {
		return next();
	} else {
		if ((!req.body.api_key) || (pretty_awesome_api_keys.indexOf(req.body.api_key) === -1)) {
			res.json({
				"errors": {},
				"message": "Not authorized!"
			});	
		} else{
			return next()
		}
	}
	
}

/*
 * Creates thumbnail image before updating or saving.
 */
function createThumbImage(req, res, type) {
	// Create thumbnail image from input url.
	return Jimp.read(req.body.image.thumb, function (err, newimg) {
	    if (err) saveBike(req, res);
	    var mime = "image/png";
	    return newimg.resize(256, 256)           
	         .quality(60)                 
	         .getBase64( mime, function(err, img){
	         	if (!err) {req.body.image.thumb = img;}
	         	switch (type){
	         		case "add":
	         			// Save bike to db
	         			saveBike(req, res);
	         			break;
	         		case "update":
	         			// Update bike
	         			updateBike(req, res);
	         			break;
	         	}
	         	
	         	
	         })
		});
}




module.exports = router;

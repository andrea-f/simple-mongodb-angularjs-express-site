var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Bike = new Schema({
    name: String,
    image: {
    	thumb: String,
    	large: String
    },
    description: String,
    class: Array
});

var User = new Schema({
    local: {
        email: String,
        password: String
    }
});

// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = {
	"user": mongoose.model('user', User),
	"bike": mongoose.model('bike', Bike)
};

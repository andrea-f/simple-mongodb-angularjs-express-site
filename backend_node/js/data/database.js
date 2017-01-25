var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var bcrypt   = require('bcrypt-nodejs');

var User = new Schema({
    local: {
        email: String,
        password: String
    }
});

var Bike = new Schema({
	image_base64: {type: String},
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                if ( (typeof v === "string") && (v.length > 0) ) { 
                	return true; 
                } else { 
                	return false; 
                };
                
            },
            message: '{VALUE} is not a valid name!'
        }
    },
    image: {
    	thumb: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    // Add better checking here
                    ( (Object.prototype.toString.call(v) === "[object String]") && (v.length > 0) ) ? isValid = true : isValid = false;
                    return isValid;
                },
                message: '{VALUE} is not a valid thumb image!'
            }
        },
        large: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    // Add better checking here
                    ( (Object.prototype.toString.call(v) === "[object String]") && (v.length > 0) ) ? isValid = true : isValid = false;
                    return isValid;
                },
                message: '{VALUE} is not a valid large image!'
            }
        }	
    },
    description: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                ( (Object.prototype.toString.call(v) === "[object String]") && (v.length > 0) ) ? isValid = true : isValid = false;
                return isValid;
            },
            message: '{VALUE} is not a valid description!'
        }
    },
    class: {
        type: Array,
        required: true,
        validate: {
            validator: function(v) {
            	( (Object.prototype.toString.call(v) === "[object Array]") && (v.length > 0) ) ? isValid = true: isValid = false;
                return isValid;
            },
            message: '{VALUE} is not a valid class!'
        }
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
	"bike": mongoose.model('bike', Bike)
};

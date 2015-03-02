var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueSchema = new Schema({
	assigned: Boolean,
    message: String,
    date: Date,
    location: { 
        type: String, 
        required: true, 
    },
    _owner: { 
    	type: String, 
    	ref: 'User',
    	index: { 
            unique: true 
        }
    }
});

module.exports = mongoose.model('Que', QueSchema);

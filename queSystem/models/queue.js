var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueueSchema = new Schema({
    status: Boolean,
    _items: [{ 
    	type: String, 
    	ref: 'Que',
    	index: { 
            unique: true 
        }]
    }
});

module.exports = mongoose.model('Queue', QueueSchema);

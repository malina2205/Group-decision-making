var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('../models/User');

var DecisionSchema   = new Schema({
    title: {type : String, default : '', required : true},
	description: { type: String, required: false },
	date: { type: String, required: true },
	candidates: [],
	experts: [],
	status: { type: String, required: true },
});

module.exports = mongoose.model('Decision', DecisionSchema);
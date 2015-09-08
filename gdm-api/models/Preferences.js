var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var PreferencesSchema  = new Schema({
	expert: {type: Schema.Types.ObjectId, ref: 'User', required : true},	
	decision: {type: Schema.Types.ObjectId, ref: 'Decision', required : true},
	matrix: {type: Array},
	status: {type: String, required : true}
});

module.exports = mongoose.model('Preferences', PreferencesSchema);
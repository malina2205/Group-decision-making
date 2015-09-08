var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var UserSchema   = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: false}
});

module.exports = mongoose.model('User', UserSchema);

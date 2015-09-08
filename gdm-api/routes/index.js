var express = require('express');
var router = express.Router();



 
var auth = require('./auth.js').auth;
var user = require('./users.js');
var decision = require('./decisions.js');
var preferences = require('./preferences.js');
var answer = require('./answer.js');

//login
router.post('/authorization', auth.login);
//register
router.post('/users', user.addUser);

router.get('/api/users', user.find);
router.get('/api/users/:id', user.findById);
router.put('/api/users/:id', user.updateUser);
router.delete('/api/users/:id', user.deleteUser);

router.get('/api/decisions/', decision.findAll);
router.get('/api/decisions/:id', decision.findByDecisionId);
router.get('/api/decisions/user/:userid', decision.findByUserId);
router.post('/api/decisions', decision.addDecision);
router.put('/api/decisions/:id', decision.updateDecision);
router.delete('/api/decisions/:id', decision.deleteDecision);

//wszystkie preferencje //query
router.get('/api/preferences', preferences.findAll);
router.post('/api/preferences', preferences.addPreferences);			
router.get('/api/preferences/:id', preferences.getPreferences);
router.put('/api/preferences/:id', preferences.updatePreferences);
router.delete('/api/preferences/:id', preferences.removePreferences);

router.get('/api/answer/:decisionid', answer.solve)


var User = require('../models/User');
var Decision = require('../models/Decision');
var Preferences = require('../models/Preferences');
var mongoose = require('mongoose');
router.get('/killthemall', function(req, res){
	User.find({}).remove();
	Decision.find({}).remove();
	Preferences.find({}).remove();
	res.status(200);	
	res.json(
    	{data: "MWUAHAHAHAHA"}
    );
});      
module.exports = router;
 

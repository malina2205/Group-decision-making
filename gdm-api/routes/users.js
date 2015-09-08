var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');


// GET: /users/:id
exports.findById = function(req, res) {
    console.log("find user REQ QUERY", req.query);
var query = User.findOne({_id: req.params.id}).select('name email'); 
    query.exec(function(err, user) {
    	if (err) {
        	res.status(500);
            res.json(err);
        }
        if (user==null){
        	res.status(404);
        	 res.json({
                "message": "user not found"
        	});
        }
        else {
            res.status(200);
    		res.json(user);
        }
    });            
}

// GET: /users/:id
exports.findByEmail = function(req, res) {
    console.log("find user ", req.query);
var query = User.findOne({_id: req.params.id}).select('name email'); 
    query.exec(function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
        }
        if (user==null){
            res.status(404);
             res.json({
                "message": "user not found"
            });
        }
        else {
            res.status(200);
            res.json(user);
        }
    });            
}

// GET: /users
exports.find = function(req, res) {
    console.log("GET USERS ")
	var query = User.find(req.query).select('name email password'); 
    query.exec(function(err, users) {
    	if (err) {
        	res.status(500);
            res.json(err);
        }
        else if (users.length < 1){
            res.status(404);
            res.json({"message": "not found"})
        }
        else {
    		res.json(users);
        }
    });            
}
 
// POST: /users
exports.addUser = function(req, res) {/*
    req.assert('email', 'A valid email is required').isEmail();  //Validate email
    var errors = req.validationErrors();  
    if (errors) {   //Display errors to user
        console.log("VALIDATION ERROR ", errors);
        res.status(400);
        res.json({
           "message": "validation error!",
        });
    }*/

    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
        	console.log(err);
        	res.status(500);
            res.json(err);
        } 
        else {
            if (user !== null) {
            	console.log("USER FOUND");
            	res.status(409);
                res.json({
                   "message": "User already exists!",
                });
            } 
            else {
                console.log("CREATING NEW USER");
                var user = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
                var userModel = new User(user);
                userModel.save(function(err, user) {
                  if(err){
                    console.log(err);
                    	res.status(500);
                        res.json(err);
                  }
                  else{
                  	res.status(201);
                    res.json(user);
                  }
                });
            }
        }
    });
}

// PUT: /users/:id
exports.updateUser = function(req, res) {
    var conditions = {_id: req.params.id};
    var update = req.body;
    var options = {};
    User.findOne({email: req.body.email}, function(err, usermail) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json(err);
        } 
        else{
            if (usermail !== null) {
                console.log("USER FOUND");
                res.status(409);
                res.json({
                   "message": "User already exists!",
                });
            } 
            var query = User.findOneAndUpdate(conditions, update, options).select('name email password'); 
        	//User.findOneAndUpdate(conditions, update, options, 
            query.exec(function(err, user) {
            	if (err) {
                	res.status(500);
                    res.json(err);
                }
                if (user==null){
                	res.status(404);
                	 res.json({
                        "message": "user not found"
                	});
                }
                else {
                    res.status(200);
            		res.json({"message": "Ok"});
                }
            }); 
        }
    });
}

// DELETE: /users/:id
exports.deleteUser = function(req, res) {
    User.findOneAndRemove({_id: req.params.id}, function(err, user) {
    	if (err) {
        	res.status(500);
            res.json(err);
        }
        if (user==null){
        	res.status(404);
        	 res.json({
                "message": "user not found"
        	});
        }
        else {
            res.status(204);
            res.send();
        }
    }); 
}


var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var Decision = require('../models/Decision');
var Preferences = require('../models/Preferences');
var preferencesFunctions = require('./preferences.js');

// GET decisions
exports.findAll = function(req, res) {
    query = req.query;
    Decision.find(query, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Error occured: " + err
            })
        }
        res.status(200);
        res.json(found);
    });                
};

// GET decisions/:id
exports.findByDecisionId = function(req, res) {
    Decision.findById(req.params.id, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Error occured: " + err
            })
        }
        res.status(200);
        res.json(found);
    });                
};

//GET decisions/user/:userid
exports.findByUserId = function(req, res) {
    var userid = req.params.userid;       
    Decision.find({"experts._id": userid}, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Error occured: " + err
            })
        }
        res.json(found)
    });         
}

// POST /decisions
exports.addDecision = function(req, res) {
    var model = new Decision(req.body);
    model.save(function(err, decision) {
        if(err){
        console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            experts = req.body.experts;
            newExpertsTab = [];
            for(var i=0; i<experts.length; i++){
                var expPrefs = {
                    decision: decision._id,
                    expert: experts[i]._id,
                    status: "empty",
                    preferences: []
                }

                var updateDecision = function(pref, expert, last){
                    expert.preferences = pref._id;
                    newExpertsTab.push(expert);
                    console.log(newExpertsTab);

                    if(last){
                        console.log("--", last, newExpertsTab);
                            var conditions = {_id: pref.decision};
                            var update = {experts: newExpertsTab};
                            var options = {};
                            var error = function(err){
                                res.status(500);
                                res.json(err);
                            }
                            var success = function(decision2){
                                res.status(200);    
                                res.json(decision2);
                            }
                            update2(conditions, update, options, error, success);
                    }
                }

                var error = function(err){
                    res.status(502);
                    res.json({
                        "message": "Error occured: " + err,
                    });
                    //TODO!!!!!!!!!!!!!!!!!
                    //USUNAC DECYZJE Z BAZY
                }

                isLast = (i==experts.length-1);
                preferencesFunctions.add(expPrefs, updateDecision, error, experts[i], isLast);
            }
        }
    });       
};

// PUT /decisions/:id
exports.updateDecision = function(req, res) {
    var conditions = {_id: req.params.id};
    var update = req.body;
    var options = {};
    var error = function(err){
        res.status(500);
        res.json(err);
        };
    var success = function(decision){
        if (decision==null){
            res.status(404);
             res.json({
                message: "decision not found"
            });
        }
        else {
            res.status(200);
            res.json({"message": "Ok"});
        }
    }
    update2(conditions, update, options, error, success);               
};

var update2 = function(conditions, update, options, error, success){
    console.log("!!!!!!!!!!!!!!!!!!!!!")
    var query = Decision.findOneAndUpdate(conditions, update, options); 
    query.exec(function(err, decision) {
        if (err) {
            error(err);
        }
        else {
            success(decision);
        }
    });             
}

// DELETE /decisions/:id
exports.deleteDecision = function(req, res) {
    Decision.findById(req.params.id, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Removing decision - Error occured: " + err
            })
        }
    }).remove();
    Preferences.find({"decision": req.params.id}, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Removind Preferences - Error occured: " + err
            })
        }
    }).remove();  
    res.json({"message": "ok"});                
};
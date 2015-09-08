var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var Preferences = require('../models/Preferences');
var Decision = require('../models/Decision');

//GET /preferences' 
exports.findAll = function(req, res) {
    Preferences.find(req.query, function(err, preferences){
        if(err){
        console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            res.status(200);  
            res.json(
                preferences
            );
        }
    });      
};

//GET /preferences/:id' 
exports.getPreferences = function(req, res) {
    preferencesId = req.params.id;
    Preferences.findById(req.params.id, function(err, preferences){
        if(err){
        console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            res.status(200);  
            res.json(
                preferences
            );
        }
    });      
};

//POTRZEBNE?
// POST /preferences
exports.addPreferences = function(req, res) {
    var model = new Preferences(req.body);
    model.save(function(err, preferences) {
        if(err){
        console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            res.status(200);    
            res.json(
                preferences
            );
        }
    });       
};

exports.add = function(preferences, success, error, expert, last) {
    var model = new Preferences(preferences);
    model.save(function(err, prefs) {
        if(err){
            error(err);
        }
        else{
            success(prefs, expert, last);
        }
    });       
};

// PUT /preferences/:id
exports.updatePreferences = function(req, res) {
    //console.log("PUT /preferences? ", req.query);
    var newMatrix = req.body.matrix;
    var newStatus = req.body.status;
    Preferences.update({_id: req.params.id}, {matrix: newMatrix, status:newStatus}, function(err, updatedNum){
        if(err){
        console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            Preferences.findOne({_id: req.params.id}, function(err, preferences){
                var decisionId = preferences.decision;
                Preferences.find({decision: decisionId}, function(err, preferencesTab){
                    if(err){
                        res.status(502);
                        res.json({
                            "message": "Error occured: " + err,
                        });
                    }
                    else{
                        var ready = true;
                        var started = false;
                        for(var i=0; i<preferencesTab.length; i++){
                            if(preferencesTab[i].status === "done"){
                                started = true;
                            }
                            else{
                                ready = false;
                            }
                        }
                        console.log("Po petli: ready ", ready, " started ", started);
                        if(ready && started){
                            console.log("justawiam done");
                            Decision.update({_id: decisionId}, {status: "done"}, function(err, decision){
                                console.log("updated", decision);
                            });
                        }
                        else if(started){
                            console.log("ustawiam  started");
                            Decision.update({_id: decisionId}, {status: "started"}, function(err, decision){
                                console.log("updated", decision);
                            });
                        }

                        res.status(200);  
                        res.json({"message": "Ok"});
                    }
                })                
            })

        }
    });
};

exports.removePreferences = function(req, res){
    var id = req.params.id;
    Preferences.findById(req.params.id, function(err, found) {
        if(err){
            res.status(507);
            res.json({
                "message": "Error occured: " + err
            })
        }
    }).remove();
    res.json({"message": "ok"});         
}
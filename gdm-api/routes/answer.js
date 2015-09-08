var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var Decision = require('../models/Decision');
var Preferences = require('../models/Preferences');
//var PythonShell = require('python-shell');
var fs = require('fs');
var exec = require("child_process").exec;

/**
 * @param {String} name
 * @returns {Object}
 */
exports.solve = function(req, res) {
    var decisionId = req.params.decisionid;
    console.log("get decision");
    Preferences.find({decision: decisionId}, function(err, pref){
        if(err){
            console.log(err);
            res.status(502);
            res.json({
                "message": "Error occured: " + err,
            });
        }
        else{
            console.log("------preferences -----")
            console.log(pref);
            console.log("-----------------------")
            var file_path = 'python/decision_'+ decisionId
            fs.writeFile(file_path, JSON.stringify(pref), function (err) {
                if (err) return console.log(err);
                console.log('file written');
            });

            exec('python python/direct.py ' + file_path, function (err, stdout, stderr) {
                if(err){
                    console.log(err);
                }
                //Print stdout/stderr to console
                outJson = JSON.parse(stdout);
                res.json(outJson);
        });
        }
    });

};
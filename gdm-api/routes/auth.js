var jwt = require('jwt-simple');
var User = require('../models/User');

var auth ={
    login: function(req, res) {
      console.log("LOGIN: " + req.headers)
      console.log(JSON.stringify(req.headers, null, 2)," ", JSON.stringify(req.body, null, 2)); 
      var userEmail = req.body.email || '';
      var userPassword = req.body.password || '';
      if (userEmail == '' || userPassword == '') {
        res.status(401);
        res.json({
          "message": "Invalid credentials"
        });
        return;
      }

      var success = function(dbUserObj){
        console.log("dbUser: ", dbUserObj);
        if (!dbUserObj) { // If authentication fails, we send a 401 back
          res.status(401);
          res.json({
            "status": 401,
            "message": "Invalid credentials"
          });
          return;
        }
     
        if (dbUserObj) {
     
          // If authentication is success, we will generate a token
          // and dispatch it to the client
     
          res.json(genToken(dbUserObj));
        }
      }

      var dbUserObj = auth.validate(userEmail, userPassword, res, success);
    },
 

    // Fire a query to your DB and check if the credentials are valid
    validate: function(userEmail, userPassword, res, success){
      var query = User.findOne({email: userEmail, password: userPassword}).select('name email');
      query.exec(function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
        }
        else{
          success(user);
        }
        /*else if (!user) { // If authentication fails, we send a 401 back
            res.status(401);
            res.json({
                "message": "Invalid credentials"
            });
            return;
        }
        else {
            // If authentication is success, we will generate a token
            // and dispatch it to the client
            res.status(200);
            var  token = genToken(user);
            user.token = token;
            console.log(user);
            res.json(user);
        } */
        return user;
      })
    },

    validateUser: function(decoded, res, success){

      var query = User.findOne({_id: decoded.iss}).select('id name email');
      query.exec(function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
        }
        else{
          success(user);
        }
        return user;
    });
  }
}



var genToken = function (user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    iss: user.id,
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
var expiresIn = function(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

exports.auth = auth;
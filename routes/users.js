const router = require('express').Router();
const mongoose = require('mongoose');
var UserModel = require('../models/users')(mongoose);

router.post('/signup', function(req,res,next) {
    console.log("signup here@@@@@@@@@@@@@@");
    // console.log("email: ",req.body.email,"password: ",req.body.password);
    console.log('what is req body : ',req.body);
    if(req.body.email && req.body.password) {
        console.log("signup here");
        signup_user(req.body.email, req.body.password, function(response) {
            res.status(201).json(response);
        });
    } else {
        res.json({"success": false, "error": "Missing fields"});
    }
});

router.post('/signin', function(req,res,next) {
    console.log('what is req body : ',req.body);
    if(req.body.email && req.body.password) {
        signin_user(req.body.email, req.body.password, function(response) {
            if(response.success){
                res.cookie("user",req.body.email,{signed: true});
                res.status(200).json(response);
            }
            else{
                res.status(400).json(response);
            }
        });
    } else {
        res.json({"success": false, "error": "Missing fields"});
    }
});

router.post('/signout', function(req,res,next) {
    res.clearCookie("user");
    res.redirect('http://localhost:3000');
})



function signup_user(email, password, callback) {
    var newUser = new UserModel.user({
        email   : email,
        password: password
    });
    newUser.save(function(error,response) {
        if(error || !response) {
            callback({"success": false});
        } else {
            callback({"success": true});
        }
    });
}

function signin_user(email, password, callback) {
    var data = {
        email : email,
        password : password
    }
    UserModel.user.findOne(data, function(err, user) {
        if(err || user === null) {
            callback({"success": false});
        } else {
            callback({"success": true});
        }
    });
}


module.exports = router;
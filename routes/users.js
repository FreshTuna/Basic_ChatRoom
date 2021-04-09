const router = require('express').Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

var UserModel = require('../models/users')(mongoose);

router.post('/signup', function(req,res,next) {
    // console.log("email: ",req.body.email,"password: ",req.body.password);
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
    if(req.body.email && req.body.password) {
        signin_user(req.body.email, req.body.password, async (response) => {
            if(response.success){
                console.log("response_user :",response.user);
                const token = jwt.sign({user:response.user}, SECRET_KEY,{expiresIn:'1h'});
                res.cookie("user",token);
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



async function signup_user(email, password, callback) {
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
            callback({"success": true,"user":user});
        }
    });
}


module.exports = router;
const router = require('express').Router();
const Message = require('../models/messages');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/',(req,res) => {
    var cookie = jwt.verify(req.cookies['user'],SECRET_KEY);
    console.log("message : ",cookie.user.email);
    var sendingObject = Object.assign(req.body,{'user':cookie.user.email});
    Message.create(sendingObject)
        .then(message => res.send(message))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
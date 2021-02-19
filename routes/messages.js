const router = require('express').Router();
const Message = require('../models/messages');

router.post('/',(req,res) => {
    var cookie = req.signedCookies['user'];
    console.log("cookie =",cookie)
    var sendingObject = Object.assign(req.body,{'user':cookie})
    Message.create(sendingObject)
        .then(message => res.send(message))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
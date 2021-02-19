const mongoose = require('mongoose');

module.exports = function(mongoose){
    const userSchema = mongoose.Schema({
        email    : { type: String, required: true, unique: true },
        password : { type: String, required: true } 
    });
    const models = {
        user : mongoose.model('user',userSchema)
    }
    return models;
}
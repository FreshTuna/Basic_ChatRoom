const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/testchat");

autoIncrement.initialize(connection);

const messageSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true,
    },
    content:{
        type: String,
        required: true,
    },
    user:{
        type: String
    }},
    {
        timestamps:true
    }
);

messageSchema.plugin(autoIncrement.plugin,{
    model: 'messages',
    field: 'id',
    startAt: 0,
    incrementBy: 1
});



messageSchema.statics.create = function (payload) {
    const message = new this(payload);
    return message.save();
};


var Message = connection.model('Message',messageSchema);
module.exports = mongoose.model('Message',messageSchema);
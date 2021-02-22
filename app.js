const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Message = require('./models/messages');
const messageRouter = require('./routes/messages');
const userRouter = require('./routes/users');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;


const connect = () => {
    if(process.env.NODE_ENV !='production'){
        mongoose.set('debug',true)
    }
    mongoose.connect('mongodb://localhost/testchat', {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
    }, (error) =>{
        if(error){
            console.log('디비 연결 에러',error);
        } else {
            console.log('디비 연결 성공');
        }
    });
}
connect();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended:true,
    })
)
app.use(cookieParser('12345'));

app.set('view engine','ejs');

app.get('/', async (req,res) => {
    const messages = await Message.find().sort({
        'id':1
    })
    console.log("is there cookie? :",req.cookies['user']);
    if(req.cookies['user']){
        jwt.verify(req.cookies['user'], SECRET_KEY, (err, cookie) => {
            if(err){
                res.clearCookie('user');
                res.render('chat',{messages:messages,user:undefined});
            } else {
                console.log("there is a user!!!",cookie.user.email);
                res.render('chat',{messages:messages,user:cookie.user.email});
            }
        });
    } else {
        res.render('chat',{messages:messages,user:undefined});
    }
});

app.get('/signup',(req,res) => {
    res.render('signup');
})

app.get('/signin',(req,res) => {
    res.render('signin');
})

const users = {}

io.on('connection', (socket) => {
    socket.on('connected',(nickname) => {
        users[socket.id] = nickname;
        console.log(users);
        socket.broadcast.emit('enterance-message',nickname + ' has entered');
    });
    socket.on('disconnect', () => {
        console.log(users);
        socket.broadcast.emit('leave-message',' has left');
    });
    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message',msg);
        socket.emit('my-message',msg)
    });
});

app.use('/messages', messageRouter);
app.use('/users', userRouter);

var server = http.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is working: PORT - ',port);
});

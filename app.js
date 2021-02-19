const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Message = require('./models/messages');
const messageRouter = require('./routes/messages');
const userRouter = require('./routes/users');
const cookieParser = require('cookie-parser');

const app = express();

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
    console.log(req.cookies['user']);
    res.render('chat',{messages:messages,user:req.signedCookies['user']});
});

app.get('/signup',(req,res) => {
    res.render('signup');
})

app.get('/signin',(req,res) => {
    res.render('signin');
})

app.use('/messages', messageRouter);
app.use('/users', userRouter);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is working: PORT - ',port);
});

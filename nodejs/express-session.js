var express = require('express')
var parseurl = require('parseurl')
//세션이용
var session = require('express-session')
//세션을 파일에 저장
var FileStore = require('session-file-store')(session)

var app = express()
//세션 사용
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}))

app.get('/', function (req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1;
    } else {
        req.session.num =  req.session.num + 1;
    }
    res.send(`Views : ${req.session.num}`);
})

app.listen(3000, function () {
    console.log('3000!');
});
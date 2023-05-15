var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());


//세션이용
var session = require('express-session')
//세션을 파일에 저장
var FileStore = require('session-file-store')(session)


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//세션 사용
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}

//passport는 세션으로 내부적으로 사용하기 때문에 express-session을 활성화 시키는 코드 다음에 등장해야한다.!!
var passport = require('passport');
var LocalStrategy = require('passport-local');
var flash=require('connect-flash');
//passport를 설치한 것이고 express가 호출이 될 때마다 passport.initalize가 호출되면서 우리의 app에 개입됨
app.use(passport.initialize()); //passport미들웨어 등록
app.use(passport.session()); //passport가 내부적으로 세션 미들웨어를 쓰겠다.

//flash도 세션을 내부적으로 쓰고 있기 때문에 세션 다음에 미들웨어를 설치해야한다. 
app.use(flash());
//세션을 처리하는 방법
passport.serializeUser(function(user,done){
  done(null,user.email);//두번째 인자에 user의 식별자를 넣어주기로 !약속!되어 있음
  //세션폴더의 세션 데이터 파일에 user의 식별자가 들어감
})

//로그인이 되면 페이지를 방문할 때마다 deserializeUser의 콜백이 호출하기로 약속 되어있음
//호출될때마다 사용자의 데이터를 저장하고 있는 authData에 들어있는 사용자의 실제데이터를 가져온다.
passport.deserializeUser(function(id,done){
  done(null,authData);
  // User.findByID(id,function(err,user){
  //   done(err,user);
  // })
})
/*정리
로그인에 성공되면 serializeUser 딱 한번 호출해서 세션폴더의 세션파일데이터에 user식별자가 들어가고,
사용자가 로그인하고, 웹페이지 아무대나 방문할때마다 로그인한 사용자인지 아닌지 확인해야하는데
passport가 deserializeUser()를 호출한다.
deserializeUser()은 세션파일에 저장된 데이터를 기준으로 해서 우리가 필요한 조회를 할때 필요한 함수이다.

*/

// username과 password를 이용해서 로그인하는것이 local방식(passport의 여러 전략중 하나이다.)
// /auth/login_process에 POST로 데이터가 들어오면 데이터를 처리하는 callback이 passport에서 제공하는 API(함수)를 실행하도록 약속되어있음
//사용자가 로그인을 전송했을때 passport가 로그인 데이터를 처리하는 코드
app.post('/auth/login_process', passport.authenticate('local', {
  successRedirect: '/',       //성공했을 때는 home으로
  failureRedirect: '/auth/login' //실패했을 때는 다시 로그인 페이지로
}));


//그럼 도대체 어떻게 로그인 했는지 안했는지 암?

//passport를 이용할 땐 form을 작성하고 name을 username,password로 요청해라 (약속임)근데 지키기 싫으면 밑에 파라미터를 우리가 만든 form에 name으로 바꾸면됨
//사용자가 로그인을 시도하면 로그인을 성공했는지 실패했는지 처리하는 코드
passport.use(new LocalStrategy(
  {
    usernameField:'email',
    passwordField:'pwd'
  },
  function(username, password, done) {
    console.log('LocalStrategy',username,password);
    if(username===authData.email){
        console.log(1);
        if(password===authData.password){
          console.log(2);
          //serializeUser콜백함수의 첫번째 인자로 authData를 줌
          return done(null,authData); //js에서 false가 아닌값을 주면 true라고 생각하기 때문에 성공임
        }else{
          console.log(3);
          return done(null,false,{
            message:'Incorrect password.'
          })
        }

    }else{
      console.log(4);
      return done(null,false,{
        message:'Incorret username.'
      })
    }
    
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) { return done(null, false); }
    //   if (!user.verifyPassword(password)) { return done(null, false); }
    //   return done(null, user);
    // });
  }
));


app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

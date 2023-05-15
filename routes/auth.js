var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');


router.get('/login', function (request, response) {
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
});

// router.post('/login_process', function (request, response) {
//   var post = request.body;
//   var email = post.email;
//   var password = post.pwd;
//   if(email === authData.email && password === authData.password){
//     request.session.is_logined = true;
//     request.session.nickname = authData.nickname;
//     //세션객체에 save함수를 이용하면 세션객체의 데이터를 함수가 세션스토어에 반영하는 작업을 바로 시작하고 인자로 callback함수를 호출하도록 약속하기로함 callback함수를 이용해 사용자의 정보를 저장해 redirect함수를 실행한다.
//     request.session.save(function(){ 
//       response.redirect(`/`);
//     });
//   } else {
//     response.send('Who?');
//   }
// });

router.get('/logout', function (request, response) {

  request.logout(function(err) {
    if (err) { return next(err); }

    //방법1. passport에 로그아웃하고 세션을 삭제한 것을 확인하고 redirect하는게 더 안전하다.
  // request.session.destroy(function(err){ //destroy를 이용하여 세션이 삭제된다.
  //   response.redirect('/');
  // });
  //방법2. 현재 세션의 상태를 세션 스토어에 저장하고 저장작업이 끝나면 리다이렉트를 한다.
    request.session.save(function(){
      response.redirect('/');
    })
  });
  
  

});


module.exports = router;
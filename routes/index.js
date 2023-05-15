var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');


router.get('/', function (request, response) {
  //deserialize()콜백 함수에 두번째 인자로 주입된데이터가 request.user로 전달되도록 약속되어있다.
  //passport를 사용하면 request객체에 user를 사용할 수 있도록 해준다. 약속임
  console.log('/',request.user);  
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});

module.exports = router;
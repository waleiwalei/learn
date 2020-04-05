### app
```js
var app = express();
```
- app.use(path, function) 
    + 使用中间件function path默认/
    ```js
        app.use(function(req, res, next) {
            // logger
            console.log('%s %s', req.method, req.url);
            next();
        })

        // 响应
        app.use(function(req, res, next){
            res.send('Hello World');
        });

        app.listen(3000);

        // 静态资源
        // GET /static/javascripts/jquery.js
        // GET /static/style.css
        // GET /static/favicon.ico
        app.use('/static', express.static(__dirname + '/public'));
    ```
    + app.use()定义中间件顺序执行，通过顺序表达优先级，比如logger放在最前边记录每个请求/再比如多个静态文件资源，会优先匹配先使用的中间件对应的文件夹
    ```js
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/files'));
    app.use(express.static(__dirname + '/uploads'));
    ```
- setting
    + app.enable('trust proxy') 激活反向代理 默认不激活
- app.engine(ext, cb)
    设置模板引擎
    只要cb函数的入参符合(path, options, callback)格式即可

### req
- req.params
    + /user/:id req.params.id
    + 如果是正则 捕获分组req.params[0]
- req.query
    /user?id=1 req.query.id
- req.body 是经过中间件bodyParser解析后的 为{} 其他请求体解析可以放在后边
- req.files 上传的文件对象 同上
- req.param 查询参数，顺序：req.params/req.body/req.query 不太常用
- req.route 当前匹配route里的属性
    ```js
        app.get('/user/:id?', function(req, res){
            console.log(req.route);
        });

        // 输出
        { 
            path: '/user/:id?',
            method: 'get',
            callbacks: [ [Function] ],
            keys: [ { name: 'id', optional: true } ],
            regexp: /^\/user(?:\/([^\/]+?))?\/?$/i,
            params: [ id: '12' ] 
        }
    ```
- req.cookies 使用cookieParser()中间件后 默认为{} 包括用户传过来的cookie信息
- req.ip 用户远程ip 如果“trust proxy”=true 返回上一级ip
- req.ips “trust-proxy”=true && X-FORWARD-FOR="ip1,ip2,ip3" 结果为[ip1, ip2, ip3]

### res
- res.jsonp
    ```js
    // ?callback=foo
    res.jsonp({ user: 'tobi' })
    // => foo({ "user": "tobi" })

    app.set('jsonp callback name', 'cb');

    // ?cb=foo
    res.jsonp(500, { error: 'message' })
    // => foo({ "error": "message" })
    ```

### 中间件
- bodyParser
    ```js
    app.use(express.bodyParser());

    // 等同于:
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    ```
- basicAuth
- compress
- cookieParser
- cookieSession
- csrf
- directory

### cookieParser对cookie签名实现流程
[link](https://www.cnblogs.com/chyingp/p/express-cookie-parser-deep-in.html)
- 尽可能保证cookie不被篡改
```js
// 传入的秘钥 签名和验证都要使用
app.use(cookieParser('secret'));

// 设置cookie通过res.cookie进行
res.cookie = function(name, value, opt) {
    let val;
    let secret = req.cookie.secret;
    if(opt.signed) {
        val = 's:' + sign(value, secret);
    }
    this.append('set-cookie', cookie.serialize(name, String(val), opt));
}
function sign(val, secret) {
    return val + '.' +hmac(val, secret);
}
// req.cookie 哪来的？
// cookieParser伪代码
function cookieParser(secret) {
    return function(req, res, cb) {
        req.cookie.secret = secret;
        // ...
        next();
    }
}

// 验证签名 、 签名解析
function signedCookie(str, secret) {
    if(str.substr(0, 2) != 's:') {
        return str;
    }
    var val = unsign(str.slice(2), secret);
    if(val !== false) {
        return val;
    }
    return false;
}

// unsign 不是反签名，只是对签名做校验
function unsign(str, secret) {
    var val = str.split('.')[0];
    var res = sign(val, secret);

    return sha1(str) === sha1(res) ? str : false;
}
```

- 补充[bodyParser]
    ```js
    // 当xhr请求头Content-Type: application/x-www-form-urlencoded
    var app = require('express')();
    var bodyParser = require('bodyParser');
    app.use(bodyParser.urlencoded({extended: false}));

    // 当请求头Content-Type: application/json
    var app = require('express')();
    var bodyParser = require('bodyParser');
    app.use(bodyParser.json());
    ```
    + 4.x不再使用bodyParser 直接用express即可
    ```js
    var express = require('express');
    var app = express();
    express.use(express.json());
    express.use(express.urlencoded({extended: false}));
    ```
    + json()/urlencoded()
        * json用于file类型
        * urlencoded用于表单类型
    + extended: true/false
        * true 返回对象的[值]可以为任意类型
        * false 返回对象的[值]只能为String/Array
    ```js
    var express = require('express')
    var path = require('path')
    var bodyParser = require('body-parser')
    var app = express()
    app.use(bodyParser.urlencoded({ extended: true }))
    // -> 结果
    { 
        movie: { 
            _id: 'undefined',
            title: '电影名称11121',
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        } 
    }

    var express = require('express')
    var path = require('path')
    var bodyParser = require('body-parser')
    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    // -> 结果
    { 
        'movie[_id]': 'undefined',
        'movie[title]': '电影名称11121',
        'movie[poster]': 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    }

    ```
    
const express = require('express');
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');
const app = express();

// HOST 指目标地址
// PORT 服务端口
const { HOST = 'https://dm.aliyuncs.com/', PORT = '80' } = process.env;

// 超时时间
const TIME_OUT = 30 * 1e3;

// 设置端口
app.set('port', 3000);

// 设置超时 返回超时响应
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// 静态页面
app.use('/', express.static('static'));

// eg:将/api/test 代理到 ${HOST}/api/test
app.use(proxy('/api/test', { target: HOST }));

// 监听端口
app.listen(app.get('port'), () => {
  console.log(`server running @${app.get('port')}`);
});
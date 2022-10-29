const { createProxyMiddleware } = require('http-proxy-middleware');
//加载模块，里面引入一个createProxyMiddleware创建代理中间件，每次请求/api，代理到5000端口
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://i.maoyan.com',
      changeOrigin: true,
    })
  );
};
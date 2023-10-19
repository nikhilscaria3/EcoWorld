const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'https://eco-world-server.vercel.app', // Your backend URL
      changeOrigin: true,
      ws: true,
    })
  );
};

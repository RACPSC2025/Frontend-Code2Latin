const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api', // Match the route prefix for API calls
    createProxyMiddleware({
      //target: 'https://apicompliance.dev.sofactia.pro/amatia/', // Replace with your production API URL
      //target: 'https://ocensapre.amatialegal.com/amatia/', // Replace with your production API URL
      target: 'https://ocensacentral.dev.sofacto.info/ambiental/', // Replace with your production API URL
      changeOrigin: true
    })
  );
};

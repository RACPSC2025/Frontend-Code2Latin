const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  /* 🎭 Configuración anterior - Preservado para referencia (Migración: 05/02/2026)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://ocensacentral.dev.sofacto.info/ambiental/',
      changeOrigin: true
    })
  );
  */
  
  // ✅ Configuración Fase 5 (05/02/2026 23:30)
  // Problema identificado: Los headers no se estaban pasando correctamente
  const proxyConfig = {
    target: 'https://compliance.dev.sofacto.info',
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
    // Asegurar que los headers personalizados se pasen
    onProxyReq: (proxyReq, req, res) => {
      // Log para debugging
      console.log('[Proxy] Forwarding request to:', proxyReq.path);
      console.log('[Proxy] Headers:', req.headers);
    }
  };

  // Interceptar solo las rutas de API
  app.use('/amatia', createProxyMiddleware(proxyConfig));
};

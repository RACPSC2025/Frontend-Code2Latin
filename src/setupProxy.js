const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ✅ Configuración Fase 6 (06/02/2026) - Corrección de redirecciones infinitas
  // Estrategia: Proxy directo sin reescritura recursiva

  const proxyConfig = {
    target: 'https://compliance.dev.sofacto.info',
    changeOrigin: true, // Necesario para virtual hosted sites
    secure: true,       // Https verificado
    logLevel: 'debug',

    // Log de lo que enviamos al servidor
    onProxyReq: (proxyReq, req, res) => {
      // ⚠️ IMPORTANT: Limpiar headers "ruidosos" que pueden bloquear la petición (WAF)
      // El script verify_endpoint.js funciona sin estos headers, así que imitamos ese comportamiento
      proxyReq.removeHeader('Origin');
      proxyReq.removeHeader('Referer');
      proxyReq.removeHeader('Cookie');

      console.log('⬆️ [Proxy Request] ->', proxyReq.path);
      console.log('   Auth-Token:', req.headers['auth-token'] ? '✅ Presente' : '❌ Faltante');
      console.log('   System-Token:', req.headers['system-token'] || '❌ Faltante');
    },

    // Log de lo que el servidor nos responde
    onProxyRes: (proxyRes, req, res) => {
      console.log('⬇️ [Proxy Response] <-', proxyRes.statusCode, req.url);
    }
  };

  // Intercepta todas las rutas que comienzan con /amatia
  // IMPORTANTE: No usar pathRewrite aquí para evitar redirecciones infinitas
  app.use('/amatia', createProxyMiddleware(proxyConfig));
};

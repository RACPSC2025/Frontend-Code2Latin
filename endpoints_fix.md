# Documento de Corrección de Endpoints - Message Center

## Descripción General
Este documento detalla todos los cambios necesarios para resolver los problemas de conexión con la API de Sofactia en la aplicación Message Center. Se corrigen problemas de redirecciones infinitas, endpoints incorrectos y configuración de proxy.

## Problemas Identificados
1. **Redirecciones Infinitas**: El archivo `setupProxy.js` tenía reglas de reescritura que causaban bucles infinitos
2. **Endpoints Incorrectos**: Las rutas de los endpoints no incluían el prefijo correcto requerido por el servidor
3. **Proxy Mal Configurado**: La configuración del proxy no estaba manejando adecuadamente las rutas

## Soluciones Aplicadas

### 1. Corrección del Archivo setupProxy.js

**Ubicación:** `src/setupProxy.js`

**Antes:**
```javascript
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
```

**Después:**
```javascript
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
```

**Explicación:** Se simplificó la configuración del proxy eliminando las reglas de reescritura recursivas que causaban bucles infinitos. Ahora el proxy simplemente toma cualquier solicitud que empiece con `/amatia` y la envía directamente a `https://compliance.dev.sofacto.info`.

### 2. Corrección del Archivo fetchListTaskNewSlice.js

**Ubicación:** `src/stores/tasks/fetchListTaskNewSlice.js`

**Antes:**
```javascript
const response = await axiosInstance.post(
  'tasklist_api/list_tasks_new_complete',
  requestData
);
```

**Después:**
```javascript
// 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se ajustó la ruta según endpoints_pruebas.md
// DOCUMENTACIÓN: https://compliance.dev.sofacto.info/amatia//tasklist_api/list_tasks_new_complete
const response = await axiosInstance.post(
  '/amatia//tasklist_api/list_tasks_new_complete',
  requestData
);
```

**Explicación:** Se corrigió la ruta del endpoint para que coincida exactamente con la documentación oficial en `endpoints_pruebas.md`, incluyendo el doble slash después de `amatia`.

### 3. Corrección del Archivo fetchTaskCountsSlice.js

**Ubicación:** `src/stores/tasks/fetchTaskCountsSlice.js`

**Antes:**
```javascript
const response = await axiosInstance.post('tasklist_api/get_task_counts');
```

**Después:**
```javascript
// 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se ajustó la ruta según endpoints_pruebas.md
// DOCUMENTACIÓN: https://compliance.dev.sofacto.info/amatia/tasklist_api/get_task_counts
const response = await axiosInstance.post('/amatia/tasklist_api/get_task_counts');
```

**Explicación:** Se agregó el prefijo `/amatia` al endpoint para que coincida con la estructura de la API real.

### 4. Corrección del Archivo dashboardMessageSlice.js

**Ubicación:** `src/stores/messages/dashboardMessageSlice.js`

**Antes:**
```javascript
const response = await axiosInstance.post('tasklist_api/dashboard_message', data);
```

**Después:**
```javascript
// 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se agregó el prefijo /amatia para corregir la ruta del API
const response = await axiosInstance.post('/amatia/tasklist_api/dashboard_message', data);
```

**Explicación:** Se corrigió la ruta del endpoint agregando el prefijo `/amatia`.

### 5. Corrección del Archivo fetchMessageFormFieldsSlice.js

**Ubicación:** `src/stores/messages/fetchMessageFormFieldsSlice.js`

**Antes:**
```javascript
'tasklist_api/message_form_fields',
```

**Después:**
```javascript
'/amatia/tasklist_api/message_form_fields',
```

**Explicación:** Se corrigió la ruta del endpoint agregando el prefijo `/amatia`.

### 6. Corrección del Archivo fetchEventsListSlice.js

**Ubicación:** `src/stores/events/fetchEventsListSlice.js`

**Antes:**
```javascript
'message_center_api/events_api/dashboard_events',
```

**Después:**
```javascript
'/amatia/message_center_api/events_api/dashboard_events',
```

**Explicación:** Se corrigió la ruta del endpoint agregando el prefijo `/amatia`.

### 7. Corrección del Archivo fetchLegalCountsSlice.js

**Ubicación:** `src/stores/legal/fetchLegalCountsSlice.js`

**Antes:**
```javascript
const response = await axiosInstance.get(`/message_center_api/legal_api/get_legal_counts`);
```

**Después:**
```javascript
// 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se agregó el prefijo /amatia para corregir la ruta del API
const response = await axiosInstance.get(`/amatia/message_center_api/legal_api/get_legal_counts`);
```

**Explicación:** Se corrigió la ruta del endpoint agregando el prefijo `/amatia`.

### 8. Corrección del Archivo fetchListTaskNewSlice.js (para la ruta legal)

**Ubicación:** `src/stores/tasks/fetchListTaskNewSlice.js`

**Antes:**
```javascript
const response = await axiosInstance.get(`/message_center_api/legal_api/get_active_countries`);
```

**Después:**
```javascript
// 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se agregó el prefijo /amatia para corregir la ruta del API
const response = await axiosInstance.get(`/amatia/message_center_api/legal_api/get_active_countries`);
```

**Explicación:** Se corrigió la ruta del endpoint agregando el prefijo `/amatia`.

## Archivos que Requieren Corrección Adicional

Además de los archivos ya corregidos, hay otros archivos que también necesitan correcciones similares. Aquí está la lista de endpoints que necesitan el prefijo `/amatia`:

### Archivos en src/stores/tasks/
- `updateTaskDetialsSlice.js` - Endpoint: `/tasklist_api/update_task_basic_details`
- `updateResponsiblesSlice.js` - Endpoint: `/tasklist_api/update_responsabels`
- `updateLogtaskDetailsSlice.js` - Endpoint: `/tasklist_api/update_logtask_details`
- `saveTaskSlice.js` - Endpoint: `/tasklist_api/taskcreate_api/save_task`
- `getSubProgramsSlice.js` - Endpoint: `/tasklist_api/get_sub_programs`
- `getSettingsSlice.js` - Endpoint: `/tasklist_api/get_settings`
- `getResponsiblesSlice.js` - Endpoint: `/tasklist_api/get_responsabels`
- `getProgramsSlice.js` - Endpoint: `/tasklist_api/get_programs`
- `getPositionUserListSlice.js` - Endpoint: `/tasklist_api/get_position_user_list`
- `getLogtaskDetailsSlice.js` - Endpoint: `/tasklist_api/get_logtask_details`
- `getLogtaskCommentsSlice.js` - Endpoint: `/tasklist_api/get_logtask_comments/{logtask_id}`
- `fetchTaskTagsSlice.js` - Endpoint: `/tasklist_api/list_tags`
- `fetchTaskListStatusSlice.js` - Endpoint: `/tasklist_api/list_task_status`
- `fetchtaskListLevelSlice.js` - Endpoint: `/tasklist_api/{levelUrl}`
- `fetchSubPhasesSlice.js` - Endpoint: `/tasklist_api/get_subfases`
- `fetchProyectoAmbientalSlice.js` - Endpoint: `/tasklist_api/list_proyecto`
- `fetchProgramAmbientalSlice.js` - Endpoint: `/tasklist_api/list_programa_ambiental`
- `fetchPMASListSlice.js` - Endpoint: `/tasklist_api/list_pmas`
- `fetchPhasesSlice.js` - Endpoint: `/tasklist_api/list_fases`
- `fetchLogtaskListSlice.js` - Endpoint: `/tasklist_api/list_logtasks/{task_id}`
- `fetchListLevelExecutorSlice.js` - Endpoint: `/tasklist_api/list_level_ejecutor`
- `fetchConvenioListSlice.js` - Endpoint: `/tasklist_api/list_convineo`
- `fetchContractorListSlice.js` - Endpoint: `/tasklist_api/list_contractor`
- `fetchAlertListSlice.js` - Endpoint: `/tasklist_api/list_alerta`
- `fetchAdministratorsListSlice.js` - Endpoint: `/tasklist_api/list_administradores`
- `deleteLogtaskSlice.js` - Endpoint: `/tasklist_api/delete_logtask`

### Archivos en src/stores/messages/
- `updateMessageSlice.js` - Endpoint: `/tasklist_api/update_message`
- `submitMessageDataSlice.js` - Endpoint: `/tasklist_api/message_form_data_submit`
- `fetchDashboardMessageStatisticsSlice.js` - Endpoint: `/tasklist_api/dashboard_message_statistics`
- `fetchDashboardMessageDetailsSlice.js` - Endpoint: `/tasklist_api/dashboard_message_detail`

### Archivos en src/stores/legal/
- `getLegalTreeSlice.js` - Endpoint: `/tasklist_api/get_legal_tree`
- `fetchSubGeovisorSlice.js` - Endpoint: `/tasklist_api/get_sub_geovisor`
- `fetchListGeovisorSlice.js` - Endpoint: `/tasklist_api/list_geovisor`
- `fetchLegalListStatusSlice.js` - Endpoint: `/message_center_api/legal_api/list_legal_status`
- `fetchArticleListTypeRuleSlice.js` - Endpoint: `/message_center_api/legal_api/list_noram_tipo_requisito`

### Archivos en src/stores/actions/
- `uploadCommentAttachmentsSlice.js` - Endpoint: `/tasklist_api/upload_comment_attachments`

### Archivos en src/stores/globalDataSlice.js
- Varios endpoints que usan `/tasklist_api/`

## Instrucciones para Aplicar las Correcciones

1. **Reiniciar el Servidor**: Después de aplicar los cambios, detener el servidor actual (Ctrl+C) y reiniciarlo con `npm start`

2. **Verificar la Consola**: Confirmar que ya no hay errores de redirección infinita ni errores 404 en los endpoints principales

3. **Probar Funcionalidad**: Verificar que los datos se carguen correctamente desde la API real

## Resultados Esperados

Después de aplicar estas correcciones:
- Las solicitudes a la API de Sofactia deberían retornar status 200
- Ya no debería haber errores de redirección infinita
- La aplicación debería recibir datos reales de la API (como las 224 tareas que se recibieron correctamente)
- El dashboard de TasksListView debería mostrar datos reales en lugar de datos mock

## Notas Importantes

- El doble slash (`//`) en algunas rutas es intencional según la documentación oficial
- Todos los endpoints deben incluir el prefijo `/amatia` para funcionar correctamente con el servidor de producción
- La configuración del proxy debe mantenerse simple para evitar problemas de redirección
- Es importante seguir la documentación en `endpoints_pruebas.md` para garantizar la compatibilidad con la API real

# 🚀 Frontend Template

Este es el template base oficial del equipo. Configurado con **React 19**, **Vite** y un flujo de trabajo basado en **pnpm** para garantizar un rendimiento óptimo y una arquitectura escalable.

## 🛠 Tech Stack Principal

* **Core:** [React 19](https://react.dev/) & [Vite 7](https://vitejs.dev/).
* **Gestión de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/).
* **Routing:** [React Router 7](https://reactrouter.com/).
* **Validación y Formularios:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) (usando `@hookform/resolvers`).
* **Internacionalización:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/).
* **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) con integración nativa para Vite.
* **Cliente HTTP:** [Axios](https://axios-http.com/).
* **Iconos:** [React Icons](https://react-icons.github.io/react-icons/).

## 📚 Librerías Utilizadas y su Propósito

### Dependencias Principales

* **React 19 & React DOM:** Biblioteca principal para construir interfaces de usuario interactivas y componentes reutilizables.
* **React Router DOM:** Sistema de enrutamiento declarativo para aplicaciones React que permite la navegación entre diferentes vistas.
* **Redux Toolkit:** Conjunto de herramientas oficial para administrar el estado global de la aplicación de manera eficiente.
* **React Redux:** Biblioteca de enlace que conecta React con Redux para acceder al estado global en componentes.
* **Zod:** Biblioteca de validación de esquemas en tiempo de ejecución que permite validar tipos de datos y formularios.
* **React Hook Form:** Biblioteca para gestión de formularios con validación, manipulación de entradas y manejo de errores.
* **@hookform/resolvers:** Integración de React Hook Form con bibliotecas de validación como Zod.
* **Axios:** Cliente HTTP basado en promesas para realizar solicitudes a APIs externas y servicios backend.
* **i18next & react-i18next:** Sistema completo de internacionalización para soportar múltiples idiomas en la aplicación.
* **React Icons & Lucide React:** Colecciones de iconos listos para usar como componentes React.
* **@emotion/react & @emotion/styled:** Bibliotecas para estilado con CSS-in-JS que permiten estilos dinámicos y basados en props.
* **@mui/material:** Biblioteca de componentes de Material Design para construir interfaces consistentes y accesibles.
* **@fontsource/roboto:** Fuente Roboto disponible como paquete npm para uso sin CDN.
* **motion:** Biblioteca de animación basada en Framer Motion para crear interfaces dinámicas y fluidas.

### Dependencias de Desarrollo

* **Vite:** Herramienta de construcción rápida con recarga instantánea para desarrollo moderno de JavaScript.
* **@vitejs/plugin-react:** Plugin para Vite que habilita el soporte de React con Fast Refresh.
* **Tailwind CSS:** Framework de CSS utilitario para construir diseños personalizados rápidamente.
* **@tailwindcss/vite:** Integración nativa de Tailwind CSS con Vite para compilación más rápida.
* **ESLint:** Linter para encontrar y corregir problemas en el código JavaScript/React.
* **Prettier:** Formateador de código para mantener un estilo consistente en todo el proyecto.
* **Husky:** Herramienta para ejecutar scripts de Git hooks y mantener la calidad del código.
* **lint-staged:** Ejecuta linters en archivos Git staged antes de cada commit.
* **Testing Library:** Conjunto de utilidades para probar componentes de React de forma accesible.
* **Jest:** Framework de pruebas para JavaScript con funciones de aserción, simulación y cobertura.
* **@types/react & @types/react-dom:** Tipos de TypeScript para React (útiles incluso sin usar TS).
* **FullCalendar:** Bibliotecas para integrar calendarios interactivos con soporte para eventos y programación (daygrid, interaction, react).
* **PDF.js:** Biblioteca para renderizar documentos PDF directamente en el navegador.

## 📂 Arquitectura de Carpetas

Basado en la estructura del proyecto:

* `src/api/`: Configuración y clientes de servicios externos (Axios).
* `src/components/`: Componentes de UI reutilizables y atómicos.
* `src/features/`: Módulos basados en dominio (lógica de negocio específica).
* `src/providers/`: Wrappers de contexto global (Redux, I18n, Router).
* `src/schemas/`: Esquemas de validación **Zod** para formularios y APIs.
* `src/services/`: Definición de endpoints y lógica de fetching.
* `src/utils/`: Helpers, formateadores y funciones puras.

## 🚀 Comandos del Proyecto

Este proyecto utiliza **pnpm**. Por favor, no uses `npm` o `yarn` para evitar conflictos en el lockfile.

| Acción | Comando |
| --- | --- |
| **Instalar dependencias** | `pnpm install` |
| **Desarrollo** | `pnpm dev` |
| **Build de producción** | `pnpm build` |
| **Verificar Linting** | `pnpm lint-check` |
| **Corregir Linting** | `pnpm lint-fix` |
| **Formatear código** | `pnpm prettier-fix` |
| **Previsualizar Build** | `pnpm preview` |

## 📚 Instalación de Librerías

Lista de comandos para instalar las dependencias del proyecto:

### Dependencias principales
```bash
npm install -g pnpm@latest-10
pnpm create vite@latest frontend
pnpm install react-router-dom @reduxjs/toolkit react-redux zod react-hookform @hookform/resolvers axios i18next react-i18next react-icons
```

### Dependencias de desarrollo
```bash
pnpm add -D tailwindcss @tailwindcss/vite prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react-hooks eslint-plugin-react husky lint-staged
```

### Herramientas de testing
```bash
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## 🧪 Testing

El proyecto incluye un conjunto completo de herramientas para pruebas unitarias e integración:

- **Jest**: Framework de pruebas que proporciona funciones de aserción, simulación y cobertura de código
- **jest-environment-jsdom**: Entorno de pruebas que simula un navegador para pruebas de componentes
- **@testing-library/react**: Utilidades para probar componentes de React de forma accesible
- **@testing-library/jest-dom**: Extensiones de aserción para verificar el estado del DOM
- **@testing-library/user-event**: Simula eventos de usuario reales para pruebas más precisas

## 🛡️ Calidad de Código y Git Hooks

Hemos configurado un flujo de trabajo estricto para asegurar la calidad antes de cada commit:

1. **Husky:** Gestiona los Git Hooks automáticamente.
2. **Lint-staged:** Al realizar un `git commit`, solo se analizan y corrigen los archivos modificados.
   * Archivos `.js` y `.jsx`: Ejecutan `eslint --fix` y `prettier --write`.
   * Archivos `.json`, `.css` y `.md`: Ejecutan `prettier --write`.

### Configuración inicial de Git Hooks

Para que los hooks de Git funcionen correctamente, después de clonar el repositorio por primera vez, debes ejecutar:

```bash
pnpm husky-prepare
```

Este comando prepara Husky para gestionar los hooks de Git. Si recibes un error de permisos en sistemas Unix/Linux/Mac, puede que necesites hacer ejecutable el directorio de Husky:

```bash
chmod +x .husky/*
```

## 🌐 Internacionalización (i18n)

El sistema ya incluye `i18next` para el manejo de múltiples idiomas. Los archivos de traducción deben ubicarse preferiblemente en `src/assets/locales/` (o según la configuración definida en el provider de i18n).

## 📝 Notas Adicionales

* **Configuración de ESLint:** Utilizamos la versión 9 con soporte para React, React Hooks y Prettier.
* **Tailwind:** Se utiliza `@tailwindcss/vite` para una compilación más rápida en el entorno de desarrollo.

Para que tu equipo trabaje con estándares de alta calidad, el **README.md** debe actuar como una "Constitución". Aquí tienes las secciones clave diseñadas específicamente para tu stack (React 19, Redux, Tailwind 4) que ayudarán a mantener el código limpio y profesional.

---

## 💎 Guía de Desarrollo y Buenas Prácticas

### 1. Estructura de un "Feature" (Módulo)

Para mantener el código mantenible, cada nueva funcionalidad en `src/features/` debe seguir esta estructura interna:

* **`components/`**: Componentes exclusivos de esta funcionalidad.
* **`hooks/`**: Lógica de React específica del módulo.
* **`services/`**: Definición de endpoints (RTK Query o Axios).
* **`index.js`**: El "punto de entrada" del módulo para evitar importaciones profundas.

### 2. Principios de Clean Code

* **Componentes Pequeños**: Si un componente supera las 150 líneas, es momento de dividirlo en subcomponentes más pequeños.
* **Desacoplamiento de Lógica**: Usa la carpeta `hooks/` para extraer la lógica pesada del JSX. El componente solo debe encargarse de la interfaz.
* **Single Source of Truth**: Las validaciones se definen **una sola vez** en `src/schemas/` usando **Zod** y se consumen tanto en formularios como en respuestas de API.

### 3. Mejores Herramientas Integradas

Este template ya incluye herramientas de nivel élite que el equipo debe aprovechar:

* **Tailwind CSS 4**: Utiliza el plugin nativo de Vite para compilaciones instantáneas.
* **React Hook Form**: Minimiza las re-renderizaciones de los formularios.
* **i18next**: Toda cadena de texto visible al usuario debe estar en los archivos de traducción, nunca "hardcoded" en el JSX.
* **Lucide Icons / React Icons**: Mantén una estética consistente usando una sola librería de iconos.

### 4. Flujo de Git y Automatización

* **Validación Pre-Commit**: No se puede subir código que rompa las reglas de estilo.
* **Linting Estricto**: Ejecuta `pnpm lint-fix` antes de abrir un Pull Request para asegurar que el código cumple con las reglas de ESLint 9.
* **Formateo Automático**: Gracias a **Prettier** y **Husky**, el código siempre se verá igual sin importar quién lo escriba.

---

## 🛠 Guía de Implementación Rápida

### ¿Cómo crear una validación profesional?

1. Crea el esquema en `src/schemas/mi-modulo.schema.js` usando **Zod**.
2. Importa el esquema en tu componente y conéctalo a **React Hook Form** usando el `zodResolver`.
3. Usa el componente base `Input` que creamos para mostrar errores automáticamente.

### ¿Cómo manejar el estado global?

1. Define tu logic de estado en `src/store/slices/`.
2. Si es una petición a servidor, usa **RTK Query** en `src/services/` para aprovechar el caché automático.

---
Para que tu template sea verdaderamente "de élite", aquí tienes las secciones definitivas para el **README.md** (o tu archivo `guia_equipo.md`) que elevarán el estándar del equipo. Estas guías están alineadas con las librerías que ya tienes instaladas como **React 19**, **Redux Toolkit**, **Zod** y **Tailwind 4**.

---

## 🛠️ Configuración de VS Code (Recomendado)

Para que todos vean el código igual y las herramientas funcionen al 100%, asegúrense de tener estas extensiones:

* **ESLint & Prettier**: Para validación y formato automático.
* **Tailwind CSS IntelliSense**: Autocompletado de clases de Tailwind 4.
* **Console Ninja**: Para ver los `console.log` directamente en el editor.

---

## 🧼 Reglas de Clean Code para el Equipo

1. **Componentes Funcionales**: Usar siempre funciones de flecha (`const MyComponent = () => ...`).
2. **Prop Drilling**: Si necesitas pasar datos a más de 2 niveles de profundidad, usa **Redux Toolkit** o un **Provider**.
3. **Destructuración**: Siempre destructurar props y estados para mayor claridad.
4. **Funciones de Ayuda**: Cualquier lógica de cálculo o transformación de datos debe ir en `src/utils/`. No satures el componente.

---

## 🚨 Guía de Manejo de Errores y Validaciones

En este proyecto, **Zod** es nuestra muralla de seguridad:

* **Formularios**: Todo formulario debe tener un esquema en `src/schemas/`.
* **Tipado Dinámico**: Aunque no usamos TypeScript por requerimiento del cliente, usamos `z.infer` en los esquemas para documentar la forma de los datos.
* **Validación de API**: Al recibir datos de **Axios**, opcionalmente usamos `.safeParse()` de Zod para asegurar que el backend no envíe datos corruptos que rompan la UI.

---

## 🚀 Buenas Prácticas con React 19 y Redux

* **Hooks sobre Clases**: Uso exclusivo de Hooks (`useState`, `useEffect`, `useMemo`).
* **Acciones Descriptivas**: En Redux, los nombres de las acciones deben ser legibles, ej: `user/loginSuccess`.
* **Cero Lógica en JSX**: El bloque `return` debe ser lo más limpio posible. Si tienes condicionales complejos, prepáralos en variables antes del `return`.
* **Internacionalización**: No escribir texto directo. Usar siempre el hook `useTranslation` de `react-i18next` para mantener el soporte multi-idioma.

---

## 🏁 Checkpoint de Calidad (Antes de un Pull Request)

Antes de enviar código, el desarrollador debe confirmar:

1. [ ] ¿He ejecutado `pnpm lint-fix` y no hay errores?
2. [ ] ¿He verificado que los mensajes de commit sigan el estándar de **Husky**?
3. [ ] ¿Los nuevos esquemas de validación están en la carpeta `src/schemas/`?
4. [ ] ¿He actualizado las traducciones en `i18n` si añadí texto nuevo?

---
Para cerrar con broche de oro, aquí tienes una guía de **"Refactorización y Código Limpio"** que puedes incluir en tu `guia_equipo.md`. Esta sección es vital porque enseña visualmente la diferencia entre un código "que funciona" y un código "profesional" siguiendo tu stack técnico.

---

## 🧼 Antes vs. Después: La mentalidad del Template

### ❌ El Código "Sucio" (Lo que debemos evitar)

Este componente mezcla lógica de validación, llamadas a API, estado local y estilos desordenados en un solo archivo.

```jsx
// Malo: Todo mezclado, difícil de testear y reutilizar
const UserForm = () => {
  const [data, setData] = useState({ name: '' });
  const [error, setError] = useState('');

  const save = async () => {
    if (data.name.length < 3) return setError('Muy corto');
    await axios.post('/users', data);
    alert('Guardado');
  };

  return (
    <div style={{padding: '20px'}}>
      <input onChange={e => setData({name: e.target.value})} />
      {error && <span>{error}</span>}
      <button onClick={save}>Enviar</button>
    </div>
  );
};

```

### ✅ El Código "Limpio" (Uso correcto del Template)

Dividimos las responsabilidades usando **Zod**, **React Hook Form**, **RTK Query** y tus componentes base.

1. **Esquema (en `src/schemas/user.schema.js`):**
```javascript
import { z } from 'zod';
export const userSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

```


2. **Componente Refactorizado (en `src/features/users/UserForm.jsx`):**
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddUserMutation } from '@/services/userApi'; // RTK Query
import { userSchema } from '@/schemas/user.schema';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export const UserForm = () => {
  const [addUser, { isLoading }] = useAddUserMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = async (data) => {
    try {
      await addUser(data).unwrap();
      toast.success("Usuario creado correctamente");
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <Input 
        label="Nombre Completo"
        error={errors.name?.message}
        {...register('name')} 
      />
      <button disabled={isLoading} className="btn-primary">
        {isLoading ? 'Guardando...' : 'Enviar'}
      </button>
    </form>
  );
};

```



---

## 💪 Fortalezas del Diseño del Template

### Ventajas de usar pnpm

* **Eficiencia de espacio en disco:** pnpm crea un almacenamiento de dependencias único y enlaces simbólicos, reduciendo significativamente el espacio ocupado por node_modules.
* **Velocidad de instalación:** Debido a su sistema de enlaces, pnpm instala dependencias mucho más rápido que npm o yarn.
* **Consistencia del árbol de dependencias:** Garantiza que todas las dependencias tengan la misma versión en todo el proyecto, evitando inconsistencias.
* **Soporte para monorepos:** Ideal para proyectos grandes o cuando se planea escalar a múltiples paquetes.

### Ventajas de usar Vite

* **Tiempo de inicio extremadamente rápido:** Vite sirve módulos sobre la marcha mediante ESM, eliminando la necesidad de empaquetar toda la aplicación al inicio.
* **Hot Module Replacement (HMR) instantáneo:** Las actualizaciones en el navegador ocurren casi al instante, mejorando la experiencia de desarrollo.
* **Compilación rápida en producción:** Aprovecha Rollup para builds optimizados y ligeros.
* **Soporte nativo para TypeScript y JSX:** Configuración lista para usar con React y otros frameworks modernos.
* **Arquitectura modular:** Permite extender funcionalidades con plugins fácilmente.

### Ventajas de usar Zod con React Hook Form

* **Validación de tipo en tiempo de ejecución y compilación:** Combina la seguridad de tipos de TypeScript con validación en tiempo de ejecución.
* **Integración perfecta con React Hook Form:** A través de `@hookform/resolvers`, permite una validación centralizada y coherente.
* **Esquemas reutilizables:** Los esquemas de Zod pueden usarse tanto en el frontend como para validar datos entrantes del backend.
* **Mensajes de error claros y personalizables:** Facilita la creación de experiencias de usuario con retroalimentación precisa.
* **Seguridad mejorada:** Al validar los datos en el cliente, se previenen envíos incorrectos al servidor.
* **Documentación implícita:** Los esquemas actúan como documentación viva de la estructura de datos esperada.

### Beneficios combinados de este stack

* **Productividad del desarrollador:** El conjunto de herramientas permite un ciclo de desarrollo rápido y eficiente.
* **Mantenibilidad del código:** La separación de responsabilidades y las validaciones claras facilitan la evolución del proyecto.
* **Rendimiento óptimo:** Tanto en desarrollo (con Vite) como en producción (con builds optimizados).
* **Escalabilidad:** La arquitectura está diseñada para crecer desde proyectos pequeños hasta aplicaciones empresariales.

---

## 🏆 Resumen de Beneficios para el Cliente

Si el cliente pregunta por qué este enfoque es mejor (a pesar de no usar TypeScript), puedes argumentar:

* **Mantenibilidad**: Si la regla del nombre cambia de 3 a 5 caracteres, solo se toca el archivo `.schema.js`.
* **Rendimiento**: Gracias a **Vite 7** y **pnpm**, el proyecto carga y se instala en segundos.
* **Cero Errores de Formato**: Con **Husky** y **lint-staged**, es imposible que un desarrollador suba código mal formateado al repositorio.
* **Escalabilidad**: El uso de **Redux Toolkit** asegura que el estado de la app no se convierta en un caos a medida que el proyecto crece.

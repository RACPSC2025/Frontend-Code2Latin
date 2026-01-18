# 🚀 Frontend Template - Sofactia

Este es el template base oficial del equipo Sofactia. Configurado con **React 19**, **Vite** y un flujo de trabajo basado en **pnpm** para garantizar un rendimiento óptimo y una arquitectura escalable.

## 🛠 Tech Stack Principal

* **Core:** [React 19](https://react.dev/) & [Vite 7](https://vitejs.dev/).
* **Gestión de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/).
* **Routing:** [React Router 7](https://reactrouter.com/).
* **Validación y Formularios:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) (usando `@hookform/resolvers`).
* **Internacionalización:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/).
* **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) con integración nativa para Vite.
* **Cliente HTTP:** [Axios](https://axios-http.com/).
* **Iconos:** [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/).
* **UI Components:** [Material UI (MUI)](https://mui.com/) & [Emotion](https://emotion.sh/).
* **Animaciones:** [Motion](https://motion.dev/).

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

Basado en la estructura del proyecto y siguiendo el patrón Feature-Sliced Design (FSD):

```
src/
├── app/
│   ├── providers/
│   ├── layouts/
│   ├── pages/
│   └── index.js
├── entities/
│   ├── User/
│   ├── Product/
│   └── ...
├── features/
│   ├── Auth/
│   ├── UserProfile/
│   └── ...
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── ui/
│   ├── utils/
│   └── config/
├── widgets/
│   ├── Header/
│   ├── Sidebar/
│   └── ...
├── services/
│   ├── api/
│   ├── auth/
│   └── storage/
├── store/
│   ├── slices/
│   └── index.js
├── routes/
├── constants/
└── types/
```

### Descripción de Carpetas

- **app/**: Configuración principal de la aplicación, layouts comunes, y punto de entrada
- **entities/**: Entidades del dominio con su lógica de negocio (User, Product, Order, etc.)
- **features/**: Características específicas de la aplicación (Auth, UserProfile, etc.)
- **shared/**: Código reutilizable a través de toda la aplicación
- **widgets/**: Componentes de interfaz reutilizables que no pertenecen a una entidad específica
- **services/**: Lógica de comunicación con servicios externos
- **store/**: Configuración de Redux Toolkit
- **routes/**: Definición de rutas de la aplicación
- **constants/**: Constantes globales
- **types/**: Definiciones de tipos (JSDoc en lugar de TypeScript)

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

## 📝 Convenciones de Código

### Nomenclatura

- **Archivos**: camelCase para componentes funcionales, PascalCase para archivos que exportan clases
- **Componentes**: PascalCase
- **Funciones y variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Archivos CSS**: lowercase-with-dashes.module.css

### Estilo de Código

- Máximo 100 caracteres por línea
- Indentación con 2 espacios
- Usar siempre punto y coma
- Usar comillas simples para cadenas
- Usar arrow functions para componentes funcionales
- Evitar declaración de funciones tradicionales para componentes

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

## 💎 Guía de Desarrollo y Buenas Prácticas

### 1. Componentes Funcionales

```javascript
// ✅ Correcto
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', onClick }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
};

export default Button;
```

### 2. Separación de Presentación y Lógica

```javascript
// ✅ Componente contenedor (Container)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../components/UserList';
import { fetchUsers } from '../store/usersSlice';

const UserListContainer = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <UserList
      users={users}
      loading={loading}
      error={error}
    />
  );
};

export default UserListContainer;

// ✅ Componente de presentación (Component)
import React from 'react';

const UserList = ({ users, loading, error }) => {
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default UserList;
```

### 3. React.memo y useMemo

```javascript
// ✅ Usar React.memo para componentes que rara vez cambian
import React, { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ items, filter }) => {
  // Cálculo costoso optimizado con useMemo
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

export default ExpensiveComponent;
```

### 4. Lazy Loading y Suspense

```javascript
// ✅ Lazy loading para rutas
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<div>Cargando...</div>}>
          <HomePage />
        </Suspense>
      }
    />
    <Route
      path="/about"
      element={
        <Suspense fallback={<div>Cargando...</div>}>
          <AboutPage />
        </Suspense>
      }
    />
    <Route
      path="/dashboard"
      element={
        <Suspense fallback={<div>Cargando...</div>}>
          <DashboardPage />
        </Suspense>
      }
    />
  </Routes>
);

export default AppRoutes;
```

### 5. Manejo de Estado con Redux Toolkit

```javascript
// ✅ Slice de Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk asíncrono
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.items.push(action.payload);
    },
    removeUser: (state, action) => {
      state.items = state.items.filter(user => user.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;
```

### 6. Formularios con React Hook Form y Zod

```javascript
// ✅ Formulario con React Hook Form y Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debes ser mayor de edad').max(120, 'Edad inválida'),
});

const UserForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const onSubmitHandler = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="age">Edad</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className={errors.age ? 'border-red-500' : ''}
        />
        {errors.age && <span className="text-red-500">{errors.age.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default UserForm;
```

### 7. Servicios de API con Axios

```javascript
// ✅ Servicio de API centralizado
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar sesión expirada
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 8. Componentes con Material UI y Emotion

```javascript
// ✅ Componente con MUI y Emotion
import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@emotion/react';

const StyledCard = styled(Card)`
  margin: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const MuiCard = ({ title, content, onClick }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        <StyledButton 
          variant="contained" 
          color="primary" 
          onClick={onClick}
        >
          Acción
        </StyledButton>
      </CardContent>
    </StyledCard>
  );
};

export default MuiCard;
```

### 9. Animaciones con Motion

```javascript
// ✅ Componente con animaciones
import React from 'react';
import { motion } from 'motion';

const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
```

## 🏗️ Patrones Comunes en Aplicaciones de Producción

### 1. Patrón Container/Component
```javascript
// ✅ Container: Maneja la lógica de estado y efectos
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import ProductsList from '../components/ProductsList';

const ProductsContainer = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <ProductsList
      products={products}
      loading={loading}
      error={error}
    />
  );
};

export default ProductsContainer;
```

### 2. Custom Hooks
```javascript
// ✅ Custom hook para manejo de estado local
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

## 🚨 Guía de Manejo de Errores y Validaciones

En este proyecto, **Zod** es nuestra muralla de seguridad:

* **Formularios**: Todo formulario debe tener un esquema en `src/schemas/`.
* **Tipado Dinámico**: Aunque no usamos TypeScript por requerimiento del cliente, usamos `z.infer` en los esquemas para documentar la forma de los datos.
* **Validación de API**: Al recibir datos de **Axios**, opcionalmente usamos `.safeParse()` de Zod para asegurar que el backend no envíe datos corruptos que rompan la UI.

## 🏁 Checkpoint de Calidad (Antes de un Pull Request)

Antes de enviar código, el desarrollador debe confirmar:

1. [ ] ¿He ejecutado `pnpm lint-fix` y no hay errores?
2. [ ] ¿He verificado que los mensajes de commit sigan el estándar de **Husky**?
3. [ ] ¿Los nuevos esquemas de validación están en la carpeta `src/schemas/`?
4. [ ] ¿He actualizado las traducciones en `i18n` si añadí texto nuevo?
5. [ ] ¿He probado el componente en diferentes tamaños de pantalla?
6. [ ] ¿He agregado pruebas unitarias para la nueva funcionalidad?

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

## 🏆 Resumen de Beneficios para el Cliente

Si el cliente pregunta por qué este enfoque es mejor (a pesar de no usar TypeScript), puedes argumentar:

* **Mantenibilidad**: Si la regla del nombre cambia de 3 a 5 caracteres, solo se toca el archivo `.schema.js`.
* **Rendimiento**: Gracias a **Vite 7** y **pnpm**, el proyecto carga y se instala en segundos.
* **Cero Errores de Formato**: Con **Husky** y **lint-staged**, es imposible que un desarrollador suba código mal formateado al repositorio.
* **Escalabilidad**: El uso de **Redux Toolkit** asegura que el estado de la app no se convierta en un caos a medida que el proyecto crece.
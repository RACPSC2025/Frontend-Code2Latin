# Guía de Buenas Prácticas para Desarrollo con React

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Convenciones de Código](#convenciones-de-código)
4. [Buenas Prácticas de Componentes](#buenas-prácticas-de-componentes)
5. [Manejo de Estado](#manejo-de-estado)
6. [Gestión de API y Datos](#gestión-de-api-y-datos)
7. [Rutas y Navegación](#rutas-y-navegación)
8. [Formularios](#formularios)
9. [Estilos y Diseño](#estilos-y-diseño)
10. [Testing](#testing)
11. [Seguridad](#seguridad)
12. [Optimización de Rendimiento](#optimización-de-rendimiento)
13. [Documentación](#documentación)
14. [Git y Control de Versiones](#git-y-control-de-versiones)

## Introducción

Esta guía establece las buenas prácticas y convenciones para el desarrollo de aplicaciones React en nuestro equipo. Su objetivo es mantener la consistencia, mejorar la calidad del código y facilitar la colaboración entre los desarrolladores.

## Estructura de Carpetas

Nuestra estructura de carpetas sigue el patrón Feature-Sliced Design (FSD) combinado con convenciones de React:

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

## Convenciones de Código

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

## Buenas Prácticas de Componentes

### Componentes Funcionales

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

### Separación de Presentación y Lógica

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

### React.memo y useMemo

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

### Lazy Loading y Suspense

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

## Manejo de Estado

### Redux Toolkit

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

### Custom Hooks

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

// ✅ Custom hook para efectos asíncronos
import { useState, useEffect } from 'react';

export const useAsyncEffect = (asyncFunction, deps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const executeAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction();

        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    executeAsync();

    return () => {
      isCancelled = true;
    };
  }, deps);

  return { data, loading, error };
};
```

## Gestión de API y Datos

### React Query (TanStack Query)

```javascript
// ✅ Configuración de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
    },
  },
});

const AppProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default AppProviders;

// ✅ Uso de React Query para fetching de datos
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
    staleTime: 60 * 1000, // 1 minuto
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => api.post('/users', userData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### Servicios de API

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

## Rutas y Navegación

### Configuración de Rutas

```javascript
// ✅ Archivo src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../app/layouts/Layout';

const HomePage = lazy(() => import('../app/pages/HomePage'));
const LoginPage = lazy(() => import('../app/pages/LoginPage'));
const DashboardPage = lazy(() => import('../app/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('../app/pages/NotFoundPage'));

const AppRoutes = () => (
  <Layout>
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </Layout>
);

export default AppRoutes;

// ✅ Ruta protegida
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

## Formularios

### React Hook Form con Validación

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

## Estilos y Diseño

### Convenciones de Estilos con Tailwind CSS

```javascript
// ✅ Componente con estilos de Tailwind
import React from 'react';

const Card = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'rounded-lg shadow-md border border-gray-200 bg-white';
  const variantClasses = {
    default: 'p-6',
    compact: 'p-4',
    featured: 'p-8 border-2 border-blue-500',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// ✅ Componente con módulos CSS
import React from 'react';
import styles from './Button.module.css';

const StyledButton = ({ children, variant = 'primary' }) => {
  const buttonClass = `${styles.button} ${styles[variant]}`;

  return (
    <button className={buttonClass}>
      {children}
    </button>
  );
};

export default StyledButton;
```

## Testing

### Convenciones de Testing

```javascript
// ✅ Ejemplo de test con React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../store';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = setupStore();
  });

  it('should render login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

## Seguridad

### Buenas Prácticas de Seguridad

1. **Sanitización de Entradas**: Siempre sanitizar entradas de usuario antes de procesarlas
2. **XSS Prevention**: Usar dangerouslySetInnerHTML con precaución y sanitizar contenido
3. **Autenticación**: Implementar tokens JWT con refresh tokens
4. **Headers de Seguridad**: Configurar headers de seguridad en el servidor

```javascript
// ✅ Ejemplo de sanitización de contenido
import DOMPurify from 'dompurify';

const SafeHTMLDisplay = ({ htmlContent }) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
};
```

## Optimización de Rendimiento

### Técnicas de Optimización

1. **Code Splitting**: Dividir el código en chunks más pequeños
2. **Memoización**: Usar React.memo, useMemo y useCallback apropiadamente
3. **Virtualización**: Para listas largas, usar react-window o react-virtualized
4. **Imágenes**: Usar lazy loading y formatos modernos (WebP, AVIF)

```javascript
// ✅ Virtualización para listas largas
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style, data }) => (
  <div style={style}>
    {data[index]}
  </div>
);

const VirtualizedList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
    width="100%"
  >
    {Row}
  </List>
);
```

## Documentación

### JSDoc para Tipado en JS

```javascript
/**
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre completo del usuario
 * @property {string} email - Dirección de correo electrónico
 * @property {Date} createdAt - Fecha de creación del usuario
 */

/**
 * @typedef {Object} UserFormData
 * @property {string} name - Nombre del usuario (requerido)
 * @property {string} email - Email del usuario (requerido)
 * @property {number} age - Edad del usuario (requerido, mínimo 18)
 */

/**
 * Componente para mostrar información de usuario
 * @param {Object} props - Props del componente
 * @param {User} props.user - Información del usuario a mostrar
 * @param {boolean} [props.showEmail=true] - Mostrar email del usuario
 * @returns {JSX.Element} Elemento JSX del componente
 */
const UserCard = ({ user, showEmail = true }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
      <p>Creado: {user.createdAt.toLocaleDateString()}</p>
    </div>
  );
};

export default UserCard;
```

## Casos Reales y Ejemplos de Producción

### Ejemplo Completo de Componente con Buenas Prácticas

```javascript
// ✅ Componente completo siguiendo buenas prácticas
import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { updateUserProfile } from '../store/userSlice';

// Definición del esquema de validación
const userProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().max(500, 'La biografía no debe exceder los 500 caracteres').optional(),
});

// Tipos para JSDoc
/**
 * @typedef {z.infer<typeof userProfileSchema>} UserProfileFormData
 */

/**
 * Componente para editar el perfil de usuario
 * @param {Object} props
 * @param {UserProfileFormData} props.initialData - Datos iniciales del perfil
 * @param {Function} props.onUpdate - Callback cuando se actualiza el perfil
 * @returns {JSX.Element}
 */
const UserProfileEdit = ({ initialData, onUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.user);
  const [localError, setLocalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (formData) => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      onUpdate?.(formData);
      navigate('/profile');
    } catch (err) {
      setLocalError(err.message || 'Error al actualizar el perfil');
    }
  }, [dispatch, navigate, onUpdate]);

  const onCancel = useCallback(() => {
    reset();
    navigate('/profile');
  }, [navigate, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Perfil</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {localError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {localError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <Input
            id="name"
            {...register('name')}
            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biografía
          </label>
          <textarea
            id="bio"
            rows="4"
            {...register('bio')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || !isValid || loading}
          loading={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default memo(UserProfileEdit);
```

### Patrones Comunes en Aplicaciones de Producción

#### 1. Patrón Container/Component
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

// ✅ Component: Solo encargado de la presentación
import React from 'react';

const ProductsList = ({ products, loading, error }) => {
  if (loading) return <div className="text-center py-10">Cargando productos...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
```

#### 2. Manejo de Errores Global
```javascript
// ✅ Componente de manejo de errores
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Reportar error a servicio de logging
    console.error('Error capturado por Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">¡Ups! </strong>
          <span className="block sm:inline">Ocurrió un error en la aplicación.</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            ×
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Errores Comunes y Cómo Evitarlos

### 1. Problemas de Memoria y Efectos Colgantes
❌ Malo:
```javascript
// ERROR COMÚN: Efecto que no se limpia
import { useState, useEffect } from 'react';

const BadComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Este intervalo no se limpia, causando fugas de memoria
      fetchData().then(setData);
    }, 1000);
  }, []);

  return <div>{data?.value}</div>;
};
```

✅ Correcto:
```javascript
// CORRECTO: Efecto con limpieza adecuada
import { useState, useEffect } from 'react';

const GoodComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(setData);
    }, 1000);

    // Limpieza del efecto
    return () => clearInterval(interval);
  }, []);

  return <div>{data?.value}</div>;
};
```

### 2. Re-renderizados Innecesarios
❌ Malo:
```javascript
// ERROR COMÚN: Funciones creadas en cada renderizado
import React, { useState } from 'react';

const BadComponent = () => {
  const [count, setCount] = useState(0);

  // Esta función se recrea en cada renderizado
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Contador: {count}</p>
      {/* El componente hijo recibirá una nueva función cada vez */}
      <ChildComponent onClick={handleClick} />
    </div>
  );
};
```

✅ Correcto:
```javascript
// CORRECTO: Uso de useCallback para memorizar funciones
import React, { useState, useCallback } from 'react';

const GoodComponent = () => {
  const [count, setCount] = useState(0);

  // Memorizamos la función para evitar recreaciones innecesarias
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  return (
    <div>
      <p>Contador: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};
```

### 3. Prop Drilling
❌ Malo:
```javascript
// ERROR COMÚN: Pasar props a través de múltiples niveles
const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Header user={user} />
  );
};

const Header = ({ user }) => {
  return (
    <nav>
      <UserProfile user={user} /> {/* user no se usa aquí */}
    </nav>
  );
};

const UserProfile = ({ user }) => {
  return <div>{user?.name}</div>; // Finalmente se usa user
};
```

✅ Correcto:
```javascript
// CORRECTO: Uso de Context API o Redux para evitar prop drilling
import { createContext, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>
    {children}
  </UserContext.Provider>
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Ahora podemos acceder al usuario sin pasar props
const UserProfile = () => {
  const user = useUser();
  return <div>{user?.name}</div>;
};
```

### 4. Manejo Incorrecto de Estados Asíncronos
❌ Malo:
```javascript
// ERROR COMÚN: Estado inconsistente después de desmontaje
import { useState, useEffect } from 'react';

const BadComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(response => {
      // Si el componente se desmonta antes de que termine la promesa,
      // intentaremos actualizar el estado de un componente desmontado
      setData(response);
    });
  }, []);

  return <div>{data?.value}</div>;
};
```

✅ Correcto:
```javascript
// CORRECTO: Verificación de montaje antes de actualizar estado
import { useState, useEffect, useRef } from 'react';

const GoodComponent = () => {
  const [data, setData] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    fetchData().then(response => {
      // Solo actualizamos el estado si el componente sigue montado
      if (isMountedRef.current) {
        setData(response);
      }
    });
  }, []);

  return <div>{data?.value}</div>;
};
```

## Git y Control de Versiones

### Convenciones de Commits

Usar formato conventional commits:

```
<type>(<scope>): <description>

feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de estilo sin afectar lógica
refactor: cambios que no corrigen bugs ni agregan features
test: agregar o modificar tests
chore: tareas de mantenimiento
```

Ejemplos:
- `feat(auth): add login with social media`
- `fix(user): resolve issue with profile update`
- `refactor(components): improve button component structure`

### Branching Strategy

- `main`: Versión estable de producción
- `develop`: Versión de desarrollo
- `feature/<nombre>`: Nuevas características
- `hotfix/<nombre>`: Correcciones urgentes
- `release/<version>`: Preparación de releases

---

Esta guía debe ser consultada regularmente y actualizada según evolucione el proyecto. Todos los miembros del equipo deben seguir estas convenciones para mantener la coherencia y calidad del código.


Basado en el código que hemos estado trabajando, aquí te detallo las librerías y herramientas que conforman este proyecto, explicando para qué sirve cada una en tu aplicación:
1. React (react)
¿Qué es?: Es la biblioteca principal (el "motor") de la aplicación.
¿Para qué la usamos aquí?:
Para crear componentes reutilizables como TaskSidebar, ExecutionPanel o CycleCard.
Para manejar la lógica y el estado (useState, useMemo), como saber qué tarea está seleccionada actualmente o filtrar los ciclos de esa tarea.
2. React DOM (react-dom)
¿Qué es?: Es el "pegamento" entre React y el navegador web.
¿Para qué la usamos aquí?:
Se usa específicamente en el archivo index.tsx (ReactDOM.createRoot).
Su única función es tomar toda la estructura que creamos en React e "inyectarla" dentro del div id="root" de tu archivo HTML para que el usuario pueda verla.
3. Tailwind CSS
¿Qué es?: Un framework de diseño CSS basado en clases de utilidad.
¿Para qué la usamos aquí?:
Para dar estilo a todo sin escribir archivos .css separados.
Cuando ves clases como flex, p-4, bg-slate-50, text-teal-600 o hover:bg-slate-100, eso es Tailwind.
En este proyecto, se está cargando directamente desde una CDN (en el index.html) para prototipado rápido, y hemos configurado colores personalizados (como brand y accent) dentro del script de configuración en el HTML.
4. Lucide React (lucide-react)
¿Qué es?: Una colección de iconos vectoriales (SVG) modernos y limpios, optimizados para React.
¿Para qué la usamos aquí?:
Para todos los elementos visuales gráficos.
Ejemplos en tu código:
Bell (la campana de notificaciones).
CheckCircle2 (el check verde de tarea completada).
Loader2 (el spinner de tarea en progreso).
Clock (el reloj de pendiente).
Upload, FileText, Filter, etc.
5. Google Fonts (Inter)
¿Qué es?: Un servicio de tipografía.
¿Para qué la usamos aquí?:
Estamos importando la fuente "Inter" en el index.html.
Le da a la aplicación ese aspecto moderno, limpio y profesional, similar a las interfaces de software empresarial actual (SaaS).
Nota sobre la Arquitectura
Actualmente, tu proyecto no está usando un "empaquetador" tradicional (como Webpack o Vite) con npm install. Está utilizando una arquitectura moderna basada en ES Modules directamente en el navegador (a través de esm.sh definido en el importmap del index.html).
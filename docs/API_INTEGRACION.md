# Documentación de APIs e Integración

## 📡 Integración Frontend-Backend

---

## Índice

1. [Arquitectura de Integración](#arquitectura-de-integración)
2. [Flujo de Datos](#flujo-de-datos)
3. [Configuración de la API](#configuración-de-la-api)
4. [Endpoints Consumidos](#endpoints-consumidos)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [Manejo de Errores](#manejo-de-errores)
7. [Ejemplos de Integración](#ejemplos-de-integración)

---

## Arquitectura de Integración

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                     (React + Vite)                          │
│                    Puerto: 3000                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Páginas    │    │  Componentes │    │   Context    │ │
│  │   (Views)    │◄───┤  (UI Layer)  │◄───┤   (Estado)   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                        │          │
│         └────────────────┬──────────────────────┘          │
│                          ▼                                  │
│                  ┌──────────────┐                          │
│                  │   Services   │                          │
│                  │  (API Layer) │                          │
│                  └──────────────┘                          │
│                          │                                  │
│                          │ Axios + JWT                      │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │ REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        BACKEND                              │
│                    (Spring Boot)                            │
│                    Puerto: 8080                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Controllers  │───►│   Services   │───►│ Repositories │ │
│  │   (REST)     │    │  (Business)  │    │   (Data)     │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                        │          │
│         │ JWT Validation                         │          │
│         │                                        ▼          │
│         │                              ┌──────────────┐    │
│         └─────────────────────────────►│   Database   │    │
│                                        │  (MySQL/H2)  │    │
│                                        └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Tecnologías Utilizadas

**Frontend:**
- **React 18**: Librería de UI
- **Axios**: Cliente HTTP para consumir API REST
- **React Router DOM**: Navegación y rutas
- **Context API**: Gestión de estado global (autenticación)

**Backend:**
- **Spring Boot**: Framework Java
- **Spring Security + JWT**: Autenticación y autorización
- **JPA/Hibernate**: ORM para base de datos
- **MySQL/H2**: Base de datos

---

## Flujo de Datos

### 1. Flujo de Autenticación

```
┌──────────┐                                         ┌──────────┐
│ Usuario  │                                         │ Backend  │
└────┬─────┘                                         └────┬─────┘
     │                                                    │
     │ 1. Ingresa credenciales                           │
     ├───────────────────────────────────────────────────┤
     │                                                    │
     │ 2. POST /api/auth/login                           │
     │    { username, password }                         │
     ├───────────────────────────────────────────────────►
     │                                                    │
     │                           3. Valida credenciales  │
     │                              y genera JWT         │
     │                                                    │
     │ 4. Response: { token, user }                      │
     ◄───────────────────────────────────────────────────┤
     │                                                    │
     │ 5. Guarda token en localStorage                   │
     │    Guarda userData en localStorage                │
     │                                                    │
     │ 6. Todas las peticiones incluyen:                 │
     │    Header: Authorization: Bearer <token>          │
     ├───────────────────────────────────────────────────►
     │                                                    │
     │                           7. Valida token y rol   │
     │                                                    │
     │ 8. Response con datos                             │
     ◄───────────────────────────────────────────────────┤
     │                                                    │
```

**Código Frontend (authService.js):**

```javascript
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  
  // Guardar en localStorage para persistencia
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(user));
  
  return { success: true, data: { token, user } };
};
```

### 2. Flujo de Petición Protegida

```
┌──────────┐                                         ┌──────────┐
│ Frontend │                                         │ Backend  │
└────┬─────┘                                         └────┬─────┘
     │                                                    │
     │ 1. GET /api/products                              │
     │    Header: Authorization: Bearer <token>          │
     ├───────────────────────────────────────────────────►
     │                                                    │
     │                           2. Interceptor extrae   │
     │                              token del header     │
     │                                                    │
     │                           3. Valida token JWT     │
     │                              ├─ Token válido?     │
     │                              │  ├─ Sí ──────────┐ │
     │                              │  └─ No ──────────┤ │
     │                              │                  │ │
     │                           4. Verifica permisos  │ │
     │                              de rol             │ │
     │                                                 │ │
     │ 5a. Response: 200 + datos                      │ │
     ◄────────────────────────────────────────────────┘ │
     │                                                    │
     │ 5b. Response: 401 Unauthorized                    │
     ◄───────────────────────────────────────────────────┤
     │                                                    │
     │ 6. Si 401: Cierra sesión y redirige a login      │
     │                                                    │
```

**Código Frontend (api.js - Interceptor):**

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Flujo de Gestión de Productos (Admin)

```
┌──────────┐                                         ┌──────────┐
│  Admin   │                                         │ Backend  │
└────┬─────┘                                         └────┬─────┘
     │                                                    │
     │ 1. Clic en "Nuevo Producto"                       │
     │                                                    │
     │ 2. Completa formulario                            │
     │    { name, description, price, stock, category }  │
     │                                                    │
     │ 3. POST /api/products                             │
     │    Header: Authorization: Bearer <token>          │
     │    Body: { productData }                          │
     ├───────────────────────────────────────────────────►
     │                                                    │
     │                           4. Valida token         │
     │                           5. Verifica rol = ADMIN │
     │                           6. Valida datos         │
     │                           7. Guarda en DB         │
     │                                                    │
     │ 8. Response: 201 Created + producto               │
     ◄───────────────────────────────────────────────────┤
     │                                                    │
     │ 9. Actualiza UI con nuevo producto                │
     │                                                    │
```

**Código Frontend (productService.js):**

```javascript
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  
  return {
    success: true,
    data: response.data,
    message: 'Producto creado exitosamente',
  };
};
```

---

## Configuración de la API

### Archivo: `src/services/api.js`

```javascript
import axios from 'axios';

// URL base configurable
const API_BASE_URL = 'http://localhost:8080/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

export default api;
```

### Configuración del Backend

**Requisitos:**

1. **CORS habilitado** para aceptar peticiones desde `http://localhost:3000`

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

2. **JWT configurado** en Spring Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").hasAnyRole("ADMIN", "VENDEDOR")
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

---

## Endpoints Consumidos

### Autenticación

#### 1. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

**Response Error (401):**
```json
{
  "message": "Credenciales inválidas"
}
```

#### 2. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

### Productos

#### 1. Listar Productos

**Endpoint:** `GET /api/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Roles permitidos:** ADMIN, VENDEDOR

**Response Success (200):**
```json
[
  {
    "id": 1,
    "name": "Laptop Dell",
    "description": "Laptop empresarial de alto rendimiento",
    "price": 1299.99,
    "stock": 15,
    "category": "Electrónica"
  },
  {
    "id": 2,
    "name": "Mouse Logitech",
    "description": "Mouse inalámbrico ergonómico",
    "price": 29.99,
    "stock": 50,
    "category": "Accesorios"
  }
]
```

#### 2. Obtener Producto por ID

**Endpoint:** `GET /api/products/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "id": 1,
  "name": "Laptop Dell",
  "description": "Laptop empresarial de alto rendimiento",
  "price": 1299.99,
  "stock": 15,
  "category": "Electrónica"
}
```

#### 3. Crear Producto

**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Request:**
```json
{
  "name": "Teclado Mecánico",
  "description": "Teclado RGB para gaming",
  "price": 89.99,
  "stock": 30,
  "category": "Accesorios"
}
```

**Response Success (201):**
```json
{
  "id": 3,
  "name": "Teclado Mecánico",
  "description": "Teclado RGB para gaming",
  "price": 89.99,
  "stock": 30,
  "category": "Accesorios"
}
```

#### 4. Actualizar Producto

**Endpoint:** `PUT /api/products/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Request:**
```json
{
  "name": "Teclado Mecánico RGB",
  "description": "Teclado RGB premium para gaming",
  "price": 99.99,
  "stock": 25,
  "category": "Accesorios"
}
```

**Response Success (200):**
```json
{
  "id": 3,
  "name": "Teclado Mecánico RGB",
  "description": "Teclado RGB premium para gaming",
  "price": 99.99,
  "stock": 25,
  "category": "Accesorios"
}
```

#### 5. Eliminar Producto

**Endpoint:** `DELETE /api/products/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Response Success (204):**
```
No Content
```

### Órdenes

#### 1. Listar Órdenes

**Endpoint:** `GET /api/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Roles permitidos:** ADMIN, VENDEDOR

**Response Success (200):**
```json
[
  {
    "id": 1,
    "customerId": 5,
    "customerName": "Juan Pérez",
    "total": 1329.98,
    "status": "CONFIRMED",
    "createdAt": "2025-11-26T10:30:00"
  },
  {
    "id": 2,
    "customerId": 6,
    "customerName": "María González",
    "total": 29.99,
    "status": "PENDING",
    "createdAt": "2025-11-26T11:15:00"
  }
]
```

#### 2. Obtener Orden por ID

**Endpoint:** `GET /api/orders/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "id": 1,
  "customerId": 5,
  "customerName": "Juan Pérez",
  "total": 1329.98,
  "status": "CONFIRMED",
  "createdAt": "2025-11-26T10:30:00",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop Dell",
      "quantity": 1,
      "price": 1299.99
    },
    {
      "productId": 2,
      "productName": "Mouse Logitech",
      "quantity": 1,
      "price": 29.99
    }
  ]
}
```

#### 3. Crear Orden

**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "customerId": 5,
  "customerName": "Juan Pérez",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop Dell",
      "quantity": 1,
      "price": 1299.99
    },
    {
      "productId": 2,
      "productName": "Mouse Logitech",
      "quantity": 1,
      "price": 29.99
    }
  ],
  "total": 1329.98
}
```

**Response Success (201):**
```json
{
  "id": 3,
  "customerId": 5,
  "customerName": "Juan Pérez",
  "total": 1329.98,
  "status": "PENDING",
  "createdAt": "2025-11-26T14:20:00"
}
```

#### 4. Obtener Detalles de Orden

**Endpoint:** `GET /api/orders/{id}/details`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
[
  {
    "productId": 1,
    "productName": "Laptop Dell",
    "quantity": 1,
    "price": 1299.99
  },
  {
    "productId": 2,
    "productName": "Mouse Logitech",
    "quantity": 1,
    "price": 29.99
  }
]
```

### Usuarios

#### 1. Listar Usuarios

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Response Success (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "vendedor",
    "name": "Vendedor 1",
    "email": "vendedor@example.com",
    "role": "VENDEDOR"
  }
]
```

#### 2. Crear Usuario

**Endpoint:** `POST /api/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Request:**
```json
{
  "username": "nuevo_usuario",
  "password": "password123",
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "role": "CLIENTE"
}
```

**Response Success (201):**
```json
{
  "id": 7,
  "username": "nuevo_usuario",
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "role": "CLIENTE"
}
```

#### 3. Actualizar Usuario

**Endpoint:** `PUT /api/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Request:**
```json
{
  "name": "Usuario Actualizado",
  "email": "actualizado@example.com",
  "role": "VENDEDOR"
}
```

**Response Success (200):**
```json
{
  "id": 7,
  "username": "nuevo_usuario",
  "name": "Usuario Actualizado",
  "email": "actualizado@example.com",
  "role": "VENDEDOR"
}
```

#### 4. Eliminar Usuario

**Endpoint:** `DELETE /api/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Response Success (204):**
```
No Content
```

#### 5. Cambiar Rol de Usuario

**Endpoint:** `PATCH /api/users/{id}/role`

**Headers:**
```
Authorization: Bearer <token>
```

**Rol requerido:** ADMIN

**Request:**
```json
{
  "role": "ADMIN"
}
```

**Response Success (200):**
```json
{
  "id": 7,
  "username": "nuevo_usuario",
  "name": "Usuario Actualizado",
  "email": "actualizado@example.com",
  "role": "ADMIN"
}
```

---

## Autenticación y Seguridad

### JWT (JSON Web Token)

#### Estructura del Token

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzMjQyMDAwMCwiZXhwIjoxNjMyNTA2NDAwfQ.signature
│                                         │                                                                                                │
│           Header                        │                                      Payload                                                   │  Signature
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "admin",
  "role": "ADMIN",
  "iat": 1632420000,
  "exp": 1632506400
}
```

#### Flujo de Validación

1. **Frontend envía token** en cada petición:
   ```
   Authorization: Bearer <token>
   ```

2. **Backend extrae token** del header

3. **Backend valida token**:
   - ✅ Firma correcta (no ha sido alterado)
   - ✅ No ha expirado (`exp` > tiempo actual)
   - ✅ Emisor correcto (`iss`)

4. **Backend extrae información** del payload:
   - Usuario (`sub`)
   - Rol (`role`)

5. **Backend verifica permisos** según el rol

6. **Backend responde**:
   - ✅ 200/201: Petición exitosa
   - ❌ 401: Token inválido o expirado
   - ❌ 403: Sin permisos para esta acción

### Almacenamiento Seguro

**localStorage:**

```javascript
// Guardar token
localStorage.setItem('authToken', token);

// Recuperar token
const token = localStorage.getItem('authToken');

// Eliminar token (logout)
localStorage.removeItem('authToken');
```

**Consideraciones de Seguridad:**

✅ **Ventajas:**
- Persiste entre sesiones
- Fácil acceso desde JavaScript
- No se envía automáticamente en peticiones

❌ **Desventajas:**
- Vulnerable a ataques XSS (Cross-Site Scripting)
- No es httpOnly

**Mejora para Producción:**

Usar **httpOnly cookies** en vez de localStorage:

```javascript
// Backend configura cookie
response.cookie('authToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 86400000 // 24 horas
});
```

---

## Manejo de Errores

### Tipos de Errores

#### 1. Error 400 - Bad Request

**Causa:** Datos inválidos en la petición

**Respuesta del Backend:**
```json
{
  "message": "Datos inválidos",
  "errors": [
    "El campo 'name' es requerido",
    "El precio debe ser mayor a 0"
  ]
}
```

**Manejo en Frontend:**
```javascript
try {
  const result = await createProduct(productData);
} catch (error) {
  if (error.response?.status === 400) {
    const errors = error.response.data.errors;
    alert(`Errores: ${errors.join(', ')}`);
  }
}
```

#### 2. Error 401 - Unauthorized

**Causa:** Token inválido o expirado

**Manejo en Frontend (Interceptor):**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 3. Error 403 - Forbidden

**Causa:** Usuario no tiene permisos para esta acción

**Respuesta del Backend:**
```json
{
  "message": "No tienes permisos para realizar esta acción"
}
```

**Manejo en Frontend:**
```javascript
if (error.response?.status === 403) {
  alert('No tienes permisos para realizar esta acción.');
}
```

#### 4. Error 404 - Not Found

**Causa:** Recurso no encontrado

**Respuesta del Backend:**
```json
{
  "message": "Producto no encontrado"
}
```

#### 5. Error 500 - Internal Server Error

**Causa:** Error en el servidor

**Respuesta del Backend:**
```json
{
  "message": "Error interno del servidor"
}
```

**Manejo en Frontend:**
```javascript
if (error.response?.status === 500) {
  alert('Error en el servidor. Intenta nuevamente más tarde.');
}
```

### Función Centralizada de Manejo de Errores

**Archivo: `src/services/api.js`**

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con error
    return {
      message: error.response.data?.message || 'Error en el servidor',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // No se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      status: 0,
    };
  } else {
    // Error al configurar la petición
    return {
      message: error.message || 'Error desconocido',
      status: -1,
    };
  }
};
```

---

## Ejemplos de Integración

### Ejemplo 1: Login Completo

```javascript
// authService.js
import api, { handleApiError } from './api';

export const login = async (credentials) => {
  try {
    // 1. Enviar petición al backend
    const response = await api.post('/auth/login', credentials);
    
    // 2. Extraer token y datos del usuario
    const { token, user } = response.data;
    
    // 3. Guardar en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    
    console.log('[Auth] Login exitoso:', user);
    
    // 4. Retornar éxito
    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    console.error('[Auth] Error en login:', error);
    
    // 5. Manejar error
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      status: errorInfo.status,
    };
  }
};
```

```javascript
// Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Llamar servicio de login
    const result = await login(credentials);
    
    // 2. Verificar resultado
    if (result.success) {
      // 3. Redirigir según rol
      navigate(result.redirectTo);
    } else {
      // 4. Mostrar error
      setError(result.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  );
};
```

### Ejemplo 2: CRUD de Productos

```javascript
// productService.js
import api, { handleApiError } from './api';

// Listar productos
export const getAllProducts = async () => {
  try {
    const response = await api.get('/products');
    return { success: true, data: response.data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

// Crear producto
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return {
      success: true,
      data: response.data,
      message: 'Producto creado exitosamente',
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return {
      success: true,
      data: response.data,
      message: 'Producto actualizado exitosamente',
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};

// Eliminar producto
export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    return {
      success: true,
      message: 'Producto eliminado exitosamente',
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};
```

```javascript
// ProductList.jsx
import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, deleteProduct } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.data);
    } else {
      alert(result.message);
    }
  };
  
  const handleCreate = async (productData) => {
    const result = await createProduct(productData);
    if (result.success) {
      alert(result.message);
      loadProducts(); // Recargar lista
    } else {
      alert(result.message);
    }
  };
  
  const handleDelete = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) {
      alert(result.message);
      loadProducts(); // Recargar lista
    } else {
      alert(result.message);
    }
  };
  
  return (
    <div>
      {/* UI de productos */}
    </div>
  );
};
```

### Ejemplo 3: Protección de Rutas por Rol

```javascript
// RoleGuard.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAnyRole } from '../utils/roleValidator';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 1. Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Verificar rol
  const hasPermission = hasAnyRole(user?.role, allowedRoles);
  
  if (!hasPermission) {
    // 3. Redirigir si no tiene permiso
    return <Navigate to="/dashboard" replace />;
  }
  
  // 4. Renderizar contenido si tiene permiso
  return children;
};
```

```javascript
// App.jsx
import RoleGuard from './components/RoleGuard';
import { ROLES } from './utils/constants';

function App() {
  return (
    <Routes>
      {/* Solo ADMIN puede acceder a gestión de usuarios */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={[ROLES.ADMIN]}>
              <UserManagement />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      
      {/* ADMIN y VENDEDOR pueden ver productos */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
              <ProductList />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## Justificación de la Integración

### ¿Por qué REST API?

**Ventajas:**
- ✅ **Estándar ampliamente adoptado**: Fácil de entender y mantener
- ✅ **Stateless**: Cada petición es independiente
- ✅ **Cacheable**: Mejora el rendimiento
- ✅ **Separación de responsabilidades**: Frontend y Backend independientes
- ✅ **Escalabilidad**: Fácil escalar horizontalmente

### ¿Por qué JWT?

**Ventajas:**
- ✅ **Stateless**: No requiere almacenamiento en servidor
- ✅ **Autónomo**: Contiene toda la información necesaria
- ✅ **Escalable**: Perfecto para arquitecturas distribuidas
- ✅ **Seguro**: Firmado criptográficamente
- ✅ **Cross-domain**: Funciona con CORS

### ¿Por qué Axios?

**Ventajas sobre fetch:**
- ✅ **Interceptores**: Añadir lógica global fácilmente
- ✅ **Transformación automática**: JSON parsing automático
- ✅ **Manejo de errores mejorado**: Catch de errores HTTP
- ✅ **Timeout**: Configuración de timeout
- ✅ **Cancelación de peticiones**: Útil en React

### Flujo de Datos Eficiente

```
1. Usuario interactúa con UI
2. React Component llama a Service
3. Service usa Axios para llamar a API
4. Axios añade token JWT automáticamente (interceptor)
5. Backend valida token y permisos
6. Backend procesa petición
7. Backend retorna respuesta
8. Axios maneja respuesta (interceptor)
9. Service procesa datos
10. React Component actualiza UI
```

**Eficiencia:**
- ⚡ Mínimas llamadas a la API (caching en frontend)
- ⚡ Interceptores evitan código repetitivo
- ⚡ Validación en cliente reduce peticiones inválidas
- ⚡ Paginación para listas grandes (futuro)

---

## Conclusión

La integración entre el frontend React y el backend Spring Boot mediante REST API y JWT proporciona:

1. **Seguridad robusta** mediante autenticación y autorización basada en roles
2. **Persistencia de sesión** para mejorar la experiencia del usuario
3. **Comunicación eficiente** con manejo de errores centralizado
4. **Escalabilidad** para futuras funcionalidades
5. **Mantenibilidad** con separación clara de responsabilidades

---

**Desarrollado para:** Evaluación Parcial N° 3  
**Fecha:** Noviembre 2025

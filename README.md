# Frontend - Sistema de Gestión con Control de Acceso por Roles

## 📋 Descripción del Proyecto

Frontend desarrollado con React + Vite para la **Evaluación Parcial N° 3**. Este proyecto implementa un sistema completo de autenticación, gestión de sesiones persistente y control de acceso basado en roles (Administrador, Vendedor, Cliente).

## 🎯 Características Principales

### 1. Integración con API REST
- Consumo de endpoints del backend Spring Boot mediante Axios
- Manejo eficiente de datos (productos, boletas, usuarios)
- Interceptores HTTP para gestión automática de tokens JWT

### 2. Gestión de Sesiones (Persistencia)
- Sistema de autenticación con JWT
- Almacenamiento seguro de tokens en localStorage
- Persistencia de sesión tras recargar página
- Renovación automática de tokens
- Cierre de sesión con limpieza completa

### 3. Control de Acceso por Roles
- **Administrador**: Acceso total a todas las funcionalidades
- **Vendedor**: Acceso a productos, órdenes y detalles (vistas limitadas)
- **Cliente**: Solo acceso a la tienda (máximas restricciones)

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v16+ y npm
- Backend Spring Boot ejecutándose en `http://localhost:8080`

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd frontend-evaluacion-parcial3

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Construir para producción
npm run build
```

El frontend estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
frontend-evaluacion-parcial3/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ProtectedRoute.jsx
│   │   ├── Navbar.jsx
│   │   ├── RoleGuard.jsx
│   │   └── ...
│   ├── pages/              # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProductList.jsx
│   │   ├── OrderList.jsx
│   │   ├── UserManagement.jsx
│   │   └── Store.jsx
│   ├── services/           # Servicios para API REST
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── userService.js
│   ├── context/            # Context API de React
│   │   └── AuthContext.jsx
│   ├── utils/              # Utilidades
│   │   ├── roleValidator.js
│   │   └── constants.js
│   ├── styles/             # Estilos CSS
│   │   └── App.css
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. Usuario envía credenciales al endpoint `/api/auth/login`
2. Backend valida y retorna JWT + datos del usuario
3. Frontend almacena el token en localStorage
4. Todas las peticiones subsecuentes incluyen el token en headers
5. Sistema valida roles antes de renderizar componentes

### Gestión de Token JWT
```javascript
// El token se incluye automáticamente en todas las peticiones
Authorization: Bearer <token>
```

## 🛡️ Control de Acceso por Roles

### Matriz de Permisos

| Funcionalidad | Administrador | Vendedor | Cliente |
|---------------|---------------|----------|---------|
| Dashboard | ✅ | ✅ | ❌ |
| Lista Productos | ✅ | ✅ (solo lectura) | ❌ |
| Gestión Productos | ✅ | ❌ | ❌ |
| Lista Órdenes | ✅ | ✅ (solo lectura) | ❌ |
| Gestión Órdenes | ✅ | ❌ | ❌ |
| Gestión Usuarios | ✅ | ❌ | ❌ |
| Tienda | ✅ | ❌ | ✅ |
| Reportes | ✅ | ❌ | ❌ |

## 🔄 Integración con Backend

### Endpoints Consumidos

```
POST   /api/auth/login          - Autenticación
POST   /api/auth/logout         - Cerrar sesión
GET    /api/products            - Listar productos
GET    /api/products/{id}       - Detalle producto
POST   /api/products            - Crear producto (Admin)
PUT    /api/products/{id}       - Actualizar producto (Admin)
DELETE /api/products/{id}       - Eliminar producto (Admin)
GET    /api/orders              - Listar órdenes
GET    /api/orders/{id}         - Detalle orden
POST   /api/orders              - Crear orden
GET    /api/users               - Listar usuarios (Admin)
POST   /api/users               - Crear usuario (Admin)
PUT    /api/users/{id}          - Actualizar usuario (Admin)
```

## 📱 Componentes Clave

### AuthContext
Proveedor de contexto que maneja:
- Estado de autenticación global
- Información del usuario actual
- Funciones de login/logout
- Validación de roles

### ProtectedRoute
Componente que protege rutas según autenticación:
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### RoleGuard
Componente que restringe acceso por rol:
```jsx
<RoleGuard allowedRoles={['ADMIN', 'VENDEDOR']}>
  <ProductList />
</RoleGuard>
```

## 🧪 Casos de Uso

### Usuario Administrador
1. Inicia sesión con credenciales de admin
2. Accede al dashboard completo
3. Puede gestionar productos, órdenes y usuarios
4. Tiene acceso a todos los módulos del sistema

### Usuario Vendedor
1. Inicia sesión con credenciales de vendedor
2. Ve un dashboard limitado
3. Puede visualizar productos y órdenes (solo lectura)
4. No ve opciones de gestión de usuarios ni reportes

### Usuario Cliente
1. Inicia sesión con credenciales de cliente
2. Es redirigido automáticamente a la tienda
3. Solo puede navegar por productos y realizar compras
4. No tiene acceso a dashboards ni gestión

## 📊 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP para API REST
- **Context API** - Manejo de estado global
- **CSS3** - Estilos personalizados

## 🔧 Configuración de API

Edita el archivo `src/services/api.js` para configurar la URL del backend:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📚 Documentación Adicional

- **Manual de Usuario**: Ver `docs/MANUAL_USUARIO.md`
- **Documentación de APIs**: Ver `docs/API_INTEGRACION.md`
- **Guía de Despliegue**: Ver `docs/DEPLOYMENT.md`

## 👥 Roles y Responsabilidades

Este frontend fue desarrollado enfocándose en:
- ✅ Integración efectiva con API REST
- ✅ Gestión de sesiones persistente y segura
- ✅ Restricciones de acceso basadas en roles
- ✅ Experiencia de usuario intuitiva

## 📝 Notas Importantes

1. **Seguridad**: Los tokens JWT se almacenan en localStorage. En producción, considera usar httpOnly cookies para mayor seguridad.
2. **Roles**: Los roles deben coincidir exactamente con los definidos en el backend.
3. **CORS**: Asegúrate de que el backend tenga CORS configurado para aceptar peticiones desde `http://localhost:3000`.

## 🐛 Resolución de Problemas

### Error de CORS
```bash
# Verifica que el backend tenga configurado:
@CrossOrigin(origins = "http://localhost:3000")
```

### Token Expirado
El sistema detecta tokens expirados y redirige automáticamente al login.

### Rol No Reconocido
Verifica que los roles en el backend coincidan con: `ADMIN`, `VENDEDOR`, `CLIENTE`

## 📧 Contacto

Para consultas sobre este proyecto frontend, contacta al equipo de desarrollo.

---

## 🚀 Próximos Pasos (Desde Ahora)

### ✅ Estado Actual del Proyecto
- Frontend completamente adaptado al backend Java 21 / Spring Boot 3.2.12
- Datos mock desactivados - **conectado al backend real**
- Base URL configurada: `http://localhost:8080/api/v1`
- Servicios actualizados para usar endpoints: `/products`, `/orders`, `/users`
- Login maneja respuesta `{token, usuario, rol}` del backend
- Token JWT se envía automáticamente en header `Authorization: Bearer <token>`
- Matriz de permisos actualizada: VENDEDOR puede crear órdenes

### 📋 Tareas Pendientes

#### 1. Arrancar Backend
```bash
# En el directorio del backend Java Spring Boot
./mvnw spring-boot:run
# o
java -jar target/nombre-del-jar.jar
```
- Verificar que esté corriendo en `http://localhost:8080`
- Confirmar que los endpoints `/api/v1/auth/login`, `/api/v1/products`, etc. respondan

#### 2. Arrancar Frontend
```bash
# En este directorio
npm run dev
```
- Acceder a `http://localhost:3000` (o el puerto que indique Vite)

#### 3. Probar Login
Usuarios de prueba (deben estar en el backend):
- **Admin**: `username: admin`, `password: admin123`
- **Vendedor**: `username: vendedor`, `password: vendedor123`
- **Cliente**: `username: cliente`, `password: cliente123`

Verificar que:
- Login guarde `token`, `rol`, `usuario` en localStorage
- Redirección según rol funcione correctamente
- Token se envíe en peticiones subsecuentes

#### 4. Validar CRUD de Productos (ADMIN)
- Listar productos
- Crear nuevo producto
- Editar producto existente
- Eliminar producto
- Verificar que VENDEDOR solo pueda ver (no editar/eliminar)

#### 5. Validar Órdenes (ADMIN y VENDEDOR)
- Listar órdenes
- Crear nueva orden (ADMIN y VENDEDOR deben poder)
- Editar orden (solo ADMIN)
- Eliminar orden (solo ADMIN)
- Ver detalles de orden

#### 6. Validar Gestión de Usuarios (solo ADMIN)
- Listar usuarios
- Crear usuario con rol
- Obtener usuario por username
- Verificar que otros roles no accedan

#### 7. Manejo de Errores
- Probar login con credenciales inválidas
- Intentar acceder a rutas sin autenticación
- Intentar operaciones sin permisos (403)
- Verificar redirección al login en token expirado (401)

#### 8. Optimizaciones Opcionales
- [ ] Implementar mensajes toast para feedback visual
- [ ] Agregar loading states en peticiones
- [ ] Implementar paginación en listados grandes
- [ ] Agregar búsqueda y filtros en productos/órdenes
- [ ] Mejorar manejo de errores con mensajes específicos
- [ ] Implementar validación de formularios
- [ ] Agregar confirmaciones antes de eliminar
- [ ] Mejorar estilos y responsividad

#### 9. Documentación
- [ ] Actualizar screenshots del proyecto funcionando
- [ ] Documentar estructura de payloads para crear/editar
- [ ] Crear ejemplos de uso de cada endpoint
- [ ] Documentar casos de error y cómo manejarlos

#### 10. Despliegue (Opcional)
- [ ] Configurar variables de entorno para producción
- [ ] Ajustar CORS en backend para dominio de producción
- [ ] Build optimizado: `npm run build`
- [ ] Desplegar en servicio de hosting (Vercel, Netlify, etc.)

### 🔍 Checklist de Integración
- [x] `.env` creado con `VITE_API_BASE_URL`
- [x] Servicios actualizados a `/auth`, `/products`, `/orders`, `/users`
- [x] Interceptor Axios configurado para JWT
- [x] Login maneja `{token, usuario, rol}`
- [x] localStorage usa claves: `token`, `rol`, `usuario`
- [x] Función `hasRole(['ADMIN'])` implementada
- [x] Permisos de VENDEDOR actualizados (puede crear órdenes)
- [x] Datos mock desactivados
- [ ] Backend corriendo y accesible
- [ ] Pruebas de integración completadas
- [ ] Validación de roles en todas las rutas

### 📖 Recursos de Referencia
- **Guía de integración backend**: Ver `front-back.md` adjunto
- **Swagger del backend**: `http://localhost:8080/swagger-ui/index.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

---

**Desarrollado para Evaluación Parcial N° 3**

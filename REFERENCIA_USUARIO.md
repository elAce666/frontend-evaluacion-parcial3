# Referencia Completa - Manual de Usuario, Datos y Presentación

## 📘 MANUAL DE USUARIO - Sistema de Gestión

### Introducción

Bienvenido al **Sistema de Gestión**, una aplicación web con autenticación JWT y control de acceso basado en roles.

### Acceso al Sistema

**Paso 1: Abrir la aplicación**
- Navegador: `http://localhost:3000`

**Paso 2: Iniciar sesión con credenciales**

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| cliente | cliente123 | Cliente |

**Paso 3: El sistema redirige según tu rol**
- Admin → Dashboard completo
- Vendedor → Dashboard limitado
- Cliente → Tienda

### Cerrar Sesión
- Click en botón **"Salir"** en la barra superior
- Sesión limpiada, redirige al login

---

## 👥 Guía por Rol

### 1️⃣ ADMINISTRADOR

**Acceso a todas las funcionalidades.**

#### Dashboard
- Estadísticas completas (productos, órdenes, usuarios)
- Atajos a módulos de gestión

#### Gestión de Productos
**Ubicación:** Menú → Productos

**Funcionalidades:**
- ✅ **Ver:** Tabla de todos los productos
- ✅ **Crear:** Click "Nuevo Producto" → Completar formulario → Guardar
- ✅ **Editar:** Click ✏️ → Modificar campos → Actualizar
- ✅ **Eliminar:** Click 🗑️ → Confirmar → Eliminado permanentemente

**Campos de producto:**
- Nombre (máx. 200 caracteres)
- Descripción
- Precio (> 0)
- Stock (>= 0)
- Categoría

#### Gestión de Órdenes
**Ubicación:** Menú → Órdenes

**Funcionalidades:**
- ✅ **Ver:** Tabla de todas las órdenes
- ✅ **Detalle:** Click "Ver" → Modal con productos y total
- ✅ **Editar:** Cambiar estado (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- ✅ **Eliminar:** Click 🗑️ para cancelar orden

**Estados de orden:**
- `PENDING` - Pendiente
- `CONFIRMED` - Confirmada
- `PROCESSING` - En proceso
- `SHIPPED` - Enviada
- `DELIVERED` - Entregada
- `CANCELLED` - Cancelada

#### Gestión de Usuarios
**Ubicación:** Menú → Usuarios

**Funcionalidades:**
- ✅ **Ver:** Tabla de usuarios registrados
- ✅ **Crear:** "Nuevo Usuario" → Completar:
  - Usuario (único, mín. 3 caracteres)
  - Contraseña (mín. 6 caracteres)
  - Nombre completo
  - Email
  - Rol: `ADMIN`, `VENDEDOR`, `CLIENTE`
- ✅ **Editar:** Click ✏️ → Modificar campos → Actualizar
- ✅ **Cambiar Rol:** Click 🔄 → Seleccionar nuevo rol → Guardar
- ✅ **Eliminar:** Click 🗑️ → Confirmar → Usuario eliminado

---

### 2️⃣ VENDEDOR

**Acceso limitado (solo lectura).**

#### Dashboard
- Estadísticas de productos y órdenes
- Mensaje: *"Estás viendo en modo solo lectura"*

#### Ver Productos
**Ubicación:** Menú → Productos

- ✅ Puede ver todos los productos
- ❌ No puede crear, editar ni eliminar
- **Info:** "Los productos se muestran en modo solo lectura"

#### Ver Órdenes
**Ubicación:** Menú → Órdenes

- ✅ Puede ver lista de órdenes
- ✅ Puede ver detalles (productos y total)
- ❌ No puede crear, editar ni eliminar
- **Mensaje:** "Acceso de solo lectura"

#### Restricciones
El vendedor **NO** puede acceder a:
- ❌ Gestión de Usuarios
- ❌ Tienda
- ❌ Crear/editar productos
- ❌ Crear/editar órdenes

Si intenta acceder → Redirige a Dashboard y muestra "Acceso Denegado"

---

### 3️⃣ CLIENTE

**Acceso exclusivo a la Tienda.**

#### Acceso Automático
Al iniciar sesión, el cliente es redirigido automáticamente a la Tienda.

#### Explorar Productos
- Cada producto muestra:
  - Nombre
  - Descripción
  - Precio
  - Stock disponible
  - Botón **"Agregar al Carrito"**

#### Carrito de Compras
**Vista del Carrito:**
- Click en **"🛒 Carrito (N)"** en barra superior
- Panel lateral con:
  - Lista de productos agregados
  - Cantidad de cada uno
  - Subtotal por producto
  - Total general

**Gestionar Carrito:**
- **Aumentar cantidad:** Click botón **+**
- **Disminuir cantidad:** Click botón **-**
- **Eliminar producto:** Click 🗑️
- **Ver total:** Se actualiza automáticamente

#### Finalizar Compra
1. Revisar productos y cantidad
2. Click **"Finalizar Compra"**
3. Confirmar orden
4. Sistema crea orden y envía a backend
5. Mensaje de confirmación: *"¡Compra realizada exitosamente!"*
6. Carrito se vacía automáticamente

**Restricciones:**
El cliente **NO** puede acceder a:
- ❌ Dashboard
- ❌ Gestión de Productos
- ❌ Gestión de Órdenes
- ❌ Gestión de Usuarios

---

## 📊 DATOS DE EJEMPLO PARA BACKEND

### Estructura de Base de Datos

#### Tabla: usuarios

```sql
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    email VARCHAR(100),
    rol VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: productos (Perfumes)

```sql
CREATE TABLE producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
    marca VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabla: órdenes

```sql
CREATE TABLE venta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    cliente_nombre VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);
```

#### Tabla: líneas de orden

```sql
CREATE TABLE detalle_venta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    producto_nombre VARCHAR(200),
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES venta(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);
```

### Datos de Ejemplo

#### Usuarios

```sql
-- Administrador
INSERT INTO usuario (usuario, password, nombre, email, rol) 
VALUES ('admin', 'admin123_hashed', 'Administrador', 'admin@example.com', 'ADMIN');

-- Vendedor
INSERT INTO usuario (usuario, password, nombre, email, rol) 
VALUES ('vendedor', 'vendedor123_hashed', 'Vendedor 1', 'vendedor@example.com', 'VENDEDOR');

-- Cliente
INSERT INTO usuario (usuario, password, nombre, email, rol) 
VALUES ('cliente', 'cliente123_hashed', 'Cliente 1', 'cliente@example.com', 'CLIENTE');
```

#### Productos (Perfumes)

```sql
INSERT INTO producto (nombre, descripcion, precio, stock, categoria, marca) VALUES
('Eau de Parfum Premium', 'Fragancia floral para mujer, concentración alta', 129.99, 15, 'Mujer', 'Chanel'),
('Colonia Clásica Hombre', 'Aroma fresco y duradero para caballeros', 89.99, 25, 'Hombre', 'Versace'),
('Fragancia Oriental', 'Notas orientales con amaderado y especias', 149.99, 10, 'Unisex', 'Tom Ford'),
('Eau de Toilette Deportiva', 'Fresca y energética para actividades físicas', 59.99, 40, 'Hombre', 'Adidas'),
('Perfume Frutal Floral', 'Combinación de frutas tropicales y flores', 99.99, 20, 'Mujer', 'Calvin Klein');
```

#### Órdenes (Ejemplos)

```sql
-- Orden 1
INSERT INTO venta (cliente_id, cliente_nombre, total, estado) 
VALUES (3, 'Cliente 1', 219.98, 'CONFIRMED');

INSERT INTO detalle_venta (venta_id, producto_id, producto_nombre, cantidad, precio) VALUES
(1, 1, 'Eau de Parfum Premium', 1, 129.99),
(1, 2, 'Colonia Clásica Hombre', 1, 89.99);

-- Orden 2
INSERT INTO venta (cliente_id, cliente_nombre, total, estado) 
VALUES (3, 'Cliente 1', 149.99, 'PENDING');

INSERT INTO detalle_venta (venta_id, producto_id, producto_nombre, cantidad, precio) VALUES
(2, 3, 'Fragancia Oriental', 1, 149.99);
```

### Formato de Respuestas API

#### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzMjQyMDAwMCwiZXhwIjoxNjMyNTA2NDAwfQ.signature",
  "usuario": "admin",
  "rol": "ADMIN"
}
```

#### Productos List Response

```json
[
  {
    "id": 1,
    "nombre": "Eau de Parfum Premium",
    "descripcion": "Fragancia floral para mujer",
    "precio": 129.99,
    "stock": 15,
    "categoria": "Mujer",
    "marca": "Chanel"
  }
]
```

#### Orden Detail Response

```json
{
  "id": 1,
  "cliente_id": 3,
  "cliente_nombre": "Cliente 1",
  "total": 219.98,
  "estado": "CONFIRMED",
  "created_at": "2025-11-26T10:30:00",
  "detalles": [
    {
      "producto_id": 1,
      "producto_nombre": "Eau de Parfum Premium",
      "cantidad": 1,
      "precio": 129.99
    }
  ]
}
```

---

## 🎓 GUÍA DE PRESENTACIÓN - Para tu Defensa Individual

### Temas Clave a Dominar

#### 1. Integración REST API

**Pregunta posible:** "¿Cómo se comunica el frontend con el backend?"

**Respuesta:**
- El frontend usa **Axios** para hacer peticiones HTTP REST
- Base URL: `http://localhost:8080/api/v1`
- Endpoints consumidos: `/auth/login`, `/products`, `/orders`, `/users`
- Cada petición incluye header `Authorization: Bearer <token>`
- Respuestas en formato JSON

**Demostración:**
1. Abre DevTools (F12) → Network
2. Inicia sesión
3. Muestra la petición POST a `/auth/login`
4. Explica los headers y el response

#### 2. Gestión de Sesiones

**Pregunta posible:** "¿Cómo maneja la aplicación la persistencia de sesión?"

**Respuesta:**
- Usa **JWT (JSON Web Token)** para autenticación
- Backend genera token al login
- Frontend almacena token en **localStorage**
- Token persiste incluso al cerrar navegador
- Sistema valida token en cada petición
- Si token expira → redirige a login automáticamente

**Demostración:**
1. Inicia sesión
2. Abre DevTools → Console
3. Escribe: `localStorage.getItem('token')`
4. Muestra el token JWT
5. Cierra navegador y abre nuevamente
6. Muestra que sesión sigue activa

**Explicar JWT:**
- Consta de 3 partes: Header.Payload.Signature
- Contiene: usuario, rol, fecha emisión, fecha expiración
- Firmado criptográficamente para evitar alteraciones

#### 3. Control de Acceso por Roles

**Pregunta posible:** "¿Cómo implementa restricciones de acceso por rol?"

**Respuesta:**
- 3 roles: ADMIN, VENDEDOR, CLIENTE
- Restricciones en 3 niveles:
  1. **Ruta:** RoleGuard impide acceso si rol no permitido
  2. **Componente:** Botones y menús se muestran solo para roles autorizados
  3. **API:** Backend rechaza (403) si usuario no tiene permisos

**Demostración:**
1. Inicia sesión como ADMIN
   - Muestra acceso a Dashboard, Productos, Órdenes, Usuarios
2. Cierra sesión
3. Inicia sesión como VENDEDOR
   - Muestra Dashboard limitado, Productos en lectura, Sin acceso a Usuarios
4. Cierra sesión
5. Inicia sesión como CLIENTE
   - Muestra solo Tienda

#### 4. Flujo de Datos Completo

**Pregunta posible:** "¿Puedes explicar el flujo completo desde que el usuario hace click hasta que ve el dato?"

**Respuesta con Ejemplo (Crear Producto):**

1. **Usuario hace click** en "Nuevo Producto"
2. **Componente** (ProductList.jsx) abre formulario
3. **Usuario completa formulario** y hace click "Crear"
4. **Service** (productService.js) llama a `api.post('/products', data)`
5. **Axios Interceptor** añade token JWT automáticamente
6. **HTTP Request** se envía a `POST http://localhost:8080/api/v1/products`
7. **Backend recibe**, valida token y rol, guarda en BD
8. **HTTP Response** regresa con producto creado
9. **Frontend recibe**, actualiza estado de React
10. **Componente re-renderiza**, tabla se actualiza con nuevo producto
11. **Usuario ve** el producto nuevo en la tabla

**Arquitectura:**
```
Usuario (UI) → Componente → Service → Axios → Backend → BD
                ↓
              State Update
                ↓
              Re-render
```

#### 5. Seguridad Implementada

**Pregunta posible:** "¿Cómo protege la aplicación los datos?"

**Respuesta:**
- ✅ **JWT:** Token firmado impide alteración
- ✅ **CORS:** Backend rechaza peticiones de orígenes no autorizados
- ✅ **Headers:** Authorization siempre se envía
- ✅ **Validación:** Backend valida token antes de procesar
- ✅ **Redireccionamiento:** Token expirado redirige automáticamente a login
- ✅ **LocalStorage:** No es la opción más segura, pero funcional para la evaluación
- ✅ **Validación de Rol:** Backend rechaza (403) si rol no tiene permisos

**Mejora futura:** Usar httpOnly cookies en lugar de localStorage

---

### Preguntas Anticipadas y Respuestas

#### P: "¿Qué es Axios?"
**R:** Es un cliente HTTP basado en promesas. Alternativa mejorada a fetch. Ofrece:
- Interceptores (para añadir token automáticamente)
- Transformación de datos automática (JSON)
- Manejo de errores mejorado
- Timeouts configurables

#### P: "¿Por qué usaste Context API en lugar de Redux?"
**R:** Context API es:
- Más simple para este caso (solo autenticación)
- Menos boilerplate
- Suficiente para gestionar estado global de usuario
- Redux sería overkill para esta aplicación

#### P: "¿Cómo validas permisos en el frontend?"
**R:** Tengo dos funciones:
1. `hasRole(requiredRoles)` - Verifica si usuario tiene rol
2. `RoleGuard` - Componente que protege rutas

Ejemplo:
```javascript
const hasRole = (roleRequerido) => {
  const userRole = localStorage.getItem('rol');
  return userRole === roleRequerido;
};

// Uso:
{hasRole('ADMIN') && <button>Eliminar</button>}
```

#### P: "¿Qué pasa si el usuario intenta modificar el token?"
**R:** No funcionará porque:
1. JWT está firmado criptográficamente
2. Si se modifica cualquier carácter, la firma se invalida
3. Backend rechaza el token alterado (401 Unauthorized)
4. Sistema redirige a login

#### P: "¿Cómo manejas errores de red?"
**R:** Con interceptores de Axios:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado → ir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Mostrar error al usuario
    return Promise.reject(error);
  }
);
```

#### P: "¿Por qué 3 roles y no más?"
**R:** Porque cumplen los requisitos de la evaluación:
- ADMIN: Acceso total
- VENDEDOR: Acceso limitado
- CLIENTE: Acceso muy restringido

Es fácil agregar más roles en el futuro sin cambiar la arquitectura.

#### P: "¿Cómo probaste tu código?"
**R:** Pruebas manuales:
1. Login con cada rol
2. Navegar por todas las páginas
3. Verificar que aparecen/desaparecen menús según rol
4. Verificar que endpoint 403 al intentar operación sin permisos
5. Verificar persistencia al recargar página
6. Verificar token se envía en cada petición (DevTools → Network)
7. Verificar logout limpia sesión

#### P: "¿Qué mejorarías si tuvieras más tiempo?"
**R:**
- Implementar refresh token (renovar JWT sin volver a loguear)
- Cambiar localStorage a httpOnly cookies
- Agregar tests unitarios (Jest, React Testing Library)
- Agregar paginación en tablas grandes
- Implementar WebSockets para actualizaciones en tiempo real
- Mejorar estilos con Tailwind CSS
- Agregar validación de formularios en cliente
- Implementar caché para reducir peticiones

---

### Estructura de Presentación Recomendada

**Tiempo: 10-15 minutos**

1. **Introducción** (1 min)
   - Qué es el proyecto
   - Qué tecnologías usé

2. **Demostración Funcional** (5 min)
   - Mostrar los 3 roles funcionando
   - Demostrar crear/editar/eliminar producto
   - Demostrar compra en tienda

3. **Explicación Técnica** (7 min)
   - Arquitectura general
   - Flujo de autenticación
   - Cómo se validan permisos
   - Cómo persiste la sesión

4. **Preguntas** (2 min)
   - Estar listo para preguntas técnicas

---

### Checklist de Preparación

- [ ] Práctica completa del funcionamiento
- [ ] Memoriza estructura de carpetas
- [ ] Entiende flujo completo de datos
- [ ] Memoriza principales funciones
- [ ] Prepara respuestas a preguntas comunes
- [ ] Prueba DevTools (Network tab)
- [ ] Prueba localStorage y tokens
- [ ] Verifica CORS funciona
- [ ] Backend y Frontend funcionan juntos
- [ ] Tienes usuarios de prueba listos

---

## 🎨 Patrones de Diseño Implementados

### 1. Protected Route Pattern
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
Verifica autenticación antes de renderizar

### 2. Role Guard Pattern
```javascript
<RoleGuard allowedRoles={['ADMIN']}>
  <UserManagement />
</RoleGuard>
```
Verifica rol antes de renderizar

### 3. Context API Pattern
```javascript
const { user, login, logout } = useAuth();
```
Estado global sin Redux

### 4. Interceptor Pattern
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
Inyecta token automáticamente

---

## 📱 Responsive Design

La aplicación es **responsive** y funciona en:
- 💻 Escritorio (1920x1080)
- 📱 Tablet (768x1024)
- 📱 Móvil (375x667)

Usa CSS Grid y Flexbox para adaptarse.

---

## 🔄 Ciclo de Vida de Componente (Ejemplo: ProductList)

1. **Mount:** Componente se carga
2. **Effect:** Fetch productos del backend
3. **State:** Se actualizan productos en state
4. **Render:** Tabla se renderiza con productos
5. **Usuario acción:** Click en botón editar
6. **State Update:** Datos del formulario se guardan
7. **Effect:** Petición PUT al backend
8. **Re-render:** Tabla se actualiza

---

## 🎯 Conclusión

El frontend implementa correctamente:
- ✅ **Integración REST** eficiente
- ✅ **Gestión de Sesiones** segura y persistente
- ✅ **Control de Acceso** completo por roles
- ✅ **Arquitectura escalable** para futuras mejoras

Todo listo para evaluar.

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Evaluación Parcial N° 3**

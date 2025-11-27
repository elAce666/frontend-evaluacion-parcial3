# Manual de Usuario - Sistema de Gestión

## 📘 Guía Completa de Uso

---

## Índice

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Roles y Permisos](#roles-y-permisos)
4. [Guía por Rol](#guía-por-rol)
   - [Administrador](#administrador)
   - [Vendedor](#vendedor)
   - [Cliente](#cliente)
5. [Funcionalidades Detalladas](#funcionalidades-detalladas)
6. [Preguntas Frecuentes](#preguntas-frecuentes)
7. [Resolución de Problemas](#resolución-de-problemas)

---

## Introducción

Bienvenido al **Sistema de Gestión**, una aplicación web desarrollada con React que implementa control de acceso basado en roles y gestión de sesiones segura mediante JWT (JSON Web Tokens).

### Características Principales

✅ **Autenticación Segura**: Login con JWT y persistencia de sesión
✅ **Control de Acceso por Roles**: Restricciones específicas según rol
✅ **Gestión de Productos**: CRUD completo (solo Admin)
✅ **Gestión de Órdenes**: Visualización y creación
✅ **Gestión de Usuarios**: Administración completa (solo Admin)
✅ **Tienda en Línea**: Compra de productos (Cliente)

---

## Acceso al Sistema

### 1. Abrir la Aplicación

1. Abrir el navegador web (Chrome, Firefox, Edge)
2. Navegar a: `http://localhost:3000`
3. Aparecerá la pantalla de login

![Pantalla de Login](pantallazos/01-login.png)

### 2. Iniciar Sesión

**Credenciales de Prueba:**

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| cliente | cliente123 | Cliente |

**Pasos:**

1. Ingresar **Usuario** en el primer campo
2. Ingresar **Contraseña** en el segundo campo
3. Hacer clic en el botón **"Iniciar Sesión"**
4. El sistema validará las credenciales
5. Si son correctas, redirigirá automáticamente según el rol

![Proceso de Login](pantallazos/02-login-proceso.png)

### 3. Cerrar Sesión

1. En la barra de navegación superior, ubicar el botón **"Salir"** 🚪
2. Hacer clic en el botón
3. Confirmar el cierre de sesión
4. El sistema limpiará la sesión y redirigirá al login

![Cerrar Sesión](pantallazos/03-logout.png)

---

## Roles y Permisos

### Matriz de Permisos

| Funcionalidad | Admin | Vendedor | Cliente |
|---------------|-------|----------|---------|
| **Dashboard** | ✅ Ver estadísticas completas | ✅ Ver estadísticas limitadas | ❌ No accede |
| **Productos - Ver** | ✅ | ✅ Solo lectura | ❌ |
| **Productos - Crear** | ✅ | ❌ | ❌ |
| **Productos - Editar** | ✅ | ❌ | ❌ |
| **Productos - Eliminar** | ✅ | ❌ | ❌ |
| **Órdenes - Ver** | ✅ | ✅ Solo lectura | ❌ |
| **Órdenes - Crear** | ✅ | ❌ | ✅ (En tienda) |
| **Órdenes - Editar** | ✅ | ❌ | ❌ |
| **Usuarios - Gestionar** | ✅ | ❌ | ❌ |
| **Tienda - Acceso** | ✅ | ❌ | ✅ |
| **Tienda - Comprar** | ✅ | ❌ | ✅ |

---

## Guía por Rol

### Administrador

El **Administrador** tiene acceso completo a todas las funcionalidades del sistema.

#### Dashboard

Al iniciar sesión, verás el Dashboard con estadísticas:

![Dashboard Administrador](pantallazos/04-dashboard-admin.png)

**Información mostrada:**
- 📦 Total de productos
- 📋 Total de órdenes
- 👥 Total de usuarios

#### Gestión de Productos

**Acceso:** Menú > Productos

![Lista de Productos](pantallazos/05-productos-lista.png)

**Crear Producto:**

1. Clic en botón **"+ Nuevo Producto"**
2. Completar formulario:
   - Nombre del producto
   - Descripción
   - Precio
   - Stock
   - Categoría
3. Clic en **"Crear"**

![Crear Producto](pantallazos/06-productos-crear.png)

**Editar Producto:**

1. En la tabla, clic en el botón ✏️ del producto
2. Modificar los campos necesarios
3. Clic en **"Actualizar"**

![Editar Producto](pantallazos/07-productos-editar.png)

**Eliminar Producto:**

1. En la tabla, clic en el botón 🗑️ del producto
2. Confirmar eliminación
3. El producto se eliminará permanentemente

![Eliminar Producto](pantallazos/08-productos-eliminar.png)

#### Gestión de Órdenes

**Acceso:** Menú > Órdenes

![Lista de Órdenes](pantallazos/09-ordenes-lista.png)

**Ver Detalle:**

1. Clic en el botón **"👁️ Ver"** de una orden
2. Se mostrará modal con:
   - Información del cliente
   - Fecha de la orden
   - Estado
   - Detalle de productos
   - Total

![Detalle de Orden](pantallazos/10-ordenes-detalle.png)

#### Gestión de Usuarios

**Acceso:** Menú > Usuarios

![Lista de Usuarios](pantallazos/11-usuarios-lista.png)

**Crear Usuario:**

1. Clic en **"+ Nuevo Usuario"**
2. Completar:
   - Usuario (único)
   - Contraseña
   - Nombre
   - Email
   - Rol
3. Clic en **"Crear"**

![Crear Usuario](pantallazos/12-usuarios-crear.png)

**Editar Usuario:**

1. Clic en ✏️ del usuario
2. Modificar campos
3. Clic en **"Actualizar"**

**Cambiar Rol:**

1. Clic en 🔄 del usuario
2. Ingresar nuevo rol (ADMIN, VENDEDOR, CLIENTE)
3. Confirmar

![Cambiar Rol](pantallazos/13-usuarios-rol.png)

**Eliminar Usuario:**

1. Clic en 🗑️ del usuario
2. Confirmar eliminación

---

### Vendedor

El **Vendedor** puede visualizar productos y órdenes en modo **solo lectura**.

#### Dashboard

Muestra estadísticas de productos y órdenes disponibles.

![Dashboard Vendedor](pantallazos/14-dashboard-vendedor.png)

**Nota:** Mensaje informativo indica modo solo lectura.

#### Ver Productos

**Acceso:** Menú > Productos

![Productos Vendedor](pantallazos/15-productos-vendedor.png)

**Características:**
- ✅ Puede ver todos los productos
- ❌ No puede crear nuevos
- ❌ No puede editar
- ❌ No puede eliminar

**Mensaje mostrado:**
> ℹ️ Estás viendo los productos en modo **solo lectura**

#### Ver Órdenes

**Acceso:** Menú > Órdenes

![Órdenes Vendedor](pantallazos/16-ordenes-vendedor.png)

**Características:**
- ✅ Puede ver todas las órdenes
- ✅ Puede ver detalles de cada orden
- ❌ No puede modificar estados
- ❌ No puede eliminar

**Ver Detalle:**

1. Clic en **"👁️ Ver"**
2. Visualizar información completa

![Detalle Orden Vendedor](pantallazos/17-ordenes-detalle-vendedor.png)

#### Restricciones

El vendedor **NO** puede acceder a:
- ❌ Gestión de Usuarios
- ❌ Tienda
- ❌ Creación/edición de productos
- ❌ Reportes

Si intenta acceder, verá:

![Acceso Denegado](pantallazos/18-acceso-denegado.png)

---

### Cliente

El **Cliente** solo puede acceder a la **Tienda** para realizar compras.

#### Acceso Directo a Tienda

Al iniciar sesión, el cliente es redirigido automáticamente a la Tienda.

![Tienda Cliente](pantallazos/19-tienda-cliente.png)

#### Explorar Productos

**Vista de Productos:**

Cada producto muestra:
- 📦 Icono visual
- Nombre del producto
- Descripción
- Precio
- Stock disponible
- Botón **"Agregar al Carrito"**

![Productos Tienda](pantallazos/20-tienda-productos.png)

#### Agregar al Carrito

1. Ubicar el producto deseado
2. Clic en **"Agregar al Carrito"**
3. El producto se agrega al carrito
4. El contador del carrito se actualiza

![Agregar Carrito](pantallazos/21-agregar-carrito.png)

#### Ver Carrito

1. Clic en botón **"🛒 Carrito (X)"** en la parte superior
2. Se abre panel lateral con:
   - Lista de productos agregados
   - Cantidad de cada producto
   - Subtotales
   - Total general

![Ver Carrito](pantallazos/22-ver-carrito.png)

#### Gestionar Carrito

**Aumentar Cantidad:**
- Clic en botón **+**

**Disminuir Cantidad:**
- Clic en botón **-**

**Eliminar Producto:**
- Clic en botón 🗑️

![Gestionar Carrito](pantallazos/23-gestionar-carrito.png)

#### Finalizar Compra

1. Revisar productos y total
2. Clic en **"Finalizar Compra"**
3. Confirmar la compra
4. Sistema procesa la orden
5. Mensaje de confirmación:
   > ¡Compra realizada exitosamente! 🎉

![Finalizar Compra](pantallazos/24-finalizar-compra.png)

6. El carrito se vacía automáticamente

#### Restricciones del Cliente

El cliente **NO** puede acceder a:
- ❌ Dashboard
- ❌ Gestión de Productos
- ❌ Gestión de Órdenes
- ❌ Gestión de Usuarios

Si intenta acceder, verá mensaje de acceso denegado.

![Cliente Acceso Denegado](pantallazos/25-cliente-denegado.png)

---

## Funcionalidades Detalladas

### Sistema de Autenticación

#### Login

- **Validación de Credenciales**: El backend verifica usuario y contraseña
- **Generación de Token JWT**: Si es correcto, genera token
- **Almacenamiento Seguro**: Token se guarda en localStorage
- **Persistencia**: La sesión persiste incluso al recargar la página

#### Protección de Rutas

Todas las rutas excepto `/login` están protegidas:

```
Usuario no autenticado → Redirige a /login
Usuario autenticado → Accede según permisos de rol
```

#### Validación Automática

El sistema valida constantemente:
- ✅ Token válido
- ✅ Token no expirado
- ✅ Rol tiene permisos

Si falla alguna validación → Cierra sesión automáticamente

### Gestión de Sesiones

#### Persistencia

**Comportamiento:**
1. Usuario inicia sesión
2. Token se guarda en localStorage
3. Usuario cierra navegador
4. Usuario abre navegador nuevamente
5. **Sesión sigue activa** (si token no expiró)

#### Expiración

Si el token JWT expira:
1. Sistema detecta token inválido
2. Muestra mensaje: "Tu sesión ha expirado"
3. Limpia datos de localStorage
4. Redirige al login

#### Seguridad

- Token se envía en **cada petición** al backend
- Header: `Authorization: Bearer <token>`
- Backend valida el token antes de responder
- Si es inválido → Error 401 Unauthorized

### Control de Acceso por Roles

#### Restricción a Nivel de Ruta

**Ejemplo: Ruta /users (Gestión de Usuarios)**

```javascript
Solo permitido: ADMIN
Si Vendedor intenta acceder → Redirige a /dashboard
Si Cliente intenta acceder → Redirige a /store
```

#### Restricción a Nivel de Componente

**Ejemplo: Botón "Crear Producto"**

```javascript
if (rol === 'ADMIN') → Muestra botón
if (rol === 'VENDEDOR') → Oculta botón
```

#### Restricción a Nivel de API

Incluso si alguien intenta acceder directamente a la API:

```javascript
POST /api/products
Header: Authorization: Bearer <token-de-vendedor>
Backend: Error 403 Forbidden
```

---

## Preguntas Frecuentes

### ¿Qué hago si olvidé mi contraseña?

Contacta al **Administrador** del sistema para que restablezca tu contraseña.

### ¿Por qué no veo el menú completo?

El menú se muestra según tu **rol**. Si eres Vendedor o Cliente, no verás todas las opciones que ve un Administrador.

### ¿Puedo cambiar mi propio rol?

No. Solo el **Administrador** puede cambiar roles de usuarios.

### ¿Cuánto tiempo dura mi sesión?

La sesión dura mientras el **token JWT sea válido** (normalmente 24 horas, depende de la configuración del backend).

### ¿Qué pasa si intento acceder a una ruta sin permisos?

El sistema te redirigirá automáticamente a tu página principal según tu rol, o mostrará un mensaje de "Acceso Denegado".

### ¿Los cambios se guardan en tiempo real?

Sí. Todos los cambios (crear, editar, eliminar) se envían inmediatamente al backend y se reflejan en la interfaz.

### ¿Puedo usar el sistema desde mi móvil?

Sí. La interfaz es **responsive** y se adapta a dispositivos móviles.

---

## Resolución de Problemas

### Problema: No puedo iniciar sesión

**Síntoma:** Mensaje "Credenciales inválidas"

**Soluciones:**
1. Verificar que usuario y contraseña sean correctos
2. Revisar que no haya espacios extra
3. Verificar mayúsculas/minúsculas
4. Contactar al administrador

### Problema: La página no carga

**Síntoma:** Página en blanco o error de conexión

**Soluciones:**
1. Verificar que el backend esté ejecutándose (puerto 8080)
2. Verificar que el frontend esté ejecutándose (puerto 3000)
3. Revisar la consola del navegador (F12) para errores
4. Limpiar caché del navegador

### Problema: Mi sesión se cierra sola

**Síntoma:** Redirige al login sin motivo

**Soluciones:**
1. Token JWT expiró (normal después de cierto tiempo)
2. Backend no está respondiendo
3. Token fue invalidado
4. Iniciar sesión nuevamente

### Problema: No veo los productos/órdenes

**Síntoma:** Tabla vacía

**Soluciones:**
1. Verificar conexión con el backend
2. Verificar que haya datos en la base de datos
3. Revisar permisos de tu rol
4. Recargar la página (F5)

### Problema: Error al crear/editar

**Síntoma:** Mensaje de error al guardar

**Soluciones:**
1. Verificar que todos los campos requeridos estén completos
2. Verificar formato de datos (precio debe ser número, etc.)
3. Verificar que tengas permisos (solo Admin puede crear/editar)
4. Revisar mensaje de error específico

### Problema: El carrito no funciona

**Síntoma:** No puedo agregar productos

**Soluciones:**
1. Verificar que haya stock disponible
2. Recargar la página
3. Limpiar caché del navegador
4. Verificar que no haya errores en consola (F12)

---

## Soporte Técnico

Para asistencia adicional:

- **Email:** soporte@sistema-gestion.com
- **Documentación Técnica:** Ver archivo `API_INTEGRACION.md`
- **Repositorio:** [GitHub](https://github.com/tu-usuario/frontend-evaluacion-parcial3)

---

**Versión del Manual:** 1.0  
**Fecha:** Noviembre 2025  
**Desarrollado para:** Evaluación Parcial N° 3

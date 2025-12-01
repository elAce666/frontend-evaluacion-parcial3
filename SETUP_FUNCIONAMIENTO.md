# Setup y Funcionamiento - Sistema de Gestión con Control de Acceso

## 🎯 Inicio Rápido (5 minutos)

```powershell
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir navegador
# http://localhost:3000
```

**Credenciales de Prueba:**
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| cliente | cliente123 | Cliente |

---

## 📋 Descripción del Proyecto

Frontend React + Vite que implementa:
- ✅ **Integración REST** con API backend (Spring Boot)
- ✅ **Gestión de Sesiones** persistente con JWT
- ✅ **Control de Acceso** basado en 3 roles
- ✅ **CRUD completo** de productos, órdenes y usuarios

---

## 🔧 Requisitos Previos

1. **Node.js** v16+ y npm
2. **Backend** ejecutándose en `http://localhost:8080`
3. Base de datos con usuarios y productos

---

## ⚙️ Instalación Completa

### 1. Instalar Dependencias
```powershell
cd frontend-evaluacion-parcial3
npm install
```

**Dependencias principales:**
- React 18
- React Router DOM
- Axios (cliente HTTP)
- Vite (build tool)

### 2. Configurar URL del Backend

**Archivo:** `.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

⚠️ **IMPORTANTE:** Si cambias `.env`, reinicia el servidor con `npm run dev`

### 3. Ejecutar Servidor de Desarrollo

```powershell
npm run dev
```

**Output esperado:**
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

---

## 🚀 Scripts Disponibles

```powershell
npm run dev       # Ejecutar en desarrollo
npm run build     # Construir para producción
npm run preview   # Ver build de producción
npm run lint      # Ejecutar linter
```

---

## 🔐 Autenticación y Gestión de Sesiones

### Flujo de Login

1. **Usuario ingresa credenciales** → Login.jsx
2. **Frontend envía POST** a `/api/v1/auth/login`
3. **Backend valida** y devuelve: `{token, usuario, rol}`
4. **Frontend guarda** token en localStorage
5. **Todas las peticiones** incluyen: `Authorization: Bearer <token>`
6. **Redirige según rol** (admin → dashboard, cliente → tienda, etc.)

### JWT Token Management

```javascript
// Guardado automático
localStorage.setItem('token', response.data.token);

// Envío automático en cada petición
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Limpieza al logout
localStorage.removeItem('token');
```

### Persistencia de Sesión

- Token persiste al cerrar navegador
- Sistema valida token al recargar página
- Si token expira → redirige a login automáticamente

---

## 🛡️ Control de Acceso por Roles

### Matriz de Permisos

| Funcionalidad | Admin | Vendedor | Cliente |
|---------------|-------|----------|---------|
| **Dashboard** | ✅ Completo | ✅ Limitado | ❌ |
| **Productos - Ver** | ✅ | ✅ Solo lectura | ❌ |
| **Productos - CRUD** | ✅ | ❌ | ❌ |
| **Órdenes - Ver** | ✅ | ✅ Solo lectura | ❌ |
| **Órdenes - Crear** | ✅ | ❌ | ✅ (Tienda) |
| **Usuarios - CRUD** | ✅ | ❌ | ❌ |
| **Tienda** | ✅ | ❌ | ✅ |

### Niveles de Restricción

**1. Nivel de Ruta** (RoleGuard)
```javascript
<RoleGuard allowedRoles={['ADMIN']}>
  <UserManagement />
</RoleGuard>
```

**2. Nivel de Componente** (condicionales)
```javascript
{user.role === 'ADMIN' && <button>Eliminar</button>}
```

**3. Nivel de API** (el backend rechaza 403)
```javascript
DELETE /api/v1/productos/1
// Si no eres ADMIN → 403 Forbidden
```

---

## 🌐 Integración REST - Endpoints Consumidos

### Autenticación
```
POST /api/v1/auth/login
  Body: { username, password }
  Response: { token, usuario, rol }

POST /api/v1/auth/logout
  Headers: Authorization: Bearer <token>
```

### Productos (Perfumes)
```
GET    /api/v1/products              # Listar
GET    /api/v1/products/{id}         # Detalle
POST   /api/v1/products              # Crear (ADMIN)
PUT    /api/v1/products/{id}         # Editar (ADMIN)
DELETE /api/v1/products/{id}         # Eliminar (ADMIN)

GET    /api/v1/categorias            # Filtros
GET    /api/v1/marcas                # Filtros
```

### Órdenes
```
GET    /api/v1/orders                # Listar
GET    /api/v1/orders/{id}           # Detalle
POST   /api/v1/orders                # Crear
PUT    /api/v1/orders/{id}           # Editar (ADMIN)
DELETE /api/v1/orders/{id}           # Eliminar (ADMIN)
GET    /api/v1/orders/{id}/details   # Líneas
```

### Usuarios
```
GET    /api/v1/users                 # Listar (ADMIN)
GET    /api/v1/users/{username}      # Obtener (ADMIN)
POST   /api/v1/users                 # Crear (ADMIN)
PUT    /api/v1/users/{id}            # Editar (ADMIN)
DELETE /api/v1/users/{id}            # Eliminar (ADMIN)
PATCH  /api/v1/users/{id}/role       # Cambiar rol (ADMIN)
```

---

## 📁 Estructura del Proyecto

```
frontend-evaluacion-parcial3/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx      # Protección de rutas
│   │   ├── RoleGuard.jsx           # Control de roles
│   │   └── Navbar.jsx              # Navegación
│   │
│   ├── pages/
│   │   ├── Login.jsx               # Autenticación
│   │   ├── Dashboard.jsx           # Panel principal
│   │   ├── ProductList.jsx         # Gestión productos
│   │   ├── OrderList.jsx           # Gestión órdenes
│   │   ├── UserManagement.jsx      # Gestión usuarios
│   │   └── Store.jsx               # Tienda cliente
│   │
│   ├── services/
│   │   ├── api.js                  # Axios + Interceptores
│   │   ├── authService.js          # Auth endpoints
│   │   ├── productService.js       # Products endpoints
│   │   ├── orderService.js         # Orders endpoints
│   │   └── userService.js          # Users endpoints
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Estado global auth
│   │
│   ├── utils/
│   │   ├── constants.js            # Constantes
│   │   └── roleValidator.js        # Validación roles
│   │
│   ├── styles/
│   │   └── App.css                 # Estilos
│   │
│   ├── App.jsx                     # Rutas principales
│   └── main.jsx                    # Entrada
│
├── .env                            # Configuración
├── .env.example                    # Plantilla
├── package.json
├── vite.config.js
└── index.html
```

---

## 🔧 Configuración Requerida en Backend

### CORS Habilitado

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### JWT en Spring Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/logout").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Usuarios de Prueba (en Base de Datos)

```sql
INSERT INTO usuario (usuario, password, nombre, email, rol) VALUES
('admin', '$2a$10$...hashed...', 'Administrador', 'admin@example.com', 'ADMIN'),
('vendedor', '$2a$10$...hashed...', 'Vendedor 1', 'vendedor@example.com', 'VENDEDOR'),
('cliente', '$2a$10$...hashed...', 'Cliente 1', 'cliente@example.com', 'CLIENTE');

-- Contraseñas sin encriptar: admin123, vendedor123, cliente123
```

---

## 🧪 Pruebas de Funcionalidad

### 1. Verificar Backend está Activo
```powershell
# En otra terminal, verifica que el backend responda:
curl http://localhost:8080/api/v1/auth/login -X POST `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Respuesta esperada: { "token": "...", "usuario": "admin", "rol": "ADMIN" }
```

### 2. Verificar CORS
Abre DevTools (F12) → Network → Intenta login
- Verifica que la petición sea a `http://localhost:8080/api/v1/auth/login`
- Status debe ser 200 (éxito) o 401 (credenciales inválidas)
- No debe haber error de CORS

### 3. Prueba de Login Completo
1. Ir a `http://localhost:3000`
2. Ingresar `admin` / `admin123`
3. Debes ser redirigido a `/dashboard`
4. Abrir DevTools → localStorage
5. Debes ver `token` guardado

### 4. Prueba de Roles
**Admin:**
- Acceso a Dashboard, Productos, Órdenes, Usuarios

**Vendedor:**
- Acceso a Dashboard (limitado), Productos (lectura), Órdenes (lectura)

**Cliente:**
- Acceso SOLO a la Tienda

---

## 🐛 Troubleshooting

### "Failed to fetch" o "Network Error"

**Causa:** Backend no está corriendo o está en puerto diferente

**Solución:**
```powershell
# 1. Verificar que backend esté en puerto 8080
# 2. Desde terminal del backend, deberías ver:
#    "Tomcat started on port 8080"

# 3. Prueba conectar manualmente:
curl http://localhost:8080/api/v1/products -H "Authorization: Bearer test"
```

### "404 Not Found" en `/auth/login`

**Causa:** URL base incorrecta en `.env`

**Solución:**
```powershell
# 1. Verifica .env:
cat .env | findstr "VITE_API_BASE_URL"

# 2. Debe mostrar:
# VITE_API_BASE_URL=http://localhost:8080/api/v1

# 3. Reinicia el servidor (Ctrl+C y npm run dev)
```

### "401 Unauthorized" en endpoints protegidos

**Causa:** Token no válido o no se está enviando

**Solución:**
```powershell
# 1. Abre DevTools (F12)
# 2. Pestaña Network → haz una acción (ej: ver productos)
# 3. Click en la petición
# 4. Headers → Authorization debe mostrar:
#    Authorization: Bearer eyJhbGciOiJIUzI1NiI...

# 5. Si no está → el interceptor de Axios no funciona
# 6. Verifica src/services/api.js está correctamente configurado
```

### Token expirado automáticamente

**Causa:** JWT expiró (normal después de cierto tiempo)

**Solución:**
```javascript
// El interceptor redirige automáticamente a /login
// Mensaje: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."

// Para probar con tokens largos, aumenta en backend:
// jwtUtil.setExpirationTime(86400000); // 24 horas
```

### Los cambios de `.env` no se aplican

**Causa:** Vite solo lee `.env` al iniciar

**Solución:**
```powershell
# 1. Detener servidor (Ctrl+C)
# 2. Eliminar caché de vite:
rm -r node_modules/.vite

# 3. Reiniciar:
npm run dev
```

---

## 📊 Validaciones Recomendadas en Backend

### Productos
- `nombre`: Requerido, máximo 200 caracteres
- `precio`: Requerido, > 0
- `stock`: >= 0

### Usuarios
- `usuario`: Requerido, único, mínimo 3 caracteres
- `password`: Requerido, mínimo 6 caracteres
- `rol`: Uno de: `ADMIN`, `VENDEDOR`, `CLIENTE`

### Órdenes
- `cliente_id`: Requerido
- `items`: Al menos 1 item
- `total`: Calculado automáticamente

---

## 📚 Documentación Adicional

- **Manual de Usuario:** Ver `REFERENCIA_USUARIO.md` - Guía completa de uso
- **Datos de Ejemplo:** Ver `REFERENCIA_USUARIO.md` - Estructura de datos
- **Guía de Presentación:** Ver `REFERENCIA_USUARIO.md` - Preguntas anticipadas

---

## 🎯 Checklist de Configuración

- [ ] Backend corriendo en `http://localhost:8080`
- [ ] `.env` actualizado con `VITE_API_BASE_URL=http://localhost:8080/api/v1`
- [ ] `npm install` ejecutado
- [ ] `npm run dev` ejecutado
- [ ] Frontend accesible en `http://localhost:3000`
- [ ] Login funciona con credenciales de prueba
- [ ] Token se guarda en localStorage
- [ ] CORS configurado en backend
- [ ] Todos los 3 usuarios pueden loguear
- [ ] Redireccionamiento por rol funciona

---

## 🚀 Próximos Pasos

### 1. Prueba Completa de Integración
```powershell
# Terminal 1: Backend
cd BackendFullstack
./mvnw spring-boot:run

# Terminal 2: Frontend
cd frontend-evaluacion-parcial3
npm run dev

# Terminal 3: Navegador
# http://localhost:3000
```

### 2. Valida Todas las Funcionalidades
- Login con cada rol
- Crear, editar, eliminar productos (Admin)
- Ver órdenes (Admin y Vendedor)
- Comprar en tienda (Cliente)
- Cambiar rol de usuario (Admin)

### 3. Construir para Producción
```powershell
npm run build
# Archivos optimizados en carpeta dist/
```

---

## 📞 Contacto con Backend

Preguntas para coordinar con el equipo backend:

1. ¿Está el servidor en puerto 8080?
2. ¿CORS configurado para `http://localhost:3000`?
3. ¿Endpoint es `/api/v1/auth/login`?
4. ¿Respuesta login es `{token, usuario, rol}`?
5. ¿Los 3 usuarios de prueba existen?

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Evaluación Parcial N° 3**

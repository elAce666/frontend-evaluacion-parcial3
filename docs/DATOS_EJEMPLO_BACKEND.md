# Datos de Ejemplo para el Backend

Este archivo contiene datos de ejemplo que tu backend debe tener para que el frontend funcione correctamente.

## Usuarios

```sql
-- Administrador
INSERT INTO users (username, password, name, email, role) 
VALUES ('admin', '$2a$10$...', 'Administrador', 'admin@example.com', 'ADMIN');

-- Vendedor
INSERT INTO users (username, password, name, email, role) 
VALUES ('vendedor', '$2a$10$...', 'Vendedor 1', 'vendedor@example.com', 'VENDEDOR');

-- Cliente
INSERT INTO users (username, password, name, email, role) 
VALUES ('cliente', '$2a$10$...', 'Cliente 1', 'cliente@example.com', 'CLIENTE');
```

**Contraseñas sin encriptar:**
- admin: `admin123`
- vendedor: `vendedor123`
- cliente: `cliente123`

## Productos

```sql
INSERT INTO products (name, description, price, stock, category) VALUES
('Laptop Dell Latitude', 'Laptop empresarial de alto rendimiento con Intel i7', 1299.99, 15, 'Electrónica'),
('Mouse Logitech MX Master', 'Mouse inalámbrico ergonómico para productividad', 99.99, 50, 'Accesorios'),
('Teclado Mecánico Corsair', 'Teclado mecánico RGB para gaming y programación', 149.99, 30, 'Accesorios'),
('Monitor LG UltraWide 34"', 'Monitor ultrawide IPS de 34 pulgadas', 599.99, 10, 'Electrónica'),
('Webcam Logitech C920', 'Webcam Full HD 1080p para videoconferencias', 79.99, 25, 'Accesorios'),
('Audífonos Sony WH-1000XM5', 'Audífonos inalámbricos con cancelación de ruido', 349.99, 20, 'Electrónica'),
('Disco SSD Samsung 1TB', 'SSD NVMe M.2 de 1TB de alta velocidad', 129.99, 40, 'Componentes'),
('Mochila Targus para Laptop', 'Mochila ergonómica para laptop de hasta 17"', 49.99, 60, 'Accesorios'),
('Hub USB-C 7 en 1', 'Hub multipuerto con HDMI, USB-A y USB-C', 39.99, 45, 'Accesorios'),
('Lámpara LED de Escritorio', 'Lámpara LED regulable con carga inalámbrica', 34.99, 35, 'Oficina');
```

## Órdenes (Ejemplos)

```sql
-- Orden 1
INSERT INTO orders (customer_id, customer_name, total, status, created_at) 
VALUES (3, 'Cliente 1', 1399.98, 'CONFIRMED', '2025-11-26 10:30:00');

INSERT INTO order_details (order_id, product_id, product_name, quantity, price) VALUES
(1, 1, 'Laptop Dell Latitude', 1, 1299.99),
(1, 2, 'Mouse Logitech MX Master', 1, 99.99);

-- Orden 2
INSERT INTO orders (customer_id, customer_name, total, status, created_at) 
VALUES (3, 'Cliente 1', 149.99, 'PENDING', '2025-11-26 14:15:00');

INSERT INTO order_details (order_id, product_id, product_name, quantity, price) VALUES
(2, 3, 'Teclado Mecánico Corsair', 1, 149.99);

-- Orden 3
INSERT INTO orders (customer_id, customer_name, total, status, created_at) 
VALUES (3, 'Cliente 1', 679.98, 'PROCESSING', '2025-11-25 09:20:00');

INSERT INTO order_details (order_id, product_id, product_name, quantity, price) VALUES
(3, 4, 'Monitor LG UltraWide 34"', 1, 599.99),
(3, 5, 'Webcam Logitech C920', 1, 79.99);
```

## Estructura de Tablas Esperada

### Tabla: users

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: products

```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: orders

```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);
```

### Tabla: order_details

```sql
CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## JSON de Ejemplo para Respuestas

### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzMjQyMDAwMCwiZXhwIjoxNjMyNTA2NDAwfQ.signature",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Products List Response

```json
[
  {
    "id": 1,
    "name": "Laptop Dell Latitude",
    "description": "Laptop empresarial de alto rendimiento con Intel i7",
    "price": 1299.99,
    "stock": 15,
    "category": "Electrónica"
  },
  {
    "id": 2,
    "name": "Mouse Logitech MX Master",
    "description": "Mouse inalámbrico ergonómico para productividad",
    "price": 99.99,
    "stock": 50,
    "category": "Accesorios"
  }
]
```

### Order Details Response

```json
{
  "id": 1,
  "customerId": 3,
  "customerName": "Cliente 1",
  "total": 1399.98,
  "status": "CONFIRMED",
  "createdAt": "2025-11-26T10:30:00",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop Dell Latitude",
      "quantity": 1,
      "price": 1299.99
    },
    {
      "productId": 2,
      "productName": "Mouse Logitech MX Master",
      "quantity": 1,
      "price": 99.99
    }
  ]
}
```

## Estados de Órdenes

El backend debe soportar estos estados:

- `PENDING` - Pendiente
- `CONFIRMED` - Confirmada
- `PROCESSING` - En proceso
- `SHIPPED` - Enviada
- `DELIVERED` - Entregada
- `CANCELLED` - Cancelada

## Roles Soportados

El backend debe reconocer estos roles:

- `ADMIN` o `ADMINISTRADOR`
- `VENDEDOR`
- `CLIENTE`

## Validaciones Recomendadas

### Productos
- `name`: Requerido, máximo 200 caracteres
- `price`: Requerido, mayor a 0
- `stock`: Requerido, mayor o igual a 0

### Usuarios
- `username`: Requerido, único, mínimo 3 caracteres
- `password`: Requerido, mínimo 6 caracteres
- `role`: Requerido, debe ser uno de los roles válidos

### Órdenes
- `customerId`: Requerido
- `items`: Requerido, al menos 1 item
- `total`: Calculado automáticamente

---

Este archivo está diseñado para ayudar a tu equipo de backend a tener datos de prueba consistentes con el frontend.

# 🖥️ Backend WardenPet - API REST

Servidor Express.js con autenticación JWT y conectado a PostgreSQL.

---

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- PostgreSQL corriendo (en Docker)

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd Backend
npm install
```

### 2. Configurar `.env`
```bash
# Backend/.env

DB_HOST=127.0.0.1
DB_PORT=5433
DB_USER=wardenpet_user
DB_PASSWORD=wardenpet_secure_pass
DB_NAME=wardenpet_db

PORT=3001
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### 3. Ejecutar servidor
```bash
npm run dev
```

Debería ver:
```
✅ Base de datos conectada correctamente
Timestamp del servidor: ...
🚀 Servidor escuchando en puerto 3001
```

---

## 📁 Estructura

```
Backend/
├── index.js                  ← Punto de entrada
├── package.json
├── .env                      ← Variables de entorno
│
├── config/
│   ├── database.js          ← Conexión a PostgreSQL
│   └── initDB.js            ← Verificación de conexión
│
├── controllers/             ← Lógica de negocio
│   ├── auth.controller.js
│   ├── pets.controller.js
│   ├── reminders.controller.js
│   ├── healthRecords.controller.js
│   ├── routines.controller.js
│   └── users.controller.js
│
├── routes/                  ← Endpoints
│   ├── auth.routes.js
│   ├── pets.routes.js
│   ├── reminders.routes.js
│   ├── healthRecords.routes.js
│   ├── routines.routes.js
│   └── users.routes.js
│
└── middlewares/
    └── auth.middleware.js   ← JWT, autenticación
```

---

## 🔌 API Endpoints

### Autenticación
```bash
# Registrar usuario
POST /api/auth/register
Content-Type: application/json

{
  "name": "Usuario",
  "email": "usuario@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "role": "user" }
}
```

```bash
# Iniciar sesión
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

```bash
# Mi perfil (requiere token)
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Mascotas
```bash
# Listar mis mascotas
GET /api/pets
Authorization: Bearer <token>

# Crear mascota
POST /api/pets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Firulais",
  "type": "dog",        // dog, cat, rabbit, bird, other
  "age": 3,
  "breed": "Golden",
  "weight": 30,
  "image": "base64..."  // opcional
}

# Actualizar mascota
PUT /api/pets/:id
Authorization: Bearer <token>

# Eliminar mascota
DELETE /api/pets/:id
Authorization: Bearer <token>
```

---

### Recordatorios
```bash
# Listar recordatorios
GET /api/reminders
Authorization: Bearer <token>

# Crear recordatorio
POST /api/reminders
Authorization: Bearer <token>

{
  "pet_id": "uuid",
  "type": "vaccine",      // vaccine, bath, vet, grooming, other
  "title": "Vacuna anual",
  "description": "Vacuna de refuerzo",
  "date": "2026-05-21T10:00:00Z"
}

# Marcar como completado
PATCH /api/reminders/:id/toggle
Authorization: Bearer <token>

# Actualizar
PUT /api/reminders/:id
Authorization: Bearer <token>

# Eliminar
DELETE /api/reminders/:id
Authorization: Bearer <token>
```

---

### Registros de Salud
```bash
# Listar registros
GET /api/health-records
Authorization: Bearer <token>

# Crear registro
POST /api/health-records
Authorization: Bearer <token>

{
  "pet_id": "uuid",
  "date": "2026-04-21T15:30:00Z",
  "symptoms": "Tos, fiebre",
  "notes": "Posible infección viral",
  "temperature": 39.5
}

# Actualizar
PUT /api/health-records/:id

# Eliminar
DELETE /api/health-records/:id
```

---

### Rutinas
```bash
# Listar rutinas
GET /api/routines
Authorization: Bearer <token>

# Crear rutina
POST /api/routines

{
  "pet_id": "uuid",
  "type": "food",        // food, walk, play, medication, other
  "time": "08:00",
  "description": "Desayuno con comida premium"
}

# Actualizar
PUT /api/routines/:id

# Eliminar
DELETE /api/routines/:id
```

---

## 🧪 Probar API con cURL

```bash
# Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Crear mascota (reemplaza TOKEN con el JWT recibido)
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X POST http://localhost:3001/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Toby","type":"dog","age":5,"breed":"Labrador","weight":35}'
```

---

## 📊 Diagrama de Flujo

```
Cliente HTTP (Frontend)
    ↓
    ↓ POST /api/pets (con JWT)
    ↓
Express Router
    ↓
Middleware (JWT Verify)
    ↓
Controller (petsController)
    ↓
PostgreSQL Query
    ↓
Database (pets table)
    ↓
Response JSON → Cliente
```

---

## 🔒 Autenticación

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren:

```
Authorization: Bearer <JWT_TOKEN>
```

El token se valida en el middleware `authenticate` que:
1. Extrae el token del header
2. Verifica la firma con `JWT_SECRET`
3. Obtiene el usuario de la BD
4. Adjunta `req.user` al request

---

## 📚 Dependencias Principales

```json
{
  "express": "4.x",
  "pg": "^8.x",           // PostgreSQL driver
  "jsonwebtoken": "^9.x", // JWT
  "bcryptjs": "^2.x",     // Password hashing
  "dotenv": "^16.x",      // Variables de entorno
  "cors": "^2.x"          // CORS
}
```

---

## 🐛 Debugging

Ver logs completos:
```bash
npm run dev 2>&1 | tee backend.log
```

Conectarse directamente a BD:
```bash
psql -h localhost -p 5433 -U wardenpet_user -d wardenpet_db

# Ver mascotas
SELECT * FROM pets;

# Ver recordatorios
SELECT * FROM reminders;
```

---

## ✅ Checklist de Startup

- [ ] Base de datos corriendo: `docker-compose ps`
- [ ] .env configurado con credenciales correctas
- [ ] `npm install` ejecutado
- [ ] `npm run dev` muestra "✅ Base de datos conectada"
- [ ] Frontend puede registrar usuarios (POST /api/auth/register)
- [ ] Frontend puede crear mascotas (POST /api/pets)

---

**¡Backend listo! 🚀**

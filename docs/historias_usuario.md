# Historias de Usuario - SaveBite

## Historia de Usuario 1: Registro e Inicio de Sesión

**Como** usuario de SaveBite,
**quiero** poder registrarme e iniciar sesión con mi correo y contraseña,
**para** acceder a las funcionalidades de publicación, donaciones y administración de mi perfil.

### Criterios de Aceptación

- El formulario de registro requiere: nombre completo, correo electrónico, contraseña, confirmación de contraseña y ciudad
- El formulario de inicio de sesión requiere: correo electrónico y contraseña
- Se valida el formato del correo electrónico
- La contraseña debe tener mínimo 6 caracteres
- La confirmación de contraseña debe coincidir
- El usuario puede seleccionar tipo de cuenta: Usuario o Establecimiento
- Si selecciona Establecimiento, debe ingresar nombre y tipo del negocio
- Se muestran mensajes de error claros en español
- Al registrarse, se crea automáticamente el perfil en la base de datos

### Rama de Git: `feature/historia1`

### Archivos Relacionados

- `src/hooks/useAuth.tsx` - Contexto de autenticación y funciones de registro/inicio de sesión
- `src/components/AuthModal.tsx` - Modal con formularios de registro e inicio de sesión

---

## Historia de Usuario 2: Publicación y Visualización de Ofertas de Alimentos

**Como** establecimiento de alimentos,
**quiero** publicar ofertas de productos cercanos a vencer o en excedente,
**para** que los usuarios puedan acceder a ellos a bajo costo, gratis o mediante donación.

### Criterios de Aceptación

- Se puede crear una oferta indicando: título, descripción, categoría, tipo de oferta (bajo precio, gratis, donación), precio original y de oferta, cantidad, unidad, fecha de vencimiento, ciudad y dirección
- La página de ofertas muestra todas las ofertas activas en tarjetas con iconos por categoría
- Se pueden filtrar ofertas por ciudad, categoría y tipo de oferta
- Se puede buscar ofertas por texto
- Las tarjetas muestran información relevante: tipo de oferta, categoría, precio, cantidad, ubicación, tiempo de publicación
- Se indican los días para vencer cuando la fecha es próxima (≤3 días)

### Rama de Git: `feature/historia2`

### Archivos Relacionados

- `src/pages/Offers.tsx` - Página de listado de ofertas con filtros
- `src/pages/CreateOffer.tsx` - Formulario de creación de ofertas
- `src/components/OfferCard.tsx` - Tarjeta visual de oferta

---

## Historia de Usuario 3: Sistema de Donaciones

**Como** usuario o establecimiento,
**quiero** ofrecer o adquirir donaciones de alimentos o recursos económicos,
**para** apoyar a comunidades vulnerables o recibir ayuda cuando la necesito.

### Criterios de Aceptación

- Se puede publicar una donación indicando: si se ofrece o se necesita, tipo (alimentos, monetaria, mixta), monto (si es monetaria), descripción, ciudad e información de contacto
- La página de donaciones muestra todas las donaciones disponibles
- Se pueden filtrar donaciones por dirección (ofrezco/necesito), ciudad y tipo
- Las tarjetas de donación muestran: tipo, dirección (ofrezco/necesito), descripción, monto, ciudad, estado, contacto
- Los estados de donación son: disponible, en proceso, completado, cancelado

### Rama de Git: `feature/historia3`

### Archivos Relacionados

- `src/pages/Donations.tsx` - Página de listado de donaciones con filtros
- `src/pages/CreateDonation.tsx` - Formulario de creación de donaciones
- `src/components/DonationCard.tsx` - Tarjeta visual de donación

---

## Historia de Usuario 4: Visualización de Impacto Social

**Como** visitante de la plataforma,
**quiero** ver estadísticas de impacto social (kg salvados, familias beneficiadas, ciudades activas),
**para** entender el alcance y la importancia de la iniciativa SaveBite en Colombia.

### Criterios de Aceptación

- Se muestran estadísticas generales: kg de alimentos salvados, familias beneficiadas, establecimientos activos, ciudades participantes
- Se presenta un gráfico de crecimiento mensual con ofertas y alimentos salvados
- Se muestra una tabla de ciudades destacadas con métricas de impacto
- Se incluye una sección inspiracional sobre el significado detrás de los números

### Rama de Git: `feature/historia4`

### Archivos Relacionados

- `src/pages/Impact.tsx` - Página de impacto social con estadísticas y métricas

---

## Historia de Usuario 5: Panel de Administración de Base de Datos

**Como** usuario autenticado,
**quiero** acceder a una sección de base de datos para ver los registros de usuarios, ofertas y donaciones,
**para** tener visibilidad sobre la información almacenada en la plataforma.

### Criterios de Aceptación

- Solo usuarios autenticados pueden acceder al panel
- Se muestran tres pestañas: Usuarios, Ofertas, Donaciones
- Cada pestaña muestra los registros correspondientes en formato de tabla
- Se puede buscar registros por texto
- Se puede ordenar por columnas (nombre, fecha)
- Se muestra el conteo total de registros por categoría
- Los datos se cargan en tiempo real desde Supabase

### Rama de Git: `feature/historia5`

### Archivos Relacionados

- `src/hooks/useAuth.tsx` - Detección de usuario administrador con isAdmin
- `src/components/AdminPanel.tsx` - Panel de gestión de usuarios con tabla
- `src/pages/Admin.tsx` - Página que muestra AdminPanel para administradores
- `src/components/Header.tsx` - Badge y acceso directo para administradores
- `src/components/AuthModal.tsx` - Credenciales de admin visibles en login

### Credenciales de Administrador por Defecto

- **Usuario**: Manu (o manu@savebite.co)
- **Contraseña**: 123456

El administrador tiene acceso a un panel especial donde puede:
- Ver todos los usuarios registrados en el sistema
- Buscar usuarios por nombre, correo o ciudad
- Ver estadísticas de usuarios por tipo (Usuario, Establecimiento, Admin)
- Acceder directamente desde el menú de usuario

---

## Resumen de Ramas de Git

| Rama | Historia | Archivos Principales |
|------|----------|---------------------|
| `feature/historia1` | Registro e inicio de sesión | useAuth.tsx, AuthModal.tsx |
| `feature/historia2` | Ofertas de alimentos | Offers.tsx, CreateOffer.tsx, OfferCard.tsx |
| `feature/historia3` | Sistema de donaciones | Donations.tsx, CreateDonation.tsx, DonationCard.tsx |
| `feature/historia4` | Impacto social | Impact.tsx |
| `feature/historia5` | Panel de administración | Admin.tsx, AdminPanel.tsx, Header.tsx, useAuth.tsx |


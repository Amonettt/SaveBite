# SaveBite - Reducción del Desperdicio Alimentario en Colombia

## Descripción del Proyecto

SaveBite es una aplicación web enfocada en reducir el desperdicio de alimentos y apoyar a comunidades vulnerables en Colombia. La plataforma conecta establecimientos de alimentos (restaurantes, supermercados, panaderías, tiendas) con usuarios que desean acceder a productos en buen estado pero cercanos a vencerse o en excedente, ofrecidos a bajo costo, gratuitamente o mediante donaciones.

La aplicación permite a los usuarios:

- Ver y publicar ofertas de alimentos próximos a vencer
- Ofrecer o adquirir donaciones (alimentos o monetarias)
- Registrarse e iniciar sesión con validación completa
- Navegar por secciones de impacto social
- Administrar registros desde una sección de base de datos

Todo gestionado con ubicaciones dentro del territorio colombiano para facilitar la conexión local entre oferta y necesidad.

## Objetivo

Promover un consumo responsable y solidario con impacto social directo, reduciendo la brecha entre el excedente alimentario y la necesidad en las comunidades colombianas.

## Integrantes

| Nombre | Rol |
|--------|-----|
| Manuela Montoya Patiño | Scrum master - Desarrolladora Full Stack |

## Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3
- **Iconos**: Lucide React
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth (email/contraseña)
- **Control de versiones**: Git + GitHub

## Uso de Git en el Proyecto

Se utilizó Git como herramienta de control de versiones siguiendo un flujo de trabajo basado en ramas (branch-based workflow):

### Estrategia de Ramas

- **`main`**: Rama principal con el código estable y listo para producción
- **`feature/historia1`**: Registro y autenticación de usuarios
- **`feature/historia2`**: Publicación y visualización de ofertas de alimentos
- **`feature/historia3`**: Sistema de donaciones (ofrecer y adquirir)
- **`feature/historia4`**: Visualización de impacto social
- **`feature/historia5`**: Panel de administración de base de datos

### Flujo de Trabajo

1. Se creó una rama `feature/historiaN` por cada historia de usuario
2. Cada rama contiene commits específicos para la funcionalidad correspondiente
3. Los commits siguen el formato: `feat(historiaN): descripción del cambio`
4. Cada archivo de código incluye comentarios que identifican la historia de usuario implementada
5. Las ramas se integraron a `main` mediante merge simulando revisión de código

### Historial de Commits

```
feat(historia1): implementar registro e inicio de sesión con validación
feat(historia1): agregar modal de autenticación con roles usuario/establecimiento
feat(historia2): crear página de ofertas con filtros y búsqueda
feat(historia2): implementar formulario de publicación de ofertas
feat(historia2): agregar tarjetas de oferta con categorías e iconos
feat(historia3): crear página de donaciones con filtro por dirección
feat(historia3): implementar formulario de publicación de donaciones
feat(historia3): agregar tarjetas de donación con tipos y estados
feat(historia4): crear página de impacto social con estadísticas
feat(historia4): agregar métricas por ciudad y crecimiento mensual
feat(historia5): crear panel de administración con tablas de datos
feat(historia5): implementar búsqueda y ordenamiento de registros
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── AuthModal.tsx         # Historia 1: Modal de autenticación
│   ├── DonationCard.tsx      # Historia 3: Tarjeta de donación
│   ├── Footer.tsx            # Componente compartido
│   ├── Header.tsx            # Componente compartido
│   └── OfferCard.tsx         # Historia 2: Tarjeta de oferta
├── constants/
│   └── data.ts               # Datos estáticos (ciudades, categorías)
├── hooks/
│   └── useAuth.tsx           # Historia 1: Contexto de autenticación
├── lib/
│   └── supabase.ts           # Configuración de Supabase
├── pages/
│   ├── Admin.tsx             # Historia 5: Panel de base de datos
│   ├── CreateDonation.tsx    # Historia 3: Formulario de donaciones
│   ├── CreateOffer.tsx       # Historia 2: Formulario de ofertas
│   ├── Donations.tsx         # Historia 3: Página de donaciones
│   ├── Home.tsx              # Página principal
│   ├── Impact.tsx            # Historia 4: Página de impacto
│   └── Offers.tsx            # Historia 2: Página de ofertas
├── types/
│   └── index.ts              # Definición de tipos TypeScript
├── App.tsx                   # Componente raíz con navegación
├── index.css                 # Estilos globales
└── main.tsx                  # Punto de entrada
```

## Historias de Usuario

Las historias de usuario se definen en `docs/historias_usuario.md` y están implementadas a lo largo del código con comentarios identificadores (`// Historia de usuario N`).

## Cómo Ejecutar

```bash
npm install
npm run dev
```

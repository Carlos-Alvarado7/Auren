# Carta Digital Administrable Áuren

Monorepo para una carta pública por QR y un panel administrador de Áuren Gastronomy.

## Estructura

- `Angular/`: aplicación Angular con ruta pública `/menu` y panel `/admin`.
- `backend/`: API NestJS con autenticación, CRUD de carta, publicación y MongoDB Atlas.
- `api/index.ts`: adaptador de Vercel que expone NestJS bajo `/api`.

## Variables de entorno

Copie `.env.example` a `backend/.env` para desarrollo local y configure los mismos nombres en Vercel.

Variables sensibles o externas:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `CORS_ORIGIN`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`

No ponga secretos en Angular. El frontend consume el backend usando rutas relativas bajo `/api`.

## Flujo de edición

1. El administrador ingresa por `/admin/login`.
2. Edita la versión `draft` de la carta.
3. Publica desde el botón `Publicar carta`.
4. El cliente abre `/menu` desde QR y recibe solo la versión `published`.

## Comandos útiles

Instalar dependencias desde la raíz del monorepo:

```bash
bun install
```

Verificar backend:

```bash
bun run --cwd backend typecheck
bun run --cwd backend test
```

Verificar frontend sin build completo:

```bash
bun run --cwd Angular typecheck
bun test Angular/src/app/core/format-cop.util.spec.ts
```

Compilar para producción:

```bash
bun run build
```

Para desarrollo local se requiere levantar backend y frontend en terminales separadas con los scripts de cada workspace.

Backend local:

```bash
cd backend
bun run dev
```

Frontend local:

```bash
cd Angular
bun run start
```

El frontend usa `Angular/proxy.conf.json` para enviar `/api` hacia `http://localhost:3000` durante desarrollo local.

Si el login muestra credenciales inválidas usando el usuario semilla, reinicie el backend. En desarrollo, el seed refresca el hash del admin con `ADMIN_SEED_PASSWORD` cuando no coincide con MongoDB.

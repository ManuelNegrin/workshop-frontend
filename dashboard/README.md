# Dashboard de talleres

Interfaz React/Vite en español para la API de gestión de talleres. Incluye clientes, vehículos, agenda, órdenes de reparación, trabajos, presupuestos, aprobaciones manuales, inventario, sucursales, técnicos y remitos imprimibles.

## Desarrollo

1. Ejecutar `npm install`.
2. Iniciar el backend local en `http://localhost:5000` con una base PostgreSQL exclusiva de este proyecto.
3. Ejecutar `npm run dev`.

El proxy de desarrollo usa `http://localhost:5000`. Se puede cambiar con `VITE_DEV_API_TARGET`. En producción, configurar `VITE_API_URL` con la URL del backend de talleres. La consola de plataforma independiente usa `VITE_PLATFORM_CONSOLE_URL` si está disponible.

## Verificación

Ejecutar `npm run lint` y `npm run build -- --configLoader runner`.

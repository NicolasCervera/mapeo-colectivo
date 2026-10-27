# Mapeo colectivo · Taller Práctica Docente I

Proyecto React + TypeScript + Vite. Incluye portada académica, mapa interactivo del entorno y el recorrido interno de la escuela.

## Ejecutar localmente

Requisitos: Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abrí la URL que indique Vite (normalmente http://localhost:5173).

## Comprobar la compilación

```bash
npm run build
npm run preview
```

## Publicar en Vercel

1. Subí esta carpeta a un repositorio GitHub.
2. Importá el repositorio en Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.

## Mapa y ubicaciones

El mapa de entorno utiliza Leaflet cargado desde un CDN y teselas de OpenStreetMap; requiere conexión a internet. Las coordenadas del colegio corresponden al enlace compartido. Los marcadores de fincas y represas son referencias orientativas y deben verificarse en el relevamiento de campo antes de presentarse como ubicaciones exactas.

## Fotografías

Las imágenes originales se conservan en `public/fotos`. La imagen `public/fotos/portada.jpeg` se utiliza como fondo de portada. Para que el mapa y las teselas se muestren, el navegador debe tener conexión a internet.

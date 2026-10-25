# Portfolio Retro OS - Guía Personal de Desarrollo y Despliegue

Portfolio web personal interactivo simulando un sistema operativo retro multi-tema (Windows 98, Windows XP, Mac System, NES). Diseñado como SPA estática ultraligera montada sobre Astro y React, containerizada con Podman y servida mediante Nginx tras Nginx Proxy Manager y DuckDNS.

* **URL Pública:** [https://garbisoft.duckdns.org/](https://garbisoft.duckdns.org/)
* **Contenedor:** `portfolio-retro-os`

---

## Tecnologías y Dónde se Usan

| Tecnología | Dónde y para qué se usa |
| :--- | :--- |
| **Astro 7 (SSG)** | Base del proyecto (`src/pages/index.astro`, `src/layouts/Layout.astro`). Genera el HTML estático inicial, gestiona metadatos SEO/OpenGraph y monta la aplicación como un cliente interactivo sin sobrecarga del servidor. |
| **React 19 + TypeScript** | Toda la lógica del escritorio retro y sus aplicaciones (`src/components/os/` y `src/components/apps/`). Gestiona estado de ventanas (posiciones, z-index, snap, maximizar/minimizar), audio, arranque y apagado. |
| **CSS Retro Themes** | Estilos visuales intercambiables en caliente en `src/styles/retro-themes.css`: <br>• `98.css` (Win98)<br>• `xp.css` (WinXP)<br>• `system.css` (Mac clásico)<br>• `nes.css` (8-Bit NES)<br>Incluye filtro shader CRT (scanlines, resplandor) conmutables. |
| **Web Audio API** | `src/lib/sound.ts`. Generador sintético procedural de efectos de sonido (clics, errores, beeps retro con osciladores `square`/`sine`) sin depender de assets pesados en red. |
| **i18n Context** | `src/i18n/LanguageContext.tsx`. Alternancia instantánea de idioma (Español / Inglés) en todo el SO sin recargar la página. |
| **Nginx (Alpine)** | Servidor web de producción configurado en `nginx.conf`: compresión Gzip, cabeceras de seguridad, caché inmutable de 1 año para estáticos y endpoint `/health`. |
| **Podman / Docker** | Empaquetado en contenedor con compilación multi-etapa (`Containerfile` / `Dockerfile`). `node:22-alpine` para compilar el bundle estático y `nginx:alpine` para servirlo con un tamaño mínimo. |
| **Python & Chromium** | Scripts de automatización en `scripts/`: síntesis de voz con Piper ONNX (`generate_glados_voices.py`) y generación de PDFs con Chromium headless (`generate-retro-cv.cjs`). |

---

## Dónde Tocar Cada Cosa (Estructura Práctica)

```text
Portfolio/
├── src/
│   ├── data/
│   │   ├── projects.ts         <-- AÑADIR O EDITAR PROYECTOS (títulos, descripciones, links, tags)
│   │   ├── profile.ts          <-- DATOS PERSONALES, EXPERIENCIA, HABILIDADES Y CV
│   │   └── projectMedia.ts     <-- Logos y capturas de proyectos
│   ├── components/
│   │   ├── os/                 <-- Componentes del sistema operativo (Ventana, Barra, Menú, Boot...)
│   │   │   ├── RetroOS.tsx     <-- Orquestador principal de estado y ventanas
│   │   │   ├── Window.tsx      <-- Lógica drag & drop, snap y resize de ventanas
│   │   │   └── Taskbar.tsx     <-- Barra de tareas y reloj
│   │   └── apps/               <-- Las aplicaciones dentro del SO
│   │       ├── ProjectViewerApp.tsx   <-- Ficha técnica detallada de proyectos
│   │       ├── CVViewerApp.tsx        <-- Visor e interactividad del CV
│   │       ├── TerminalApp.tsx        <-- Terminal interactiva retro
│   │       ├── SettingsApp.tsx        <-- Selector de temas, fondos, CRT y sonido
│   │       ├── MinesweeperApp.tsx     <-- Juego del Buscaminas
│   │       └── ContactApp.tsx         <-- Cliente de contacto/correo
│   └── lib/sound.ts            <-- Motor de sonido procedural
├── scripts/
│   ├── generate-retro-cv.cjs   <-- Generador de PDFs del CV (ES y EN) vía Chromium headless
│   ├── generate_glados_voices.py <-- Síntesis de frases de GLaDOS
│   └── duckdns-sync.sh         <-- Actualizador automático de IP en DuckDNS
├── deploy.sh                   <-- Script maestro de compilación, gestión y despliegue Podman
└── nginx.conf                  <-- Configuración del servidor web de producción
```

---

## Comandos Rápidos

```bash
# Iniciar servidor de desarrollo en segundo plano (Recomendado)
astro dev --background

# Gestión del servidor en segundo plano
astro dev status    # Consultar estado
astro dev logs      # Ver logs
astro dev stop      # Detener servidor

# O modo interactivo clásico
npm run dev

# Compilar proyecto a estáticos (/dist)
npm run build

# Previsualizar el build de producción localmente
npm run preview
```

---

## Despliegue en Producción (`deploy.sh`)

El despliegue está automatizado mediante `./deploy.sh` usando Podman:
1. Compila la imagen multi-stage (`portfolio-retro-os:latest`).
2. Detecta automáticamente un puerto de red libre entre `8080` y `9000` (o reutiliza el puerto del contenedor anterior para no romper las rutas de Nginx Proxy Manager).
3. Detiene la versión previa sin downtime innecesario y arranca el nuevo contenedor.
4. Valida la salud consultando `/health`.

### Uso práctico de despliegue:

```bash
# Despliegue estándar (detección inteligente o reutilización de puerto)
./deploy.sh

# Desplegar forzando un puerto específico (ej. 8085)
./deploy.sh -p 8085

# Comprobar estado, puerto asignado y salud del contenedor
./deploy.sh --status

# Ver logs en tiempo real del contenedor
./deploy.sh --logs

# Reiniciar el contenedor (mantiene su puerto asignado)
./deploy.sh --restart

# Detener y eliminar el contenedor en ejecución
./deploy.sh --stop
```

> **Nota sobre Nginx Proxy Manager:** Si por alguna razón el contenedor cambia de puerto, actualiza el *Forward Port* en NPM apuntando a la IP local y al puerto que reporte `./deploy.sh --status`.

---

## Scripts Auxiliares de Mantenimiento

### 1. Regenerar PDFs del CV
Cuando se actualicen los datos en `src/data/profile.ts` o el diseño del CV:
```bash
npm run build:cv
```
*Genera los archivos `public/cv/CV_Martin_26.pdf` (español) y `public/cv/CV_Martin_26_EN.pdf` (inglés) con Chromium headless y recrea el QR dinámico apuntando al portfolio.*

### 2. Sincronización DuckDNS
Para verificar y sincronizar la IP pública con `garbisoft.duckdns.org`:
```bash
./deploy.sh --duckdns
# O mediante el script directo:
./scripts/duckdns-sync.sh --check
```

### 3. Voces de GLaDOS
Si se añaden frases a `scripts/glados_quotes.json`:
```bash
npm run glados:voices
```
*(Requiere el entorno de Glad0sAsistant configurado en el sistema).*

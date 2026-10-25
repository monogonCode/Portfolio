export interface Project {
  id: string;
  title: string;
  filename: string;
  tagline: string;
  category: 'Full Stack' | 'Mobile' | 'IA / Automatización' | 'DevOps / Sistemas';
  company: string;
  period: string;
  technologies: string[];
  summary: string;
  keyFeatures: string[];
  architecture: string;
  repoName: string;
  githubUrl?: string;
  liveUrl?: string;
  isProprietary?: boolean;
  hasMockup?: boolean;
  previewType:
    | 'scanner'
    | 'mobile-clock'
    | 'browser'
    | 'chat'
    | 'ecommerce'
    | 'python-code'
    | 'glados-eye'
    | 'audio-wave'
    | 'touchpad'
    | 'terminal-status';
  accentColor: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'delta-traz',
    title: 'DeltaTraz',
    filename: 'DeltaTraz.exe',
    tagline: 'Sistema Integral de Trazabilidad y Auditoría Agroalimentaria',
    category: 'Full Stack',
    company: 'Sector Agroindustrial / Obrador Lidia Helem',
    period: '2026',
    technologies: ['React', 'Tailwind CSS', 'Android (Kotlin)', 'REST API', 'Podman', 'Docker Compose', 'ML Kit OCR', 'OpenFoodFacts API', 'ReportLab PDF'],
    summary: 'Plataforma integral end-to-end para control de proveedores, trazabilidad de ingredientes y producto final con app móvil de captura en planta y portal web de auditoría.',
    keyFeatures: [
      'Conexión en tiempo real con OpenFoodFacts API para autocompletado rápido de proveedores y nombre del ingrediente',
      'Captura ágil mediante app móvil Android con escaneo OCR de números de lote.',
      'Exportación instantánea de informes técnicos en PDF homologados para auditorías de calidad alimentaria.',
      'Arquitectura de microservicios contenerizada con Podman y políticas de respaldo automatizado.'
    ],
    architecture: 'Android Kotlin (OCR) ➔ API REST Backend ➔ MariaDB / Podman ➔ Panel React Web',
    repoName: 'monogonCode/DeltaTraz',
    isProprietary: true,
    hasMockup: false,
    previewType: 'scanner',
    accentColor: '#10b981'
  },
  {
    id: 'chumbos-fichaje',
    title: 'FichajeAgro',
    filename: 'FichajeAgro.apk',
    tagline: 'Control Horario, Partes de Trabajo y Sincronización ERP',
    category: 'Mobile',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Android (Kotlin)', 'Room DB', 'REST API', 'Velneo ERP', 'Bixolon Thermal SDK', 'Material Design'],
    summary: 'Aplicación Android nativa para registro y gestión de jornadas de trabajo en cuadrillas de campo, autofichaje geolocalizado e integración directa con el ERP corporativo Velneo.',
    keyFeatures: [
      'Registro de fichajes en tiempo real con validación GPS en fincas y parcelas agrícolas.',
      'Persistencia offline completa mediante Room Database con resolución de conflictos al recuperar cobertura.',
      'Sincronización automatizada con el software ERP corporativo Velneo .'
    ],
    architecture: 'Kotlin Nativo ➔ Room SQLite Local ➔ API REST Sincronizadora ➔ ERP Velneo Corporativo',
    repoName: 'monogonCode/chumbos-fichajeagro',
    isProprietary: true,
    hasMockup: false,
    previewType: 'mobile-clock',
    accentColor: '#0284c7'
  },
  {
    id: 'chumbos-portal',
    title: 'Portal Chumbos & Canal Ético',
    filename: 'ChumbosPortal.app',
    tagline: 'Web Corporativa, Catálogo Digital y Portal de Denuncias Éticas',
    category: 'Full Stack',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Astro', 'Prisma ORM', 'MariaDB', 'Tailwind CSS', 'TypeScript', 'Docker'],
    summary: 'Plataforma web corporativa de alto rendimiento construida en Astro con catálogo digital interactivo de productos hortofrutícolas usando librerias Open Source y sistema interno confidencial de denuncias éticas mediante tickets.',
    keyFeatures: [
      'Arquitectura Astro con generación estática (SSG) y renderizado bajo demanda (SSR).',
      'Catálogo comercial dinámico de variedades de sandía, melón y hortalizas para clientes de exportación.',
      'Portal confidencial de canal ético y buzón de denuncias corporativo según normativa europea.',
      'Capa de datos fuertemente tipada con Prisma ORM conectada a base de datos encriptada relacional MariaDB.'
    ],
    architecture: 'Astro Frontend ➔ Prisma ORM / MariaDB ➔ Nginx Reverse Proxy ➔ Podman Container',
    repoName: 'monogonCode/chumbos-portal',
    liveUrl: 'https://explotacioneschumbos.es',
    isProprietary: true,
    hasMockup: false,
    previewType: 'browser',
    accentColor: '#84cc16'
  },
  {
    id: 'chumbos-chatbot',
    title: 'Chatbot WhatsApp 2.0',
    filename: 'ChumbosBot.js',
    tagline: 'Automatización de Consultas, Fincas y Geolocalización',
    category: 'IA / Automatización',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Node.js', 'WhatsApp Web API', 'MariaDB', 'Podman', 'Bash Scripting', 'Docker'],
    summary: 'Bot conversacional autónomo para WhatsApp desplegado en Podman para responder consultas de operarios de campo, ubicación de fincas, partes de trabajo y geolocalización en tiempo real.',
    keyFeatures: [
      'Atención 24/7 y resolución instantánea de consultas para asignación de cuadrillas y jornadas o tractoristas y trabajadores independientes.',
      'Envío dinámico de coordenadas geográficas de fincas por WhatsApp, delimitadas en el mapa.',
      'conexión a una base de datos MariaDB con toda la información; nombres, codigos internos de cada finca y URLs ',
      'Contenedorizado en Podman con scripts bash para la administración de usuarios autorizados, agregado de nuevas fincas/subfincas y backup.'
    ],
    architecture: 'WhatsApp Web Protocol ➔ Node.js Engine ➔ MariaDB Database ➔ Podman Containerized Service',
    repoName: 'monogonCode/chumbos-chatbot2',
    isProprietary: true,
    hasMockup: false,
    previewType: 'chat',
    accentColor: '#22c55e'
  },
  {
    id: 'lidia-ecommerce',
    title: 'Obrador Lidia Helem E-Commerce',
    filename: 'LidiaHelem.shop',
    tagline: 'Plataforma Web E-commerce y Panel de Gestión',
    category: 'Full Stack',
    company: 'Obrador de Pastelería Lidia Helem',
    period: '2026 - Actual',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'Tailwind CSS', 'Nodemailer SMTP', 'Podman'],
    summary: 'Tienda digital para repostería artesanal con catálogo interactivo de tartas personalizadas, carrito de compras, gestión de pedidos y notificaciones por correo transaccional.',
    keyFeatures: [
      'Diseño visual apetecible y optimizado para compras rápidas en smartphones y tablets.',
      'Carrito de la compra reactivo con cálculo de portes y selector de fecha/hora de recogida en tienda.',
      'Panel de control administrativo para consulta y cambio de estado de pedidos en elaboración.',
      'Notificaciones automáticas por correo electrónico vía SMTP tanto para el cliente como para el obrador.'
    ],
    architecture: 'React + Vite Frontend ➔ Express API REST ➔ SMTP Mail Service ➔ Podman Container',
    repoName: 'monogonCode/obradorLidiaHelem',
    liveUrl: 'https://pastelerialidiahelem.com',
    isProprietary: true,
    hasMockup: false,
    previewType: 'ecommerce',
    accentColor: '#ec4899'
  },
  {
    id: 'FichasLidia',
    title: 'Automatización Fichas Técnicas Python',
    filename: 'FichasTecnicasLidiaHelem.py',
    tagline: 'Generación por Lote de Fichas Técnicas, Alérgenos y SEO',
    category: 'IA / Automatización',
    company: 'Obrador de Pastelería Lidia Helem',
    period: '2026',
    technologies: ['Python', 'ReportLab', 'BeautifulSoup', 'SEO Automation', 'JSON Data Models'],
    summary: 'Conjunto de herramientas y scripts en Python para automatizar la formulación de alérgenos, tablas de composición nutricional, generación masiva de PDFs y optimización SEO del catálogo.',
    keyFeatures: [
      'Generación algorítmica de fichas técnicas en PDF listas para imprimir y archivar en inspecciones.',
      'Cálculo proporcional de alérgenos según receta e ingredientes de base de datos.',
      'Optimización de metadatos SEO estructurados para potenciar la visibilidad en Google.',
      'Procesamiento por lote capaz de generar decenas de fichas técnicas en segundos.'
    ],
    architecture: 'Fórmulas y Recetas JSON ➔ Motor ReportLab Python ➔ Generación Vectorial PDF ➔ Archivo Sanitarios',
    repoName: 'monogonCode/LidiaElena',
    isProprietary: true,
    hasMockup: false,
    previewType: 'python-code',
    accentColor: '#eab308'
  },
  {
    id: 'glados-assistant',
    title: 'GLaDOS Linux Voice Assistant',
    filename: 'GLaDOS.py',
    tagline: 'Asistente de Voz Local para Linux con la voz de GLaDOS(versión en español)',
    category: 'IA / Automatización',
    company: 'Proyecto Personal',
    period: '2026',
    technologies: ['Python', 'Piper ONNX TTS', 'espeak-ng', 'systemd', 'Telegram Bot API', 'Bash'],
    summary: 'Asistente de voz local para Linux con la icónica voz sarcástica de GLaDOS (del videojuego Portal), síntesis neuronal de voz ultrarrápida y control remoto mediante un bot de Telegram.',
    keyFeatures: [
      'Síntesis neuronal local de voz con Piper ONNX',
      'Integración con demonios systemd para saludar en login, despertar de suspensión y alertas en la ejecución de comandos y nivel de batería/carga.',
      'Control total por Telegram: ejecutar comandos seguros, consultar estado y recibir alertas.',
      'Ejecución 100% local en Linux, sin cuotas de APIs externas ni dependencia de internet.'
    ],
    architecture: 'Linux systemd Events ➔ Python Core Engine ➔ Piper ONNX Modulated TTS ➔ Audio Output / Telegram',
    repoName: 'monogonCode/Glad0sAsistant',
    githubUrl: 'https://github.com/monogonCode/Glad0sAsistant',
    isProprietary: false,
    hasMockup: true,
    previewType: 'glados-eye',
    accentColor: '#f59e0b'
  },
  {
    id: 'transres-audio',
    title: 'TransResAudio',
    filename: 'TransResAudio.ai',
    tagline: 'Transcripción de Audio, Diarización y Resúmenes con LLM Local',
    category: 'IA / Automatización',
    company: 'Proyecto Personal I+D',
    period: '2026',
    technologies: ['FastAPI', 'Faster-Whisper', 'Ollama (LLM)', 'Android (Kotlin)', 'Docker Compose'],
    summary: 'Plataforma privada de transcripción de audio que identifica hablantes y genera actas de reunión mediante inteligencia artificial ejecutada íntegramente en local.',
    keyFeatures: [
      'Transcripción fonética de máxima precisión con Faster-Whisper acelerado por hardware.',
      'Resúmenes estructurados y extracción de tareas pendientes mediante modelos LLM en Ollama.',
      'Aplicación cliente en Android para grabación de audio en alta fidelidad y subida cifrada.',
      'API REST modular construida con FastAPI y empaquetada con Docker Compose.'
    ],
    architecture: 'Android Mic Recorder ➔ FastAPI Gateway ➔ Faster-Whisper GPU ➔ Ollama LLM ➔ PDF Report',
    repoName: 'monogonCode/TransResAudio',
    githubUrl: 'https://github.com/monogonCode/TransResAudio',
    isProprietary: false,
    hasMockup: false,
    previewType: 'audio-wave',
    accentColor: '#a855f7'
  },
  {
    id: 'delta-servers',
    title: 'DeltaGameServers & Infra',
    filename: 'GameServers.sh',
    tagline: 'Infraestructura Linux, Podman y Servidores Dedicados',
    category: 'DevOps / Sistemas',
    company: 'Administración de Sistemas & DevOps',
    period: '2025 - 2026',
    technologies: ['Linux / Ubuntu', 'Podman Rootless', 'Docker', 'Bash Scripting', 'Nginx', 'SteamCMD'],
    summary: 'Despliegue y administración de servidores dedicados de videojuegos (L4D2, etc.), automatización de tareas en Bash, orquestación de contenedores y proxy inverso seguro.',
    keyFeatures: [
      'Scripts en Bash para arranque automático, detección de cuelgues y actualización desatendida.',
      'Contenedores Podman rootless para garantizar máxima seguridad y aislamiento de procesos.',
      'Configuración de reverse proxy Nginx con certificados SSL y gestión de puertos.',
      'Supervisión y registro de consumo de CPU, memoria y latencia de red.'
    ],
    architecture: 'Linux Host ➔ Podman Rootless Pods ➔ SteamCMD Service ➔ Nginx Proxy ➔ Client Connections',
    repoName: 'monogonCode/DeltaGamesServers',
    githubUrl: 'https://github.com/monogonCode/DeltaGamesServers',
    isProprietary: false,
    hasMockup: false,
    previewType: 'terminal-status',
    accentColor: '#64748b'
  }
];

export const PROJECTS_EN: Project[] = [
  {
    id: 'delta-traz',
    title: 'DeltaTraz',
    filename: 'DeltaTraz.exe',
    tagline: 'Comprehensive Agri-Food Traceability & Auditing System',
    category: 'Full Stack',
    company: 'Agri-Food Sector / Obrador Lidia Helem',
    period: '2026',
    technologies: ['React', 'Tailwind CSS', 'Android (Kotlin)', 'REST API', 'Podman', 'Docker Compose', 'ML Kit OCR', 'OpenFoodFacts API', 'ReportLab PDF'],
    summary: 'End-to-end platform for supplier control, ingredient and finished product traceability, featuring a plant floor mobile capture app and a web auditing portal.',
    keyFeatures: [
      'Real-time connection with OpenFoodFacts API for fast autocomplete of suppliers and ingredient names.',
      'Agile data capture via Android mobile app with OCR batch number scanning.',
      'Instant export of certified technical PDF reports for food safety and quality audits.',
      'Containerized microservices architecture with Podman and automated backup policies.'
    ],
    architecture: 'Android Kotlin (OCR) ➔ REST API Backend ➔ MariaDB / Podman ➔ React Web Dashboard',
    repoName: 'monogonCode/DeltaTraz',
    isProprietary: true,
    hasMockup: false,
    previewType: 'scanner',
    accentColor: '#10b981'
  },
  {
    id: 'chumbos-fichaje',
    title: 'FichajeAgro',
    filename: 'FichajeAgro.apk',
    tagline: 'Time Tracking, Work Reports & ERP Synchronization',
    category: 'Mobile',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Android (Kotlin)', 'Room DB', 'REST API', 'Velneo ERP', 'Bixolon Thermal SDK', 'Material Design'],
    summary: 'Native Android application for recording and managing work shifts for field crews, geolocated self-clocking, and direct integration with the corporate Velneo ERP.',
    keyFeatures: [
      'Real-time clock-in recording with GPS geofence validation across farms and agricultural plots.',
      'Full offline persistence via Room Database with automatic conflict resolution upon reconnecting.',
      'Automated synchronization with the corporate Velneo ERP software.'
    ],
    architecture: 'Native Kotlin ➔ Local Room SQLite ➔ Sync REST API ➔ Corporate Velneo ERP',
    repoName: 'monogonCode/chumbos-fichajeagro',
    isProprietary: true,
    hasMockup: false,
    previewType: 'mobile-clock',
    accentColor: '#0284c7'
  },
  {
    id: 'chumbos-portal',
    title: 'Chumbos Portal & Ethics Channel',
    filename: 'ChumbosPortal.app',
    tagline: 'Corporate Website, Digital Catalog & Ethics Whistleblowing Portal',
    category: 'Full Stack',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Astro', 'Prisma ORM', 'MariaDB', 'Tailwind CSS', 'TypeScript', 'Docker'],
    summary: 'High-performance corporate web platform built with Astro, featuring an interactive digital catalog of fruit and vegetable produce using Open Source libraries and a confidential internal ticket-based ethics whistleblowing system.',
    keyFeatures: [
      'Astro architecture combining Static Site Generation (SSG) and Server-Side Rendering (SSR).',
      'Dynamic commercial catalog of watermelon, melon, and vegetable varieties for export clients.',
      'Confidential ethics channel and corporate whistleblowing portal compliant with European regulations.',
      'Strongly typed data layer with Prisma ORM connected to an encrypted MariaDB relational database.'
    ],
    architecture: 'Astro Frontend ➔ Prisma ORM / MariaDB ➔ Nginx Reverse Proxy ➔ Podman Container',
    repoName: 'monogonCode/chumbos-portal',
    liveUrl: 'https://explotacioneschumbos.es',
    isProprietary: true,
    hasMockup: false,
    previewType: 'browser',
    accentColor: '#84cc16'
  },
  {
    id: 'chumbos-chatbot',
    title: 'WhatsApp Chatbot 2.0',
    filename: 'ChumbosBot.js',
    tagline: 'Query Automation, Farm Directory & Geolocation',
    category: 'IA / Automatización',
    company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    period: '2026',
    technologies: ['Node.js', 'WhatsApp Web API', 'MariaDB', 'Podman', 'Bash Scripting', 'Docker'],
    summary: 'Autonomous conversational WhatsApp bot deployed in Podman to handle field worker inquiries, farm locations, work reports, and real-time geolocation.',
    keyFeatures: [
      '24/7 support and instant query resolution for crew assignments, shifts, tractor drivers, and independent workers.',
      'Dynamic delivery of farm geographic coordinates via WhatsApp with map boundaries.',
      'Connected to a MariaDB database storing full farm records, internal codes, and map URLs.',
      'Containerized in Podman with Bash scripts for authorized user management, farm/sub-farm registration, and backups.'
    ],
    architecture: 'WhatsApp Web Protocol ➔ Node.js Engine ➔ MariaDB Database ➔ Podman Containerized Service',
    repoName: 'monogonCode/chumbos-chatbot2',
    isProprietary: true,
    hasMockup: false,
    previewType: 'chat',
    accentColor: '#22c55e'
  },
  {
    id: 'lidia-ecommerce',
    title: 'Obrador Lidia Helem E-Commerce',
    filename: 'LidiaHelem.shop',
    tagline: 'E-Commerce Web Platform & Management Dashboard',
    category: 'Full Stack',
    company: 'Obrador de Pastelería Lidia Helem',
    period: '2026 - Present',
    technologies: ['React', 'Vite', 'Node.js', 'Express', 'Tailwind CSS', 'Nodemailer SMTP', 'Podman'],
    summary: 'Digital storefront for an artisanal bakery featuring an interactive custom cake catalog, shopping cart, order management, and transactional email notifications.',
    keyFeatures: [
      'Appetizing visual design optimized for fast checkout on smartphones and tablets.',
      'Reactive shopping cart with shipping calculation and in-store pickup date/time selector.',
      'Administrative control panel for viewing and updating the status of orders in preparation.',
      'Automated transactional email notifications via SMTP for both customers and the bakery.'
    ],
    architecture: 'React + Vite Frontend ➔ Express REST API ➔ SMTP Mail Service ➔ Podman Container',
    repoName: 'monogonCode/obradorLidiaHelem',
    liveUrl: 'https://pastelerialidiahelem.com',
    isProprietary: true,
    hasMockup: false,
    previewType: 'ecommerce',
    accentColor: '#ec4899'
  },
  {
    id: 'FichasLidia',
    title: 'Python Technical Data Sheets Automation',
    filename: 'FichasTecnicasLidiaHelem.py',
    tagline: 'Batch Generation of Technical Sheets, Allergens & SEO',
    category: 'IA / Automatización',
    company: 'Obrador de Pastelería Lidia Helem',
    period: '2026',
    technologies: ['Python', 'ReportLab', 'BeautifulSoup', 'SEO Automation', 'JSON Data Models'],
    summary: 'Suite of Python tools and scripts to automate allergen formulation, nutritional composition tables, bulk PDF generation, and catalog SEO optimization.',
    keyFeatures: [
      'Algorithmic generation of print-ready PDF technical data sheets for health inspections and archiving.',
      'Proportional allergen calculation based on recipes and database ingredients.',
      'Structured SEO metadata optimization to boost Google search visibility.',
      'Batch processing capable of generating dozens of technical sheets in seconds.'
    ],
    architecture: 'JSON Formulas & Recipes ➔ Python ReportLab Engine ➔ Vector PDF Generation ➔ Health Compliance Archive',
    repoName: 'monogonCode/LidiaElena',
    isProprietary: true,
    hasMockup: false,
    previewType: 'python-code',
    accentColor: '#eab308'
  },
  {
    id: 'glados-assistant',
    title: 'GLaDOS Linux Voice Assistant',
    filename: 'GLaDOS.py',
    tagline: 'Local Linux Voice Assistant with GLaDOS Voice (Spanish Neural Model)',
    category: 'IA / Automatización',
    company: 'Personal Project',
    period: '2026',
    technologies: ['Python', 'Piper ONNX TTS', 'espeak-ng', 'systemd', 'Telegram Bot API', 'Bash'],
    summary: 'Local voice assistant for Linux featuring the iconic sarcastic voice of GLaDOS (from the Portal video game), ultra-fast neural speech synthesis, and remote control via a Telegram bot.',
    keyFeatures: [
      'Local neural speech synthesis powered by Piper ONNX.',
      'Integration with systemd daemons for login greetings, wake-from-suspend events, command execution alerts, and battery/charging status.',
      'Full remote control via Telegram: execute safe commands, check system status, and receive alerts.',
      '100% local execution on Linux with zero external API quotas or internet dependency.'
    ],
    architecture: 'Linux systemd Events ➔ Python Core Engine ➔ Piper ONNX Modulated TTS ➔ Audio Output / Telegram',
    repoName: 'monogonCode/Glad0sAsistant',
    githubUrl: 'https://github.com/monogonCode/Glad0sAsistant',
    isProprietary: false,
    hasMockup: true,
    previewType: 'glados-eye',
    accentColor: '#f59e0b'
  },
  {
    id: 'transres-audio',
    title: 'TransResAudio',
    filename: 'TransResAudio.ai',
    tagline: 'Audio Transcription, Diarization & Summaries with Local LLM',
    category: 'IA / Automatización',
    company: 'Personal R&D Project',
    period: '2026',
    technologies: ['FastAPI', 'Faster-Whisper', 'Ollama (LLM)', 'Android (Kotlin)', 'Docker Compose'],
    summary: 'Private audio transcription platform that identifies speakers and generates meeting minutes using artificial intelligence running entirely locally.',
    keyFeatures: [
      'High-precision phonetic transcription with hardware-accelerated Faster-Whisper.',
      'Structured summaries and action item extraction powered by local LLM models in Ollama.',
      'Android client application for high-fidelity audio recording and encrypted upload.',
      'Modular REST API built with FastAPI and packaged with Docker Compose.'
    ],
    architecture: 'Android Mic Recorder ➔ FastAPI Gateway ➔ Faster-Whisper GPU ➔ Ollama LLM ➔ PDF Report',
    repoName: 'monogonCode/TransResAudio',
    githubUrl: 'https://github.com/monogonCode/TransResAudio',
    isProprietary: false,
    hasMockup: false,
    previewType: 'audio-wave',
    accentColor: '#a855f7'
  },
  {
    id: 'delta-servers',
    title: 'DeltaGameServers & Infra',
    filename: 'GameServers.sh',
    tagline: 'Linux Infrastructure, Podman & Dedicated Servers',
    category: 'DevOps / Sistemas',
    company: 'Systems Administration & DevOps',
    period: '2025 - 2026',
    technologies: ['Linux / Ubuntu', 'Podman Rootless', 'Docker', 'Bash Scripting', 'Nginx', 'SteamCMD'],
    summary: 'Deployment and administration of dedicated game servers (L4D2, etc.), Bash task automation, container orchestration, and secure reverse proxy.',
    keyFeatures: [
      'Bash scripts for automatic startup, crash detection, and unattended updates.',
      'Rootless Podman containers ensuring maximum security and process isolation.',
      'Nginx reverse proxy configuration with SSL certificates and port management.',
      'Monitoring and logging of CPU usage, memory consumption, and network latency.'
    ],
    architecture: 'Linux Host ➔ Podman Rootless Pods ➔ SteamCMD Service ➔ Nginx Proxy ➔ Client Connections',
    repoName: 'monogonCode/DeltaGamesServers',
    githubUrl: 'https://github.com/monogonCode/DeltaGamesServers',
    isProprietary: false,
    hasMockup: false,
    previewType: 'terminal-status',
    accentColor: '#64748b'
  }
];

export const getProjects = (lang: 'es' | 'en' = 'es'): Project[] => {
  return lang === 'en' ? PROJECTS_EN : PROJECTS;
};

export const getCategoryLabel = (category: string, lang: 'es' | 'en' = 'es'): string => {
  if (lang === 'en') {
    switch (category) {
      case 'IA / Automatización':
        return 'AI / Automation';
      case 'DevOps / Sistemas':
        return 'DevOps / Systems';
      default:
        return category;
    }
  }
  return category;
};

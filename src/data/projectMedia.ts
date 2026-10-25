// Project Media and Company Assets mapping
import logoChumbos from '../assets/HNOS-Chumbos/logo_chumbos.png';
import logoGarbisoft from '../assets/Deltatraz/logo_garbisoft.png';
import logoLidia from '../assets/PasteleriaLidiaHelem/logo.png';

// Deltatraz images
import dtWeb1 from '../assets/Deltatraz/2026-09-28_19-11.png';
import dtWeb2 from '../assets/Deltatraz/2026-09-28_19-11_1.png';
import dtWeb3 from '../assets/Deltatraz/2026-09-28_19-17.png';
import dtMobile1 from '../assets/Deltatraz/Screenshot_2026-09-28-18-41-25-23_1b7afacf956dbb71accc7a18dd7eece6.jpg';
import dtMobile2 from '../assets/Deltatraz/Screenshot_2026-09-28-18-42-59-60_1b7afacf956dbb71accc7a18dd7eece6.jpg';
import dtMobile3 from '../assets/Deltatraz/Screenshot_2026-09-28-18-57-37-92_1b7afacf956dbb71accc7a18dd7eece6.jpg';
import dtMobile4 from '../assets/Deltatraz/Screenshot_2026-09-28-19-01-33-97_1b7afacf956dbb71accc7a18dd7eece6.jpg';

// FichajeAgro (HNOS Chumbos) images
import fa1 from '../assets/HNOS-Chumbos/FIchajesAgro/Screenshot_2026-09-28-18-38-12-51_e6f201e15311fc82387052d2129f373d.jpg';
import fa2 from '../assets/HNOS-Chumbos/FIchajesAgro/Screenshot_2026-09-28-18-38-52-07_e6f201e15311fc82387052d2129f373d.jpg';
import fa3 from '../assets/HNOS-Chumbos/FIchajesAgro/Screenshot_2026-09-28-18-39-07-07_e6f201e15311fc82387052d2129f373d.jpg';
import fa4 from '../assets/HNOS-Chumbos/FIchajesAgro/Screenshot_2026-09-28-18-40-26-47_e6f201e15311fc82387052d2129f373d.jpg';
import fa5 from '../assets/HNOS-Chumbos/FIchajesAgro/Screenshot_2026-09-28-19-06-21-24.jpg';

// Chatbot (HNOS Chumbos) image
import cb1 from '../assets/HNOS-Chumbos/chatbot/IMG_20260928_192915.jpg';

// Pastelería Lidia Helem images
import pl1 from '../assets/PasteleriaLidiaHelem/2026-09-28_19-08.png';
import pl2 from '../assets/PasteleriaLidiaHelem/2026-09-28_19-09.png';
import pl3 from '../assets/PasteleriaLidiaHelem/2026-09-28_19-10.png';
import pl4 from '../assets/PasteleriaLidiaHelem/2026-09-28_19-10_1.png';
import pl5 from '../assets/PasteleriaLidiaHelem/2026-09-28_19-10_2.png';

export function resolveImageSrc(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && 'src' in img) return img.src;
  return String(img);
}

export interface ProjectScreenshot {
  src: string;
  title: string;
  caption: string;
  badge?: string;
  device?: 'mobile' | 'desktop';
}

export interface ProjectMediaConfig {
  logo?: string;
  companyName: string;
  screenshots: ProjectScreenshot[];
}

export const PROJECT_MEDIA: Record<string, ProjectMediaConfig> = {
  'delta-traz': {
    logo: resolveImageSrc(logoGarbisoft),
    companyName: 'Garbisoft / Obrador Lidia Helem',
    screenshots: [
      {
        src: resolveImageSrc(dtWeb1),
        title: 'Panel Web de Trazabilidad: Lotes y Proveedores',
        caption: 'Gestión centralizada de materias primas, alérgenos y partidas para auditorías de calidad en obradores y plantas.',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtWeb2),
        title: 'Panel Web: Buscador filtrado',
        caption: 'Visualización del buscador de fichas de trazabilidad con filtros para búsquedas específicas',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtWeb3),
        title: 'Generación Automatizada de Auditorías en PDF',
        caption: 'Exportación de informes normativos para sanidad y control alimentario con firmas de lote.',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtMobile1),
        title: 'App Android OCR: Captura y Escaneo en Planta',
        caption: 'Reconocimiento de texto en tiempo real con ML Kit para escanear etiquetas de sacos y albaranes de proveedores.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile2),
        title: 'App Android OCR: ajustes del patrón de nº de lote',
        caption: 'Dentro de la configuración del programa se puede seleccionar cómo se desea el patrón automátizado del número de lote',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile3),
        title: 'App Android: Confirmación y Alta de Lote',
        caption: 'Validación con guardado offline y sincronización directa con el servidor y base de datos',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile4),
        title: 'App Android: Creación de  y Stock',
        caption: 'Creación de un nuevo producto final agregando los ingredientes ya creados anteriormente con la cantidad usada',
        badge: 'Android Kotlin',
        device: 'mobile'
      }
    ]
  },

  'chumbos-fichaje': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: [
      {
        src: resolveImageSrc(fa1),
        title: 'FichajeAgro: Autenticación y Asignación de Cuadrilla',
        caption: 'Pantalla de acceso rápido para encargados de campo con selección de sector agrícola y turno de trabajo.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa2),
        title: 'Registro de Jornada: Entrada con Validación GPS',
        caption: 'Marcaje en tiempo real validando que el operario se encuentra dentro del polígono geográfico de la finca.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa3),
        title: 'Gestión de Cuadrilla: Marcaje Masivo de Operarios',
        caption: 'Fichaje simultáneo de trabajadores agrícolas con persistencia offline en Room SQLite ante falta de cobertura.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa4),
        title: 'Partes de Trabajo y Tareas Agrícolas Asignadas',
        caption: 'Desglose de horas trabajadas por labor (recolección, poda, riego) para imputación de costes en el ERP Velneo.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa5),
        title: 'Historial de Jornadas y Estado de Sincronización ERP',
        caption: 'Supervisión completa de fichajes pendientes de subida y confirmación de transferencias al ERP corporativo.',
        badge: 'Android Kotlin',
        device: 'mobile'
      }
    ]
  },

  'chumbos-chatbot': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: [
      {
        src: resolveImageSrc(cb1),
        title: 'Chatbot WhatsApp 2.0: Envío de Ubicación de Fincas y Tareas',
        caption: 'Interacción autónoma por WhatsApp con operarios y transportistas: envío automático de coordenadas Google Maps, asignación de cuadrillas y consulta de estado en tiempo real.',
        badge: 'Node.js Bot',
        device: 'mobile'
      }
    ]
  },

  'chumbos-portal': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: []
  },

  'lidia-ecommerce': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: [
      {
        src: resolveImageSrc(pl1),
        title: 'Página de Inicio: Presentación de Pastelería Artesanal',
        caption: 'Diseño visual responsive con catálogo interactivo de tartas, bollería y productos de temporada.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl2),
        title: 'Catálogo de Productos y Filtros por Tipo',
        caption: 'Exploración fluida con fotos en alta definición y especificación de opciones para alérgicos y celíacos.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl3),
        title: 'Ficha de Producto: Personalización de Tartas',
        caption: 'Selector de raciones, personalización de mensajes de felicitación e ingredientes especiales.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl4),
        title: 'Carrito de Compras y Reserva de Recogida',
        caption: 'Cálculo dinámico de pedidos y selección de fecha y franja horaria para recogida física en el obrador.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl5),
        title: 'Pasarela de Pedido y Notificaciones por Email',
        caption: 'Confirmación instantánea de compra conectada a servicio SMTP para avisar tanto al cliente como al maestro pastelero.',
        badge: 'React + Vite',
        device: 'desktop'
      }
    ]
  },

  'FichasLidia': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: []
  },
  'lidia-automation': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: []
  }
};

export const PROJECT_MEDIA_EN: Record<string, ProjectMediaConfig> = {
  'delta-traz': {
    logo: resolveImageSrc(logoGarbisoft),
    companyName: 'Garbisoft / Obrador Lidia Helem',
    screenshots: [
      {
        src: resolveImageSrc(dtWeb1),
        title: 'Traceability Web Dashboard: Batches & Suppliers',
        caption: 'Centralized management of raw materials, allergens, and batches for quality audits in bakeries and production plants.',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtWeb2),
        title: 'Web Dashboard: Filtered Search',
        caption: 'Traceability records search view with advanced filters for targeted queries.',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtWeb3),
        title: 'Automated PDF Audit Generation',
        caption: 'Export of regulatory reports for health authorities and food safety control with batch signatures.',
        badge: 'Web Desktop',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(dtMobile1),
        title: 'Android OCR App: Plant Floor Capture & Scanning',
        caption: 'Real-time text recognition with ML Kit to scan sack labels and supplier delivery notes.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile2),
        title: 'Android OCR App: Batch Number Pattern Settings',
        caption: 'Program settings allow configuring the automated batch number pattern format.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile3),
        title: 'Android App: Batch Confirmation & Registration',
        caption: 'Validation with offline storage and direct synchronization with the server and database.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(dtMobile4),
        title: 'Android App: Final Product Creation & Stock',
        caption: 'Creation of a new finished product by combining previously registered ingredients and quantities used.',
        badge: 'Android Kotlin',
        device: 'mobile'
      }
    ]
  },

  'chumbos-fichaje': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: [
      {
        src: resolveImageSrc(fa1),
        title: 'FichajeAgro: Authentication & Crew Assignment',
        caption: 'Quick access screen for field supervisors with agricultural sector and work shift selection.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa2),
        title: 'Shift Registration: Clock-In with GPS Validation',
        caption: 'Real-time clocking validating that the worker is inside the farm geographic polygon.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa3),
        title: 'Crew Management: Bulk Worker Clock-In',
        caption: 'Simultaneous clock-in for agricultural workers with offline persistence in Room SQLite when out of coverage.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa4),
        title: 'Work Reports & Assigned Agricultural Tasks',
        caption: 'Breakdown of hours worked by task (harvesting, pruning, irrigation) for cost allocation in Velneo ERP.',
        badge: 'Android Kotlin',
        device: 'mobile'
      },
      {
        src: resolveImageSrc(fa5),
        title: 'Shift History & ERP Synchronization Status',
        caption: 'Complete supervision of pending clock-ins and confirmation of transfers to the corporate ERP.',
        badge: 'Android Kotlin',
        device: 'mobile'
      }
    ]
  },

  'chumbos-chatbot': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: [
      {
        src: resolveImageSrc(cb1),
        title: 'WhatsApp Chatbot 2.0: Farm Location & Task Delivery',
        caption: 'Autonomous WhatsApp interaction with field workers and drivers: automatic Google Maps coordinates delivery, crew assignment, and real-time status queries.',
        badge: 'Node.js Bot',
        device: 'mobile'
      }
    ]
  },

  'chumbos-portal': {
    logo: resolveImageSrc(logoChumbos),
    companyName: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
    screenshots: []
  },

  'lidia-ecommerce': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: [
      {
        src: resolveImageSrc(pl1),
        title: 'Home Page: Artisanal Bakery Showcase',
        caption: 'Responsive visual design with an interactive catalog of cakes, pastries, and seasonal products.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl2),
        title: 'Product Catalog & Category Filters',
        caption: 'Smooth browsing with high-definition photography and clear dietary/allergen options (gluten-free, etc.).',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl3),
        title: 'Product Page: Cake Customization',
        caption: 'Serving size selector, custom greeting message input, and special ingredient options.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl4),
        title: 'Shopping Cart & Pickup Reservation',
        caption: 'Dynamic order calculation with date and time slot selection for in-store bakery pickup.',
        badge: 'React + Vite',
        device: 'desktop'
      },
      {
        src: resolveImageSrc(pl5),
        title: 'Order Checkout & Email Notifications',
        caption: 'Instant order confirmation connected to an SMTP service to notify both the customer and the master pastry chef.',
        badge: 'React + Vite',
        device: 'desktop'
      }
    ]
  },

  'FichasLidia': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: []
  },
  'lidia-automation': {
    logo: resolveImageSrc(logoLidia),
    companyName: 'Obrador de Pastelería Lidia Helem',
    screenshots: []
  }
};

export const getProjectMedia = (lang: 'es' | 'en' = 'es'): Record<string, ProjectMediaConfig> => {
  return lang === 'en' ? PROJECT_MEDIA_EN : PROJECT_MEDIA;
};

export const LOGO_CHUMBOS = resolveImageSrc(logoChumbos);
export const LOGO_GARBISOFT = resolveImageSrc(logoGarbisoft);
export const LOGO_LIDIA = resolveImageSrc(logoLidia);


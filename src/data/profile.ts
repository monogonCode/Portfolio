export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  title: string;
  institution: string;
  period: string;
  location: string;
  level: string;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number }[];
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  location: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  cvPdfUrl: string;
  cvEnPdfUrl: string;
  about: string;
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  languages: { language: string; level: string }[];
}

export const PROFILE: Profile = {
  name: 'Martín Alejandro Garbiso Ortíz',
  title: 'Desarrollador Full Stack & Mobile',
  subtitle: 'Técnico Superior DAW | Especialista en React, Astro, Android (Kotlin) & Arquitectura Contenerizada',
  phone: '(+34) 665 429 177',
  email: 'martinalejandroo25@gmail.com',
  location: 'Cuevas del Almanzora / Vera, Almería, España',
  github: 'https://github.com/monogonCode',
  githubUsername: 'monogonCode',
  linkedin: 'https://www.linkedin.com/in/martin-alejandro-ortiz-1a3a622b4/',
  cvPdfUrl: '/cv/CV_Martin_26.pdf',
  cvEnPdfUrl: '/cv/CV_Martin_26_EN.pdf',
  about:
    'Desarrollador de software con sólida formación técnica y experiencia práctica en el ciclo completo de desarrollo (Frontend, Backend, Móvil Nativo y DevOps). Apasionado por crear arquitecturas escalables, soluciones móviles robustas y automatización de procesos mediante contenedores y modelos de IA local.',
  experiences: [
    {
      role: 'Desarrollador Full Stack (Prácticas FCT DAW - 500h)',
      company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
      period: '09/02/2026 – 22/05/2026',
      location: 'Cuevas del Almanzora, Almería, España',
      type: 'Prácticas Finales Grado Superior',
      description: [
        'Android Nativo (Kotlin, Room, REST API): Desarrollo integral de sistema de control horario, partes de trabajo y autofichaje móvil con sincronización al ERP Velneo.',
        'Web Full Stack (Astro): Desarrollo de la web corporativa, catálogo digital de variedades de productos y portal interno de canal ético mediante tickets cifrados.',
        'Chatbot & Datos (Node.js/JS, MariaDB, Podman): Automatización de consultas, geolocalización de fincas y partes vía WhatsApp Web en contenedor.',
        'Soporte TI e infraestructura: Mantenimiento preventivo, gestión de redes e incidencias técnicas en sistemas de producción.'
      ],
      technologies: ['Android (Kotlin)', 'Astro', 'Room DB', 'REST API', 'Velneo ERP', 'Node.js', 'MariaDB', 'Podman', 'Linux']
    },
    {
      role: 'Desarrollador Full Stack',
      company: 'Obrador de Pastelería Lidia Helem',
      period: '25/05/2026 – Actual',
      location: 'Almería, España',
      type: 'Freelance / Desarrollo de Producto',
      description: [
        'E-commerce y Automatización (React & Python): Desarrollo de plataforma web con catálogo, carrito de compras, panel administrativo y notificaciones por email.',
        'Automatización en Python para generación masiva de etiquetas por lote, fichas técnicas con alérgenos y optimización SEO.',
        'Ecosistema de Trazabilidad y Auditoría (DeltaTraz): Implementación de sistema end-to-end con app Android OCR y API OpenFoodFacts para captura ágil en planta, exportación a PDF y despliegue en Podman.'
      ],
      technologies: ['React', 'Python (ReportLab)', 'Android (Kotlin)', 'OpenFoodFacts API', 'ML Kit OCR', 'Express', 'Podman']
    }
  ],
  education: [
    {
      title: 'Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
      institution: 'IES Jaroso',
      period: '15/09/2023 – 28/05/2026',
      location: 'Cuevas del Almanzora, Almería',
      level: 'Nivel 5 EQF-MEC'
    },
    {
      title: 'Bachillerato Técnico',
      institution: 'IES El Palmeral',
      period: '15/09/2020 – 22/07/2022',
      location: 'Vera, Almería',
      level: 'Nivel 4 EQF-MEC'
    }
  ],
  skillGroups: [
    {
      category: 'Frontend',
      skills: [
        { name: 'React / Next / Vite', level: 90 },
        { name: 'Astro', level: 92 },
        { name: 'JavaScript / TypeScript', level: 90 },
        { name: 'HTML5 / Modern CSS', level: 95 },
        { name: 'Tailwind CSS / Bootstrap', level: 92 }
      ]
    },
    {
      category: 'Backend & APIs',
      skills: [
        { name: 'Python / FastAPI', level: 88 },
        { name: 'Node.js / Express', level: 85 },
        { name: 'PHP / Laravel', level: 80 },
        { name: 'Java / Spring', level: 78 },
        { name: 'REST APIs & GraphQL', level: 88 }
      ]
    },
    {
      category: 'Mobile',
      skills: [
        { name: 'Android Nativo (Kotlin)', level: 88 },
        { name: 'Jetpack Compose', level: 82 },
        { name: 'Room Database / SQLite', level: 85 },
        { name: 'Bluetooth HID / NDK', level: 80 }
      ]
    },
    {
      category: 'Bases de Datos & DevOps',
      skills: [
        { name: 'Podman / Docker / Compose', level: 90 },
        { name: 'Linux / Bash Scripting', level: 90 },
        { name: 'MariaDB / MySQL', level: 88 },
        { name: 'Nginx / Reverse Proxy', level: 84 },
        { name: 'Git & GitHub', level: 92 }
      ]
    }
  ],
  languages: [
    { language: 'Español', level: 'Nativo' },
    { language: 'Inglés', level: 'B1/B2 (Técnico / Comprensión profesional)' }
  ]
};

export const PROFILE_EN: Profile = {
  name: 'Martín Alejandro Garbiso Ortíz',
  title: 'Full Stack & Mobile Developer',
  subtitle: 'Higher Technician in Web Application Development (DAW) | Specialist in React, Astro, Android (Kotlin) & Containerized Architecture',
  phone: '(+34) 665 429 177',
  email: 'martinalejandroo25@gmail.com',
  location: 'Cuevas del Almanzora / Vera, Almería, Spain',
  github: 'https://github.com/monogonCode',
  githubUsername: 'monogonCode',
  linkedin: 'https://www.linkedin.com/in/martin-alejandro-ortiz-1a3a622b4/',
  cvPdfUrl: '/cv/CV_Martin_26.pdf',
  cvEnPdfUrl: '/cv/CV_Martin_26_EN.pdf',
  about:
    'Software developer with a strong technical background and hands-on experience across the full development lifecycle (Frontend, Backend, Native Mobile, and DevOps). Passionate about building scalable architectures, robust mobile solutions, and process automation using containers and local AI models.',
  experiences: [
    {
      role: 'Full Stack Developer (DAW Internship - 500h)',
      company: 'Explotaciones Agrícolas Hermanos Chumbos S.L.',
      period: '09/02/2026 – 22/05/2026',
      location: 'Cuevas del Almanzora, Almería, Spain',
      type: 'Higher Degree Final Internship',
      description: [
        'Native Android (Kotlin, Room, REST API): End-to-end development of a time-tracking, work report, and mobile self-clocking system synchronized with Velneo ERP.',
        'Full Stack Web (Astro): Development of the corporate website, digital produce variety catalog, and internal encrypted ticket-based ethics channel.',
        'Chatbot & Data (Node.js/JS, MariaDB, Podman): Query automation, farm geolocation, and work reports via containerized WhatsApp Web.',
        'IT Support & Infrastructure: Preventive maintenance, network management, and technical incident resolution in production systems.'
      ],
      technologies: ['Android (Kotlin)', 'Astro', 'Room DB', 'REST API', 'Velneo ERP', 'Node.js', 'MariaDB', 'Podman', 'Linux']
    },
    {
      role: 'Full Stack Developer',
      company: 'Obrador de Pastelería Lidia Helem',
      period: '25/05/2026 – Present',
      location: 'Almería, Spain',
      type: 'Freelance / Product Development',
      description: [
        'E-commerce & Automation (React & Python): Development of a web platform with catalog, shopping cart, admin dashboard, and email notifications.',
        'Python automation for bulk batch label generation, technical data sheets with allergens, and SEO optimization.',
        'Traceability & Auditing Ecosystem (DeltaTraz): Implementation of an end-to-end system with Android OCR app and OpenFoodFacts API for agile plant floor capture, PDF export, and Podman deployment.'
      ],
      technologies: ['React', 'Python (ReportLab)', 'Android (Kotlin)', 'OpenFoodFacts API', 'ML Kit OCR', 'Express', 'Podman']
    }
  ],
  education: [
    {
      title: 'Higher Technician in Web Application Development (DAW)',
      institution: 'IES Jaroso',
      period: '15/09/2023 – 28/05/2026',
      location: 'Cuevas del Almanzora, Almería',
      level: 'EQF-MEC Level 5'
    },
    {
      title: 'Technical Baccalaureate (High School)',
      institution: 'IES El Palmeral',
      period: '15/09/2020 – 22/07/2022',
      location: 'Vera, Almería',
      level: 'EQF-MEC Level 4'
    }
  ],
  skillGroups: [
    {
      category: 'Frontend',
      skills: [
        { name: 'React / Next / Vite', level: 90 },
        { name: 'Astro', level: 92 },
        { name: 'JavaScript / TypeScript', level: 90 },
        { name: 'HTML5 / Modern CSS', level: 95 },
        { name: 'Tailwind CSS / Bootstrap', level: 92 }
      ]
    },
    {
      category: 'Backend & APIs',
      skills: [
        { name: 'Python / FastAPI', level: 88 },
        { name: 'Node.js / Express', level: 85 },
        { name: 'PHP / Laravel', level: 80 },
        { name: 'Java / Spring', level: 78 },
        { name: 'REST APIs & GraphQL', level: 88 }
      ]
    },
    {
      category: 'Mobile',
      skills: [
        { name: 'Native Android (Kotlin)', level: 88 },
        { name: 'Jetpack Compose', level: 82 },
        { name: 'Room Database / SQLite', level: 85 },
        { name: 'Bluetooth HID / NDK', level: 80 }
      ]
    },
    {
      category: 'Databases & DevOps',
      skills: [
        { name: 'Podman / Docker / Compose', level: 90 },
        { name: 'Linux / Bash Scripting', level: 90 },
        { name: 'MariaDB / MySQL', level: 88 },
        { name: 'Nginx / Reverse Proxy', level: 84 },
        { name: 'Git & GitHub', level: 92 }
      ]
    }
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'B1/B2 (Technical / Professional proficiency)' }
  ]
};

export const getProfile = (lang: 'es' | 'en' = 'es'): Profile => {
  return lang === 'en' ? PROFILE_EN : PROFILE;
};

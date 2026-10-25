const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Prepare QR Code for https://garbisoft.duckdns.org
const qrPath = path.join(__dirname, '../public/cv/qr_portfolio.png');
try {
  execSync(`python3 -c "
import qrcode
qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=3, border=1)
qr.add_data('https://garbisoft.duckdns.org')
qr.make(fit=True)
img = qr.make_image(fill_color='#000080', back_color='white')
img.save('${qrPath}')
"`);
} catch (err) {
  console.warn('Could not generate QR with python qrcode, using existing if present:', err.message);
}

let qrBase64 = '';
if (fs.existsSync(qrPath)) {
  qrBase64 = fs.readFileSync(qrPath).toString('base64');
}

// 2. Prepare Profile Photo
const fotoPath = path.join(__dirname, '../src/assets/fotoCV.png');
let fotoBase64 = '';
if (fs.existsSync(fotoPath)) {
  fotoBase64 = fs.readFileSync(fotoPath).toString('base64');
}

function getCVHtml(lang = 'es') {
  const isEn = lang === 'en';

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'es'}">
<head>
  <meta charset="UTF-8">
  <title>${isEn ? 'Resume - Martín Alejandro Garbiso Ortíz' : 'CV - Martín Alejandro Garbiso Ortíz'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      background: #008080;
      font-family: 'Segoe UI', Tahoma, 'DejaVu Sans', sans-serif;
      font-size: 11px;
      color: #0f172a;
      line-height: 1.35;
      padding: 4.5mm;
      display: flex;
      flex-direction: column;
    }

    /* Window Shell (Windows 98 Style) */
    .retro-window {
      background: #d4d0c8;
      border: 2px solid;
      border-color: #ffffff #404040 #404040 #ffffff;
      box-shadow: 2px 2px 0px #000000;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 3px;
    }

    /* Window Titlebar */
    .window-titlebar {
      background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
      color: #ffffff;
      padding: 3px 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 11px;
      letter-spacing: 0.3px;
      user-select: none;
    }

    .titlebar-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .titlebar-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .titlebar-controls {
      display: flex;
      gap: 2px;
    }

    .win-btn {
      width: 15px;
      height: 13px;
      background: #d4d0c8;
      border: 1px solid;
      border-color: #ffffff #404040 #404040 #ffffff;
      font-size: 9px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      line-height: 1;
    }

    .win-btn-square {
      width: 8px;
      height: 7px;
      border: 1.5px solid #000000;
      border-top-width: 2px;
    }

    /* Menu Bar */
    .window-menubar {
      background: #d4d0c8;
      display: flex;
      gap: 12px;
      padding: 3px 6px;
      font-size: 10.5px;
      border-bottom: 1px solid #808080;
    }

    .menu-item span {
      text-decoration: underline;
    }

    /* Header Profile Panel */
    .profile-header {
      background: #ffffff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      padding: 6px 8px;
      margin: 4px 1px 5px 1px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Photo Frame */
    .photo-frame {
      width: 68px;
      height: 72px;
      background: #c0c0c0;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      padding: 1px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 1px 1px 0 #000000;
    }

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .profile-info {
      flex: 1;
      min-width: 0;
    }

    .profile-name {
      font-size: 18px;
      font-weight: 800;
      color: #000080;
      letter-spacing: -0.3px;
      line-height: 1.15;
    }

    .profile-headline {
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      margin-top: 1px;
    }

    /* Interactive Retro Buttons Bar */
    .profile-contacts {
      display: flex;
      flex-wrap: wrap;
      gap: 3px 5px;
      margin-top: 5px;
    }

    .retro-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      font-size: 9.5px;
      font-weight: bold;
      color: #0f172a;
      text-decoration: none;
      background: #d4d0c8;
      border: 1.5px solid;
      border-color: #ffffff #404040 #404040 #ffffff;
      box-shadow: 1px 1px 0 #000000;
      border-radius: 1px;
      cursor: pointer;
      line-height: 1.2;
    }

    .retro-btn:active, .retro-btn:hover {
      border-color: #404040 #ffffff #ffffff #404040;
    }

    .retro-btn svg {
      width: 11px;
      height: 11px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .retro-btn-brand-github {
      background: #24292f;
      color: #ffffff !important;
      border-color: #808080 #000000 #000000 #808080;
    }
    .retro-btn-brand-github svg {
      fill: #ffffff;
    }

    .retro-btn-brand-linkedin {
      background: #0077b5;
      color: #ffffff !important;
      border-color: #60a5fa #004182 #004182 #60a5fa;
    }
    .retro-btn-brand-linkedin svg {
      fill: #ffffff;
    }

    .retro-btn-static {
      cursor: default;
    }

    /* QR Panel */
    .qr-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      background: #f8fafc;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      padding: 3px 6px 2px 6px;
      border-radius: 2px;
      flex-shrink: 0;
      box-shadow: 1px 1px 0 #000000;
      color: #000080;
    }

    .qr-img {
      width: 50px;
      height: 50px;
      display: block;
      image-rendering: pixelated;
    }

    .qr-label {
      font-size: 8px;
      font-weight: 800;
      color: #000080;
      letter-spacing: 0.4px;
      margin-top: 2px;
      text-transform: uppercase;
    }

    .qr-url {
      font-size: 7.5px;
      font-weight: 700;
      color: #16a34a;
    }

    /* Columns Layout */
    .content-grid {
      display: grid;
      grid-template-columns: 66mm 1fr;
      gap: 4px;
      flex: 1;
      overflow: hidden;
    }

    /* Panels */
    .panel {
      background: #ffffff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      display: flex;
      flex-direction: column;
      margin-bottom: 4px;
      overflow: hidden;
    }

    .panel-header {
      background: linear-gradient(90deg, #000080 0%, #2563eb 100%);
      color: #ffffff;
      padding: 2.5px 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .panel-header svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }

    .panel-body {
      padding: 5px 6px;
      font-size: 10px;
      color: #1e293b;
    }

    /* Left Column Specifics */
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .edu-item {
      margin-bottom: 5px;
    }
    .edu-item:last-child {
      margin-bottom: 0;
    }
    .edu-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 10px;
      line-height: 1.2;
    }
    .edu-inst {
      color: #000080;
      font-weight: 700;
      font-size: 9.5px;
    }
    .edu-meta {
      font-size: 9px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      margin-top: 1px;
    }

    .lang-item {
      margin-bottom: 3px;
    }
    .lang-item:last-child {
      margin-bottom: 0;
    }
    .lang-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.5px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1.5px;
    }
    .lang-pct {
      font-size: 9px;
      font-weight: 700;
      color: #0f172a;
    }
    .retro-progress-track {
      border: 1px solid #7f7f7f;
      border-right-color: #dfdfdf;
      border-bottom-color: #dfdfdf;
      background: #ffffff;
      padding: 1px;
      height: 9.5px;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
    .retro-progress-fill {
      height: 100%;
      background: repeating-linear-gradient(
        to right,
        #000080 0px,
        #000080 6.5px,
        #ffffff 6.5px,
        #ffffff 8px
      );
    }

    .skill-cat {
      margin-bottom: 5px;
    }
    .skill-cat:last-child {
      margin-bottom: 0;
    }
    .skill-cat-title {
      font-weight: 800;
      font-size: 9px;
      color: #000080;
      text-transform: uppercase;
      margin-bottom: 2.5px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .skill-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 2.5px;
    }
    .chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 2px;
      padding: 1px 4.5px;
      font-size: 8.5px;
      color: #1e293b;
      font-weight: 600;
      line-height: 1.15;
    }
    .chip.highlight {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1d4ed8;
      font-weight: 700;
    }

    /* Right Column Specifics */
    .right-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .profile-desc {
      font-size: 10px;
      color: #334155;
      text-align: justify;
      line-height: 1.38;
    }

    .job-item {
      margin-bottom: 6px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .job-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .job-role {
      font-weight: 800;
      font-size: 10.5px;
      color: #0f172a;
    }

    .job-period {
      font-size: 9px;
      font-weight: 700;
      color: #000080;
      background: #eff6ff;
      padding: 1px 5px;
      border: 1px solid #bfdbfe;
      border-radius: 2px;
      white-space: nowrap;
    }

    .job-company {
      font-size: 9.5px;
      font-weight: 700;
      color: #0284c7;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .job-company svg {
      width: 11px;
      height: 11px;
      fill: #0284c7;
      flex-shrink: 0;
    }

    .job-subrole {
      font-size: 9px;
      font-style: italic;
      color: #64748b;
      margin-bottom: 2px;
    }

    .job-bullets {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .job-bullets li {
      position: relative;
      padding-left: 9px;
      margin-bottom: 2px;
      font-size: 9.5px;
      color: #334155;
      line-height: 1.32;
    }

    .job-bullets li::before {
      content: '▪';
      position: absolute;
      left: 0;
      color: #0284c7;
      font-size: 9px;
    }

    .job-bullets li b {
      color: #0f172a;
    }

    .job-tech-tag {
      display: inline-block;
      margin-top: 2px;
      font-size: 8.5px;
      color: #475569;
      font-weight: 600;
    }

    /* Window Status Bar */
    .window-statusbar {
      background: #d4d0c8;
      border-top: 1px solid #808080;
      display: flex;
      gap: 3px;
      padding: 2px 2px 0 2px;
      font-size: 9.5px;
      margin-top: 3px;
    }

    .status-cell {
      border: 1px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      padding: 1.5px 6px;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-cell.flex1 {
      flex: 1;
    }
  </style>
</head>
<body>

  <div class="retro-window">
    <!-- 1. Title Bar -->
    <div class="window-titlebar">
      <div class="titlebar-left">
        <!-- Retro Pixel Floppy Icon -->
        <span class="titlebar-icon">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1h10l3 3v11H1V1h1zm1 1v4h8V2H3zm1 1h2v2H4V3zm-1 7v5h10v-5H3z"/>
          </svg>
        </span>
        <span>${isEn ? 'CV_Martin_Garbiso_2026_EN.doc - Official Curriculum Vitae' : 'CV_Martin_Garbiso_2026.doc - Curriculum Vitae Oficial'}</span>
      </div>
      <div class="titlebar-controls">
        <div class="win-btn" style="padding-bottom: 2px;">_</div>
        <div class="win-btn"><div class="win-btn-square"></div></div>
        <div class="win-btn">✕</div>
      </div>
    </div>

    <!-- 2. Menu Bar -->
    <div class="window-menubar">
      ${isEn ? `
      <div class="menu-item"><span>F</span>ile</div>
      <div class="menu-item"><span>E</span>dit</div>
      <div class="menu-item"><span>V</span>iew</div>
      <div class="menu-item"><span>I</span>nsert</div>
      <div class="menu-item">F<span>o</span>rmat</div>
      <div class="menu-item"><span>T</span>ools</div>
      <div class="menu-item"><span>H</span>elp</div>
      ` : `
      <div class="menu-item"><span>A</span>rchivo</div>
      <div class="menu-item"><span>E</span>dición</div>
      <div class="menu-item"><span>V</span>er</div>
      <div class="menu-item"><span>I</span>nsertar</div>
      <div class="menu-item"><span>F</span>ormato</div>
      <div class="menu-item"><span>H</span>erramientas</div>
      <div class="menu-item">A<span>y</span>uda</div>
      `}
    </div>

    <!-- 3. Header Profile Panel with Photo, Interactive Buttons and QR -->
    <div class="profile-header">
      <!-- User Photo -->
      <div class="photo-frame">
        <img src="data:image/png;base64,${fotoBase64}" alt="Martín Alejandro Garbiso Ortíz" class="profile-photo" />
      </div>

      <!-- Main Profile Info & Interactive Buttons -->
      <div class="profile-info">
        <div class="profile-name">MARTÍN ALEJANDRO GARBISO ORTÍZ</div>
        <div class="profile-headline">${isEn ? 'Full Stack &amp; Mobile Developer | Higher Technician in Web App Development (DAW)' : 'Desarrollador Full Stack &amp; Mobile | Técnico Superior DAW'}</div>

        <!-- Interactive Buttons -->
        <div class="profile-contacts">
          <!-- Phone -->
          <a href="tel:+34665429177" class="retro-btn" title="${isEn ? 'Call phone number' : 'Llamar por teléfono'}">
            <svg viewBox="0 0 16 16"><path d="M1 2a1 1 0 011-1h3l2 3-1.5 1.5a10 10 0 005 5L12 9l3 2v3a1 1 0 01-1 1A14 14 0 011 2z"/></svg>
            <span>(+34) 665 429 177</span>
          </a>

          <!-- Email -->
          <a href="mailto:martinalejandroo25@gmail.com" class="retro-btn" title="${isEn ? 'Send email' : 'Enviar correo electrónico'}">
            <svg viewBox="0 0 16 16"><path d="M1 2h14v12H1V2zm1 2v8h12V4L8 8 2 4zm6 3l6-4H2l6 4z"/></svg>
            <span>martinalejandroo25@gmail.com</span>
          </a>

          <!-- Garantia juvenil -->
          <span class="retro-btn retro-btn-static">
          <div class="status-cell">
            <span style="color: #16a34a; font-weight: bold;">●</span>
            <span>${isEn ? 'Enrolled in Youth Guarantee Scheme' : 'Inscrito en el sistema de Garantía Juvenil'}</span>
          </div>
          </span>

          <!-- GitHub Interactive Button -->
          <a href="https://github.com/monogonCode" target="_blank" rel="noreferrer" class="retro-btn retro-btn-brand-github" title="${isEn ? 'Open GitHub profile' : 'Abrir perfil de GitHub'}">
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub @monogonCode</span>
          </a>

          <!-- LinkedIn Interactive Button -->
          <a href="https://www.linkedin.com/in/martin-alejandro-ortiz-1a3a622b4/" target="_blank" rel="noreferrer" class="retro-btn retro-btn-brand-linkedin" title="${isEn ? 'Open LinkedIn profile' : 'Abrir perfil de LinkedIn'}">
            <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span>${isEn ? 'Professional LinkedIn' : 'LinkedIn Profesional'}</span>
          </a>
        </div>
      </div>

      <!-- QR Code pointing to https://garbisoft.duckdns.org -->
      <a href="https://garbisoft.duckdns.org" target="_blank" rel="noreferrer" class="qr-panel" title="${isEn ? 'Scan or click to visit Web Portfolio' : 'Escanear o pulsar para acceder al Portafolio Web'}">
        <img src="data:image/png;base64,${qrBase64}" alt="QR Portfolio" class="qr-img" />
        <div class="qr-label">${isEn ? 'PORTFOLIO' : 'PORTAFOLIO'}</div>
        <div class="qr-url">garbisoft.duckdns.org</div>
      </a>
    </div>

    <!-- 4. Main Two-Column Content Grid -->
    <div class="content-grid">

      <!-- LEFT COLUMN (Narrow): Education, Languages, Stack & Keywords -->
      <div class="left-col">

        <!-- Education -->
        <div class="panel">
          <div class="panel-header">
            <!-- Pixel Graduation Icon -->
            <svg viewBox="0 0 16 16"><path d="M8 1L0 5l8 4 6-3v4h2V5L8 1zM2 8.5v3.5c0 1.5 2.7 3 6 3s6-1.5 6-3V8.5L8 12 2 8.5z"/></svg>
            <span>${isEn ? 'EDUCATION' : 'FORMACIÓN ACADÉMICA'}</span>
          </div>
          <div class="panel-body">
            <div class="edu-item">
              <div class="edu-title">${isEn ? 'Higher VET in Web Application Development (DAW)' : 'C.F.G.S. Desarrollo de Aplicaciones Web (DAW)'}</div>
              <div class="edu-inst">IES Jaroso • Cuevas del Almanzora${isEn ? ', Spain' : ''}</div>
              <div class="edu-meta">
                <span>2023 – 2026</span>
                <span style="font-weight: 700; color: #16a34a;">${isEn ? 'Level 5 EQF-MEC' : 'Nivel 5 EQF-MEC'}</span>
              </div>
            </div>
            <div class="edu-item" style="margin-top: 4px; padding-top: 4px; border-top: 1px dotted #cbd5e1;">
              <div class="edu-title">${isEn ? 'Technology High School Diploma (Bachillerato)' : 'Bachillerato Técnico'}</div>
              <div class="edu-inst">IES El Palmeral • Vera${isEn ? ', Spain' : ''}</div>
              <div class="edu-meta">
                <span>2020 – 2022</span>
                <span style="font-weight: 700; color: #16a34a;">${isEn ? 'Level 4 EQF-MEC' : 'Nivel 4 EQF-MEC'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Languages -->
        <div class="panel">
          <div class="panel-header">
            <!-- Pixel Globe Icon -->
            <svg viewBox="0 0 16 16"><path d="M7 0h2v2h2v2h2v2h2v4h-2v2h-2v2H9v2H7v-2H5v-2H3v-2H1V6h2V4h2V2h2V0zm1 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm-1 2h2v2H7V4zm-3 2h2v2H4V6zm6 0h2v2h-2V6zm-5 4h2v2H5v-2zm4 0h2v2H9v-2z"/></svg>
            <span>${isEn ? 'LANGUAGES' : 'IDIOMAS'}</span>
          </div>
          <div class="panel-body" style="padding-top: 3px; padding-bottom: 3px;">
            <div class="lang-item">
              <div class="lang-header">
                <span style="font-weight: bold;">${isEn ? 'Spanish' : 'Español'}</span>
              </div>
              <div class="retro-progress-track">
                <div class="retro-progress-fill" style="width: 100%;"></div>
              </div>
            </div>
            <div class="lang-item" style="margin-top: 3.5px;">
              <div class="lang-header">
                <span style="font-weight: bold;">${isEn ? 'English' : 'Inglés'}</span>
              </div>
              <div class="retro-progress-track">
                <div class="retro-progress-fill" style="width: 55%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technologies & Stack (Expands to fill vertical left space) -->
        <div class="panel" style="flex: 1;">
          <div class="panel-header">
            <!-- Pixel Zap Icon -->
            <svg viewBox="0 0 16 16"><path d="M9 0H6v6H2v2h3l-2 8 11-10H9V0z"/></svg>
            <span>${isEn ? 'TECHNOLOGIES' : 'TECNOLOGÍAS'}</span>
          </div>
          <div class="panel-body" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="skill-cat">
              <div class="skill-cat-title">Frontend</div>
              <div class="skill-chips">
                <span class="chip highlight">React</span>
                <span class="chip highlight">Astro</span>
                <span class="chip highlight">TypeScript</span>
                <span class="chip">JavaScript</span>
                <span class="chip highlight">Tailwind CSS</span>
                <span class="chip">HTML5 / CSS3</span>
                <span class="chip">Bootstrap 5</span>
                <span class="chip">Angular</span>
              </div>
            </div>

            <div class="skill-cat">
              <div class="skill-cat-title">Backend &amp; Mobile</div>
              <div class="skill-chips">
                <span class="chip highlight">Android Kotlin</span>
                <span class="chip highlight">Python</span>
                <span class="chip highlight">Node.js</span>
                <span class="chip">Express</span>
                <span class="chip">Java</span>
                <span class="chip">PHP / Laravel</span>
                <span class="chip highlight">REST APIs</span>
                <span class="chip">Room DB</span>
              </div>
            </div>

            <div class="skill-cat">
              <div class="skill-cat-title">${isEn ? 'DevOps, Systems &amp; Data' : 'DevOps, Sistemas &amp; Datos'}</div>
              <div class="skill-chips">
                <span class="chip highlight">Podman</span>
                <span class="chip highlight">Docker</span>
                <span class="chip highlight">Linux / Bash</span>
                <span class="chip highlight">MariaDB</span>
                <span class="chip">MySQL</span>
                <span class="chip">Nginx</span>
                <span class="chip">Git / GitHub</span>
                <span class="chip">AWS</span>
              </div>
            </div>

            <div class="skill-cat">
              <div class="skill-cat-title">${isEn ? 'Tools &amp; Methodologies' : 'Herramientas &amp; Metodologías'}</div>
              <div class="skill-chips">
                <span class="chip">IntelliJ</span>
                <span class="chip">Android Studio</span>
                <span class="chip">VS Code</span>
                <span class="chip">ReportLab</span>
                <span class="chip">${isEn ? 'SEO Optimization' : 'Posicionamiento SEO'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN (Wide): Profile & Experience -->
      <div class="right-col">

        <!-- Profile Summary -->
        <div class="panel">
          <div class="panel-header">
            <!-- Pixel User Icon -->
            <svg viewBox="0 0 16 16"><path d="M6 1h4v4H6V1zM4 6h8v2H4V6zm-2 3h12v2H2V9zm-1 3h14v4H1v-4z"/></svg>
            <span>${isEn ? 'PROFESSIONAL SUMMARY' : 'PERFIL PROFESIONAL'}</span>
          </div>
          <div class="panel-body">
            <p class="profile-desc">
              ${isEn
                ? 'Solid technical foundation and hands-on experience across the entire application lifecycle: <b>reactive frontend</b>, <b>scalable backend APIs</b>, <b>native Android development</b>, and <b>containerized orchestration with Podman/Docker in Linux environments</b>.'
                : 'Sólida base técnica y experiencia práctica en el ciclo de vida completo de aplicaciones: <b>frontend reactivo</b>, <b>APIs backend escalables</b>, <b>desarrollo nativo Android</b> y <b>orquestación contenerizada con Podman/Docker en entornos Linux</b>.'
              }
            </p>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="panel" style="flex: 1;">
          <div class="panel-header">
            <!-- Pixel Briefcase Icon -->
            <svg viewBox="0 0 16 16"><path d="M5 1h6v2h4v12H1V3h4V1zm2 1v1h2V2H7zM3 5v2h10V5H3zm0 4v5h10V9H3z"/></svg>
            <span>${isEn ? 'WORK EXPERIENCE' : 'EXPERIENCIA LABORAL'}</span>
          </div>
          <div class="panel-body" style="display: flex; flex-direction: column; gap: 5px;">

            <!-- 1. Obrador Lidia Helem -->
            <div class="job-item">
              <div class="job-header">
                <span class="job-role">${isEn ? 'FULL STACK &amp; AUTOMATION DEVELOPER' : 'DESARROLLADOR FULL STACK &amp; AUTOMATIZACIÓN'}</span>
                <span class="job-period">${isEn ? '25/05/2026 – Present' : '25/05/2026 – Actual'}</span>
              </div>
              <div class="job-company">
                <svg viewBox="0 0 16 16"><path d="M2 1h7v14H2V1zm9 3h4v11h-4V4zm-7 2h2v2H4V6zm0 4h2v2H4v-2zm7-2h2v2h-2V8zm0 4h2v2h-2v-2z"/></svg>
                <span>Obrador de Pastelería Lidia Helem • Almería, ${isEn ? 'Spain' : 'España'}</span>
              </div>
              <ul class="job-bullets">
                <li>
                  ${isEn
                    ? '<b>E-commerce &amp; Management Dashboard (React, Vite, Express, SMTP):</b> Architecture and development of the digital storefront, interactive custom cake catalog, dynamic cart, pickup date scheduler, and automated email notifications.'
                    : '<b>E-commerce y Panel de Gestión (React, Vite, Express, SMTP):</b> Arquitectura y desarrollo de la tienda digital, catálogo interactivo de tartas personalizadas, carrito dinámico, selector de fecha de recogida y notificaciones automáticas por email.'
                  }
                </li>
                <li>
                  ${isEn
                    ? '<b>Process Automation (Python &amp; ReportLab):</b> Batch generation of regulatory-compliant technical data sheets in PDF for allergens and nutritional tables, reducing administrative overhead and boosting web SEO.'
                    : '<b>Automatización de Procesos (Python &amp; ReportLab):</b> Generación por lote de fichas técnicas en PDF homologadas sanitariamente para alérgenos y tablas nutricionales, reduciendo tiempos administrativos e impulsando SEO web.'
                  }
                </li>
                <li>
                  ${isEn
                    ? '<b>DeltaTraz Ecosystem (Android Kotlin, OCR, Podman):</b> Comprehensive end-to-end food traceability platform featuring a native Android app for OCR ingredient scanning, OpenFoodFacts integration, and containerized deployment.'
                    : '<b>Ecosistema DeltaTraz (Android Kotlin, OCR, Podman):</b> Plataforma integral de trazabilidad alimentaria end-to-end con app Android nativa para escaneo OCR de ingredientes, conexión con OpenFoodFacts y despliegue contenerizado.'
                  }
                </li>
              </ul>
              <div class="job-tech-tag">Stack: React • Node/Express • Python (ReportLab) • Kotlin • ML Kit OCR • Podman • MariaDB</div>
            </div>

            <!-- 2. HNOS Chumbos -->
            <div class="job-item">
              <div class="job-header">
                <span class="job-role">${isEn ? 'APPLICATION DEVELOPER (Workplace Training FCT DAW - 500 h)' : 'DESARROLLADOR DE APLICACIONES (Prácticas FCT DAW - 500 h)'}</span>
                <span class="job-period">09/02/2026 – 22/05/2026</span>
              </div>
              <div class="job-company">
                <svg viewBox="0 0 16 16"><path d="M2 1h7v14H2V1zm9 3h4v11h-4V4zm-7 2h2v2H4V6zm0 4h2v2H4v-2zm7-2h2v2h-2V8zm0 4h2v2h-2v-2z"/></svg>
                <span>Explotaciones Agrícolas Hermanos Chumbos S.L. • Cuevas del Almanzora, Almería</span>
              </div>
              <div class="job-subrole">${isEn ? 'Full autonomy in technology stack selection and delivery of production solutions:' : 'Autonomía total en selección del stack tecnológico y entrega de soluciones de producción:'}</div>
              <ul class="job-bullets">
                <li>
                  ${isEn
                    ? '<b>Native Android App (Kotlin, Room DB, REST API):</b> End-to-end development of mobile time-tracking, work logs, and geolocated clock-in system with bidirectional synchronization to Velneo ERP software.'
                    : '<b>App Android Nativa (Kotlin, Room DB, REST API):</b> Desarrollo integral del sistema móvil de control horario, partes de trabajo y autofichaje geolocalizado con sincronización bidireccional al software ERP Velneo.'
                  }
                </li>
                <li>
                  ${isEn
                    ? '<b>Full Stack Web &amp; Whistleblowing Channel (Astro, Prisma, MariaDB):</b> Development of corporate web portal, dynamic agricultural product catalog, and confidential whistleblowing channel complying with EU regulations.'
                    : '<b>Web Full Stack &amp; Canal Ético (Astro, Prisma, MariaDB):</b> Creación del portal corporativo, catálogo dinámico de productos hortofrutícolas y buzón confidencial de denuncias éticas según normativa europea.'
                  }
                </li>
                <li>
                  ${isEn
                    ? '<b>Autonomous WhatsApp Chatbot (Node.js, MariaDB, Podman):</b> 24/7 containerized assistant for field worker inquiries and real-time farmland GPS coordinate lookup.'
                    : '<b>Chatbot Autónomo WhatsApp (Node.js, MariaDB, Podman):</b> Asistente 24/7 en contenedor para resolución de consultas de operarios y geolocalización de coordenadas de parcelas agrícolas en tiempo real.'
                  }
                </li>
                <li>
                  ${isEn
                    ? '<b>IT Support &amp; Infrastructure:</b> Preventive maintenance, network administration, and operational technical support.'
                    : '<b>Soporte TI e Infraestructura:</b> Mantenimiento preventivo, administración de redes y soporte operativo.'
                  }
                </li>
              </ul>
              <div class="job-tech-tag">Stack: Android Kotlin • Room SQLite • Astro • Prisma ORM • Node.js • Velneo ERP • Podman</div>
            </div>

            <!-- 3. Profesor Particular -->
            <div class="job-item">
              <div class="job-header">
                <span class="job-role">${isEn ? 'PRIVATE TUTOR IN COMPUTER SCIENCE &amp; ICT' : 'PROFESOR PARTICULAR DE INFORMÁTICA Y TIC'}</span>
                <span class="job-period">28/09/2022 – 20/04/2023</span>
              </div>
              <div class="job-company">
                <svg viewBox="0 0 16 16"><path d="M2 1h7v14H2V1zm9 3h4v11h-4V4zm-7 2h2v2H4V6zm0 4h2v2H4v-2zm7-2h2v2h-2V8zm0 4h2v2h-2v-2z"/></svg>
                <span>${isEn ? 'Personalized Private Tutoring • Turre, Almería' : 'Clases Particulares Personalizadas • Turre, Almería'}</span>
              </div>
              <ul class="job-bullets">
                <li>
                  ${isEn
                    ? 'Delivered customized classes from beginner level: operating system management, file organization, safe web browsing, and advanced office productivity tools (Word, Excel, PowerPoint).'
                    : 'Impartición de clases adaptadas desde nivel cero: manejo seguro de sistemas operativos, organización de archivos, navegación web y formación avanzada en herramientas ofimáticas (Word, Excel, PowerPoint).'
                  }
                </li>
                <li>
                  ${isEn
                    ? 'Pedagogical mentoring with outstanding academic results and complete student autonomy in ICT skills.'
                    : 'Capacitación pedagógica con excelentes resultados académicos y autonomía total del alumnado en materias TIC.'
                  }
                </li>
              </ul>
            </div>

            <!-- 4. Voluntariado Cruz Roja -->
            <div class="job-item">
              <div class="job-header">
                <span class="job-role">${isEn ? 'VOLUNTEER - SCHOOL SUCCESS PROGRAM' : 'VOLUNTARIO - PROGRAMA ÉXITO ESCOLAR'}</span>
                <span class="job-period">15/09/2023 – 15/03/2024</span>
              </div>
              <div class="job-company">
                <svg viewBox="0 0 16 16"><path d="M2 1h7v14H2V1zm9 3h4v11h-4V4zm-7 2h2v2H4V6zm0 4h2v2H4v-2zm7-2h2v2h-2V8zm0 4h2v2h-2v-2z"/></svg>
                <span>${isEn ? 'Spanish Red Cross • Vera, Almería' : 'Cruz Roja Española • Vera, Almería'}</span>
              </div>
              <ul class="job-bullets">
                <li>
                  ${isEn
                    ? 'Academic support and educational tutoring for primary school children in mathematics, reading comprehension, and motivation.'
                    : 'Apoyo pedagógico y refuerzo educativo a menores de primaria en matemáticas, comprensión lectora y motivación.'
                  }
                </li>
              </ul>
            </div>

            <!-- 5. Camarero de Sala y Barra (Hostelería) -->
            <div class="job-item">
              <div class="job-header">
                <span class="job-role">${isEn ? 'RESTAURANT &amp; BAR SERVER' : 'CAMARERO DE RESTAURANTE Y SALA'}</span>
                <span class="job-period">2022 – 2023</span>
              </div>
              <div class="job-company">
                <svg viewBox="0 0 16 16"><path d="M2 1h7v14H2V1zm9 3h4v11h-4V4zm-7 2h2v2H4V6zm0 4h2v2H4v-2zm7-2h2v2h-2V8zm0 4h2v2h-2v-2z"/></svg>
                <span>Gelatería Alberto's (Mojácar) • Rincón del Puerto (Garrucha)</span>
              </div>
              <ul class="job-bullets">
                <li>
                  ${isEn
                    ? 'Customer service in dining room, bar, and outdoor terrace during peak seasonal periods.'
                    : 'Atención al cliente en sala, barra y terraza durante temporadas de alta afluencia.'
                  }
                </li>
                <li>
                  ${isEn
                    ? 'Team coordination, prompt issue resolution, effective stress management, and operational support.'
                    : 'Coordinación constante en equipo, resolución ágil de incidencias, gestión eficaz del estrés y refuerzo logístico.'
                  }
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>

    <!-- 5. Window Status Bar -->
    <div class="window-statusbar">
      <div class="status-cell">
        <span style="color: #16a34a; font-weight: bold;">●</span>
        <span>${isEn ? 'Document Ready' : 'Documento Listo'}</span>
      </div>
      <div class="status-cell flex1">
        <span>Curriculum Vitae</span>
      </div>
      <div class="status-cell">
        <span>Garbisoft</span>
      </div>
    </div>

  </div>

</body>
</html>
`;
}

function buildPDF(lang = 'es') {
  const isEn = lang === 'en';
  const outFilename = isEn ? 'CV_Martin_26_EN.pdf' : 'CV_Martin_26.pdf';
  const outputPath = path.join(__dirname, '../public/cv', outFilename);
  const tempHtmlPath = path.join(__dirname, `../public/cv/temp_cv_${lang}.html`);

  console.log(`\n[${lang.toUpperCase()}] Writing temporary HTML file...`);
  fs.writeFileSync(tempHtmlPath, getCVHtml(lang), 'utf8');

  console.log(`[${lang.toUpperCase()}] Generating PDF via Chromium headless to ${outFilename}...`);
  const cmd = `chromium --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${outputPath}" "file://${tempHtmlPath}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`[${lang.toUpperCase()}] PDF successfully created at: ${outputPath}`);
    fs.unlinkSync(tempHtmlPath);
  } catch (err) {
    console.error(`[${lang.toUpperCase()}] Error generating PDF:`, err);
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    process.exit(1);
  }
}

// Generate both ES and EN PDFs
buildPDF('es');
buildPDF('en');

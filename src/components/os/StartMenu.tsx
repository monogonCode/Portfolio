import React from 'react';
import { PROFILE } from '../../data/profile';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PixelFolder,
  PixelFileText,
  PixelTerminal,
  PixelSettings,
  PixelMail,
  PixelGamepad,
  PixelDownload,
  PixelPower,
  PixelUser,
  PixelGithub,
  PixelLinkedin,
  PixelGlobe,
  PixelSparkles
} from '../ui/RetroIcons';
import { LOGO_CHUMBOS } from '../../data/projectMedia';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onShutDown: () => void;
  currentTheme?: string;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onShutDown,
  currentTheme = 'win98'
}) => {
  const { isEn } = useLanguage();

  if (!isOpen) return null;

  const handleAppClick = (appId: string) => {
    sound.playClick();
    onOpenApp(appId);
    onClose();
  };

  const isXP = currentTheme === 'winxp';
  const isMac = currentTheme === 'mac';

  // Classic Macintosh System 7 Apple Menu
  if (isMac) {
    return (
      <div className="system7-dropdown-menu">
        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('cv')}
          title={isEn ? 'About This Macintosh...' : 'Acerca de este Macintosh...'}
        >
          <img src="/images/icons/mac/apple.png" alt="" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 'bold' }}>{isEn ? 'About This Macintosh...' : 'Acerca de este Macintosh...'}</span>
        </div>

        <div className="system7-dropdown-divider" />

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('projects')}
          title={isEn ? "Martín's Project Explorer" : 'Explorador de Proyectos de Martín'}
        >
          <img src="/images/icons/mac/folder.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Project Explorer' : 'Explorador de Proyectos'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('folder-chumbos')}
          title={isEn ? 'HNOS Chumbos Folder' : 'Carpeta HNOS Chumbos'}
        >
          <img src="/images/icons/mac/folder.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'HNOS Chumbos Folder (3 apps)' : 'Carpeta HNOS Chumbos (3 apps)'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('image-viewer')}
          title={isEn ? 'Screenshot Viewer' : 'Visor de Capturas de Pantalla'}
        >
          <img src="/images/icons/mac/macse.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Image Viewer' : 'Visor de Imágenes'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('cv')}
          title={isEn ? 'Official Curriculum Vitae' : 'Curriculum Vitae Oficial'}
        >
          <img src="/images/icons/mac/doc.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>Curriculum Vitae (PDF)</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('browser')}
          title={isEn ? 'Web Browser' : 'Navegador Web'}
        >
          <img src="/images/icons/mac/macse.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Web Browser' : 'Navegador Web'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('terminal')}
          title={isEn ? 'Macintosh Terminal' : 'Terminal Macintosh'}
        >
          <img src="/images/icons/mac/terminal.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Macintosh Terminal' : 'Terminal Macintosh'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('settings')}
          title={isEn ? 'Control Panel & Themes' : 'Panel de Control y Temas'}
        >
          <img src="/images/icons/mac/hd.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Control Panel (Themes)' : 'Panel de Control (Temas)'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('contact')}
          title={isEn ? 'Contact / Email' : 'Contacto / Email'}
        >
          <img src="/images/icons/mac/doc.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
          <span>{isEn ? 'Contact (Email)' : 'Contacto (Email)'}</span>
        </div>

        <div
          className="system7-dropdown-item"
          onClick={() => handleAppClick('minesweeper')}
          title={isEn ? 'Minesweeper Game' : 'Juego Buscaminas'}
        >
          <PixelGamepad size={15} color="#000000" />
          <span>{isEn ? 'Game: Minesweeper' : 'Juego: Buscaminas'}</span>
        </div>

        <div className="system7-dropdown-divider" />

        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="system7-dropdown-item"
          onClick={() => sound.playClick()}
        >
          <PixelGithub size={15} color="#000000" />
          <span>GitHub (@{PROFILE.githubUsername})</span>
        </a>

        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer"
          className="system7-dropdown-item"
          onClick={() => sound.playClick()}
        >
          <PixelLinkedin size={15} color="#000000" />
          <span>{isEn ? 'Professional LinkedIn' : 'LinkedIn Profesional'}</span>
        </a>

        <div className="system7-dropdown-divider" />

        <div
          className="system7-dropdown-item"
          onClick={() => {
            sound.playClick();
            onShutDown();
            onClose();
          }}
          style={{ fontWeight: 'bold' }}
        >
          <PixelPower size={15} color="#000000" />
          <span>{isEn ? 'Shut Down...' : 'Apagar el equipo...'}</span>
        </div>
      </div>
    );
  }

  // Windows XP Luna Dual-Column Start Menu
  if (isXP) {
    return (
      <div className="xp-start-menu">
        {/* Blue Header with Avatar and User Name */}
        <div className="xp-menu-header">
          <img
            src="/images/icons/xp/user.webp"
            alt={PROFILE.name}
            className="xp-menu-avatar"
          />
          <div className="xp-menu-username">{PROFILE.name}</div>
        </div>

        {/* 2-Column Body */}
        <div className="xp-menu-body">
          {/* Left Column (White) - Pinned Applications */}
          <div className="xp-menu-left">
            <div
              className="xp-left-item"
              onClick={() => handleAppClick('browser')}
              title={isEn ? 'Browse the Web with Internet Explorer' : 'Navegar por la Web con Internet Explorer'}
            >
              <img src="/images/icons/xp/ie.webp" alt="IE" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">Internet</div>
                <div className="xp-item-sub">Internet Explorer</div>
              </div>
            </div>

            <div
              className="xp-left-item"
              onClick={() => handleAppClick('contact')}
              title={isEn ? 'Send an email or contact message' : 'Enviar correo o mensaje de contacto'}
            >
              <img src="/images/icons/xp/outlook.webp" alt="Outlook" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">{isEn ? 'E-mail' : 'Correo electrónico'}</div>
                <div className="xp-item-sub">Outlook Express</div>
              </div>
            </div>

            <div className="xp-menu-divider-left" />

            <div
              className="xp-left-item"
              onClick={() => handleAppClick('transres-audio')}
              title={
                isEn
                  ? 'Open AI Audio Transcription & Restoration'
                  : 'Abrir IA de Transcripción y Restauración de Audio'
              }
            >
              <img src="/images/icons/xp/media-player.webp" alt="Media Player" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">Windows Media</div>
                <div className="xp-item-sub">TransResAudio.ai</div>
              </div>
            </div>

            <div
              className="xp-left-item"
              onClick={() => handleAppClick('minesweeper')}
              title={isEn ? 'Play classic Minesweeper' : 'Jugar al Buscaminas clásico'}
            >
              <img src="/images/icons/xp/minesweeper.webp" alt="Buscaminas" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">{isEn ? 'Minesweeper' : 'Buscaminas'}</div>
                <div className="xp-item-sub">{isEn ? 'Retro game' : 'Juego retro'}</div>
              </div>
            </div>

            <div
              className="xp-left-item"
              onClick={() => handleAppClick('terminal')}
              title={isEn ? 'Open MS-DOS command prompt' : 'Abrir consola de comandos MS-DOS'}
            >
              <img src="/images/icons/xp/cmd.webp" alt="CMD" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">{isEn ? 'Command Prompt' : 'Símbolo del sistema'}</div>
                <div className="xp-item-sub">{isEn ? 'MS-DOS Terminal' : 'Terminal MS-DOS'}</div>
              </div>
            </div>

            <div
              className="xp-left-item"
              onClick={() => handleAppClick('image-viewer')}
              title={
                isEn
                  ? 'View high-resolution real project screenshots'
                  : 'Ver capturas reales de proyectos en alta resolución'
              }
            >
              <img src="/images/icons/xp/display.webp" alt="Visor" className="xp-left-icon" />
              <div>
                <div className="xp-item-title">{isEn ? 'Image Viewer' : 'Visor de Imágenes'}</div>
                <div className="xp-item-sub">{isEn ? 'Project gallery' : 'Galería de proyectos'}</div>
              </div>
            </div>

            {/* Bottom "All Programs" trigger */}
            <div
              className="xp-all-programs"
              onClick={() => handleAppClick('projects')}
            >
              <span>{isEn ? 'All Programs' : 'Todos los programas'}</span>
              <span style={{ color: '#16a34a', fontSize: '13px' }}>▶</span>
            </div>
          </div>

          {/* Right Column (Light Blue) - System & Folders */}
          <div className="xp-menu-right">
            <div
              className="xp-right-item"
              onClick={() => handleAppClick('cv')}
              title={isEn ? 'View Official Curriculum Vitae' : 'Ver Curriculum Vitae Oficial'}
            >
              <img src="/images/icons/xp/wordpad.webp" alt="CV" className="xp-right-icon" />
              <span>{isEn ? 'My Documents (CV)' : 'Mis documentos (CV)'}</span>
            </div>

            <div
              className="xp-right-item"
              onClick={() => handleAppClick('projects')}
              title={isEn ? "Martín's Project Explorer" : 'Explorador de Proyectos de Martín'}
            >
              <img src="/images/icons/xp/display.webp" alt="Mi PC" className="xp-right-icon" />
              <span>{isEn ? 'My Computer (Projects)' : 'Mi PC (Proyectos)'}</span>
            </div>

            <div
              className="xp-right-item"
              onClick={() => handleAppClick('delta-servers')}
              title={
                isEn
                  ? 'Linux Servers, Podman & Microservices'
                  : 'Servidores Linux, Podman y Microservicios'
              }
            >
              <img src="/images/icons/xp/network.webp" alt="Red" className="xp-right-icon" />
              <span>{isEn ? 'My Network Places' : 'Mis sitios de red'}</span>
            </div>

            <div
              className="xp-right-item"
              onClick={() => handleAppClick('folder-chumbos')}
              title={
                isEn
                  ? 'HNOS Chumbos Folder: Web, Time-Tracking App & Chatbot'
                  : 'Carpeta HNOS Chumbos: Web, App Fichajes y Chatbot'
              }
            >
              <img src="/images/icons/xp/folder.webp" alt="Folder" className="xp-right-icon" />
              <span>HNOS Chumbos (3 apps)</span>
            </div>

            <div className="xp-menu-divider-right" />

            <div
              className="xp-right-item"
              onClick={() => handleAppClick('settings')}
              title={
                isEn
                  ? 'Customize theme, CRT, audio, and wallpaper'
                  : 'Personalizar tema, CRT, audio y fondo de pantalla'
              }
            >
              <img src="/images/icons/xp/display.webp" alt="Config" className="xp-right-icon" />
              <span>{isEn ? 'Control Panel' : 'Panel de control'}</span>
            </div>

            <div className="xp-menu-divider-right" />

            <div
              className="xp-right-item"
              onClick={() => handleAppClick('projects')}
              title={isEn ? 'Search projects in catalog' : 'Buscar proyectos en el catálogo'}
            >
              <img src="/images/icons/xp/search.webp" alt="Buscar" className="xp-right-icon" />
              <span>{isEn ? 'Search' : 'Buscar'}</span>
            </div>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="xp-right-item"
              onClick={() => sound.playClick()}
            >
              <PixelGithub size={18} color="#24292e" />
              <span>GitHub (@{PROFILE.githubUsername})</span>
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="xp-right-item"
              onClick={() => sound.playClick()}
            >
              <PixelLinkedin size={18} color="#0284c7" />
              <span>{isEn ? 'Professional LinkedIn' : 'LinkedIn Profesional'}</span>
            </a>
          </div>
        </div>

        {/* Blue Footer with Log Off and Turn Off buttons */}
        <div className="xp-menu-footer">
          <button
            className="xp-footer-btn"
            onClick={() => {
              sound.playClick();
              onOpenApp('settings');
              onClose();
            }}
          >
            <img src="/images/icons/xp/switch-user.webp" alt="" style={{ width: '20px', height: '20px' }} />
            <span>{isEn ? 'Log Off' : 'Cerrar sesión'}</span>
          </button>

          <button
            className="xp-footer-btn"
            onClick={() => {
              sound.playClick();
              onShutDown();
              onClose();
            }}
          >
            <img src="/images/icons/xp/restart.webp" alt="" style={{ width: '20px', height: '20px' }} />
            <span>{isEn ? 'Turn Off Computer' : 'Apagar el equipo'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Classic Windows 98 Start Menu
  return (
    <div className="retro-start-menu">
      {/* Side Banner */}
      <div className="start-menu-banner">
        MARTÍN OS '26
      </div>

      {/* Main Column */}
      <div className="start-menu-content">
        {/* User Header */}
        <div className="start-menu-header">
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PixelUser size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{PROFILE.name}</div>
            <div style={{ fontSize: '10px', opacity: 0.85 }}>
              {isEn ? 'Full Stack & Mobile Developer' : 'Técnico Superior DAW'}
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div style={{ padding: '4px 0' }}>
          <div className="start-menu-item" onClick={() => handleAppClick('projects')}>
            <PixelFolder size={16} color="#eab308" />
            <span>{isEn ? 'Project Explorer' : 'Explorador de Proyectos'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('folder-chumbos')}>
            <img src={LOGO_CHUMBOS} style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="" />
            <span>{isEn ? 'HNOS Chumbos Folder (3 apps)' : 'Carpeta HNOS Chumbos (3 apps)'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('image-viewer')}>
            <PixelSparkles size={16} color="#0284c7" />
            <span>{isEn ? 'Image & Screenshot Viewer' : 'Visor de Imágenes y Capturas'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('cv')}>
            <PixelFileText size={16} color="#0284c7" />
            <span>Curriculum Vitae</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('browser')}>
            <PixelGlobe size={16} color="#0284c7" />
            <span>Internet Explorer</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('terminal')}>
            <PixelTerminal size={16} color="#16a34a" />
            <span>{isEn ? 'MS-DOS Prompt' : 'Símbolo de MS-DOS'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('settings')}>
            <PixelSettings size={16} color="#475569" />
            <span>{isEn ? 'Display Properties' : 'Propiedades de Pantalla'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('contact')}>
            <PixelMail size={16} color="#dc2626" />
            <span>{isEn ? 'Outlook Express (Contact)' : 'Outlook Express (Contacto)'}</span>
          </div>

          <div className="start-menu-item" onClick={() => handleAppClick('minesweeper')}>
            <PixelGamepad size={16} color="#8b5cf6" />
            <span>{isEn ? 'Game: Minesweeper' : 'Juego: Buscaminas'}</span>
          </div>

          <div className="start-menu-divider" />

          {/* External Links with Pixel Icons */}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="start-menu-item"
            onClick={() => sound.playClick()}
          >
            <PixelGithub size={16} color="#24292e" />
            <span>GitHub (@{PROFILE.githubUsername})</span>
          </a>

          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="start-menu-item"
            onClick={() => sound.playClick()}
          >
            <PixelLinkedin size={16} color="#0284c7" />
            <span>{isEn ? 'Professional LinkedIn' : 'LinkedIn Profesional'}</span>
          </a>

          <a
            href={isEn ? PROFILE.cvEnPdfUrl : PROFILE.cvPdfUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="start-menu-item"
            onClick={() => sound.playClick()}
          >
            <PixelDownload size={16} color="#16a34a" />
            <span>{isEn ? 'Download CV (PDF)' : 'Descargar CV (PDF)'}</span>
          </a>

          <div className="start-menu-divider" />

          {/* Shut down button */}
          <div
            className="start-menu-item"
            onClick={() => {
              sound.playClick();
              onShutDown();
              onClose();
            }}
            style={{ color: '#991b1b' }}
          >
            <PixelPower size={16} color="#dc2626" />
            <span>{isEn ? 'Shut Down...' : 'Apagar el sistema...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


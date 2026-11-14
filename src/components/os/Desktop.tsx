import React, { useState, useEffect } from 'react';
import { DesktopIcon, type DesktopIconItem } from './DesktopIcon';
import { PROJECTS } from '../../data/projects';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import type { SnapRect } from './Window';
import {
  PixelFolder,
  PixelTerminal,
  PixelSettings,
  PixelGithub,
  PixelSliders,
  PixelLanguage
} from '../ui/RetroIcons';

import {
  LOGO_CHUMBOS,
  LOGO_GARBISOFT,
  LOGO_LIDIA,
  LOGO_CONTROID,
  LOGO_XANA,
  LOGO_TRANSRES,
  LOGO_DELTA_SERVERS,
  LOGO_GLADOS,
  LOGO_FICHAS_LIDIA
} from '../../data/projectMedia';

interface DesktopProps {
  selectedIconId: string | null;
  onSelectIcon: (id: string | null) => void;
  onOpenApp: (appId: string) => void;
  currentBg: string;
  snapPreview?: SnapRect | null;
  currentTheme?: string;
  children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({
  selectedIconId,
  onSelectIcon,
  onOpenApp,
  currentBg,
  snapPreview,
  currentTheme = 'win98',
  children
}) => {
  const { isEn, toggleLang } = useLanguage();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });

  const isMac = currentTheme === 'mac';

  // HNOS Chumbos folder icon
  const folderChumbosIcon: DesktopIconItem = {
    id: 'folder-chumbos',
    title: 'HNOS Chumbos',
    badge: isEn ? 'Folder (3)' : 'Carpeta (3)',
    isFolder: true,
    iconImage: LOGO_CHUMBOS
  };

  // Enterprise & Personal project desktop icons
  const projectIcons: DesktopIconItem[] = [
    folderChumbosIcon,
    {
      id: 'delta-traz',
      title: 'DeltaTraz.exe',
      badge: 'Garbisoft',
      iconImage: LOGO_GARBISOFT,
      accentColor: '#10b981'
    },
    {
      id: 'lidia-ecommerce',
      title: 'LidiaHelem.shop',
      badge: 'Obrador Lidia',
      iconImage: LOGO_LIDIA,
      accentColor: '#ec4899'
    },
    {
      id: 'FichasLidia',
      title: 'FichasTecnicasLidiaHelem.py',
      badge: 'Obrador Lidia',
      iconImage: LOGO_FICHAS_LIDIA,
      accentColor: '#eab308'
    },
    {
      id: 'glados-assistant',
      title: 'GLaDOS.py',
      badge: isEn ? 'AI / Audio' : 'IA / Audio',
      iconImage: LOGO_GLADOS,
      accentColor: '#f59e0b'
    },
    {
      id: 'transres-audio',
      title: 'TransResAudio.ai',
      badge: isEn ? 'AI / Whisper' : 'IA / Whisper',
      iconImage: LOGO_TRANSRES,
      accentColor: '#a855f7'
    },
    {
      id: 'delta-servers',
      title: 'GameServers.sh',
      badge: isMac ? 'Macintosh HD' : 'Linux / Podman',
      iconImage: LOGO_DELTA_SERVERS,
      accentColor: '#64748b'
    }
  ];

  // Direct Web Shortcut desktop icons (open directly in a new tab)
  const webShortcutIcons: DesktopIconItem[] = [
    {
      id: 'web-mc',
      title: 'mc.monogoncode.dev',
      iconImage: '/images/icons/mc.svg',
      externalUrl: 'https://mc.monogoncode.dev'
    },
    {
      id: 'web-lidia',
      title: 'Pastelería Lidia Helem',
      iconImage: LOGO_LIDIA,
      externalUrl: 'https://pastelerialidiahelem.com'
    },
    {
      id: 'web-chumbos',
      title: 'Explotaciones Chumbos',
      iconImage: LOGO_CHUMBOS,
      externalUrl: 'https://explotacioneschumbos.es'
    },
    {
      id: 'web-xana',
      title: 'XanaTakeControl',
      iconImage: LOGO_XANA,
      externalUrl: 'https://xana.monogoncode.dev'
    },
    {
      id: 'web-deltatraz',
      title: 'DeltaTraz Web',
      iconImage: LOGO_GARBISOFT,
      externalUrl: 'https://dt.monogoncode.dev'
    },
    {
      id: 'web-controid',
      title: 'Controid',
      iconImage: LOGO_CONTROID,
      externalUrl: 'https://controid.monogoncode.dev'
    },
    {
      id: 'web-github',
      title: 'GitHub (@monogonCode)',
      iconImage: '/images/icons/github.svg',
      externalUrl: 'https://github.com/monogonCode'
    }
  ];

  // System & utility desktop icons
  const systemIcons: DesktopIconItem[] = [
    {
      id: 'projects',
      title: isEn ? 'Projects' : 'Proyectos',
      iconImage: isMac ? '/images/icons/mac/folder.png' : '/images/icons/xp/folder.webp'
    },
    {
      id: 'cv',
      title: 'CV_Martin.pdf',
      iconImage: isMac ? '/images/icons/mac/doc.png' : '/images/icons/xp/wordpad.webp'
    },
    {
      id: 'terminal',
      title: isMac ? (isEn ? 'Mac Terminal' : 'Terminal Mac') : 'MS-DOS Prompt',
      iconImage: isMac ? '/images/icons/mac/terminal.png' : '/images/icons/xp/cmd.webp'
    },
    {
      id: 'settings',
      title: isMac ? (isEn ? 'Control Panel' : 'Panel de Control') : isEn ? 'Properties' : 'Propiedades',
      iconImage: isMac ? '/images/icons/mac/hd.png' : '/images/icons/xp/display.webp'
    },
    {
      id: 'contact',
      title: isEn ? 'Contact.eml' : 'Contacto.eml',
      iconImage: isMac ? '/images/icons/mac/doc.png' : '/images/icons/xp/outlook.webp'
    },
    {
      id: 'minesweeper',
      title: isEn ? 'Minesweeper' : 'Buscaminas',
      iconImage: '/images/icons/xp/minesweeper.webp'
    }
  ];

  const allIcons = [...systemIcons, ...projectIcons, ...webShortcutIcons];

  // Default clean organized layout (adaptive for mobile screens)
  const getDefaultPositions = (): Record<string, { x: number; y: number }> => {
    const posMap: Record<string, { x: number; y: number }> = {};
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

    if (isMobile) {
      const cols = screenWidth < 360 ? 2 : 3;
      const colWidth = Math.floor((screenWidth - 16) / cols);
      const rowHeight = 104;
      const offsetX = 8;
      const offsetY = 10;

      allIcons.forEach((item, index) => {
        const c = index % cols;
        const r = Math.floor(index / cols);
        posMap[item.id] = {
          x: offsetX + c * colWidth,
          y: offsetY + r * rowHeight
        };
      });
      return posMap;
    }

    const colWidth = 118;
    const rowHeight = isMac ? 108 : 102;
    const offsetX = 16;
    const offsetY = isMac ? 16 : 14;

    // Column 0: System Apps
    const col0 = ['projects', 'cv', 'terminal', 'settings', 'contact', 'minesweeper'];
    col0.forEach((id, idx) => {
      posMap[id] = { x: offsetX, y: offsetY + idx * rowHeight };
    });

    // Column 1: Enterprise & Personal Projects
    const col1 = [
      'folder-chumbos',
      'delta-traz',
      'lidia-ecommerce',
      'FichasLidia',
      'glados-assistant',
      'transres-audio',
      'delta-servers'
    ];
    col1.forEach((id, idx) => {
      posMap[id] = { x: offsetX + colWidth, y: offsetY + idx * rowHeight };
    });

    // Column 2: Direct Web Shortcuts
    const col2 = [
      'web-mc',
      'web-lidia',
      'web-chumbos',
      'web-xana',
      'web-deltatraz',
      'web-controid',
      'web-github'
    ];
    col2.forEach((id, idx) => {
      posMap[id] = { x: offsetX + colWidth * 2, y: offsetY + idx * rowHeight };
    });

    return posMap;
  };

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(getDefaultPositions);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('retro_desktop_icon_pos_v6');
      if (saved) {
        setPositions({ ...getDefaultPositions(), ...JSON.parse(saved) });
      }
    } catch {}
  }, []);

  const handleIconMove = (id: string, newPos: { x: number; y: number }) => {
    setPositions((prev) => {
      const updated = { ...prev, [id]: newPos };
      try {
        localStorage.setItem('retro_desktop_icon_pos_v6', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetPositions = () => {
    sound.playClick();
    const defaults = getDefaultPositions();
    setPositions(defaults);
    try {
      localStorage.removeItem('retro_desktop_icon_pos_v6');
    } catch {}
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDesktopClick = () => {
    onSelectIcon(null);
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cols = isMobile ? (typeof window !== 'undefined' && window.innerWidth < 360 ? 2 : 3) : 3;
  const totalRows = Math.ceil(allIcons.length / cols);
  const mobileCanvasHeight = typeof window !== 'undefined' ? Math.max(window.innerHeight - 52, totalRows * 106 + 64) : 800;

  return (
    <div
      className={`desktop-canvas desktop-bg-${currentBg} ${isMac ? 'desktop-canvas-mac' : ''}`}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      style={{
        position: 'relative',
        width: '100vw',
        height: isMac ? 'calc(100vh - 24px)' : isMobile ? 'calc(100dvh - 52px)' : 'calc(100vh - 48px)',
        top: isMac ? '24px' : '0',
        overflowX: 'hidden',
        overflowY: isMobile ? 'auto' : 'hidden'
      }}
    >
      {/* Free Draggable Desktop Icons Canvas */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: isMobile ? `${mobileCanvasHeight}px` : '100%',
          minHeight: '100%',
          pointerEvents: 'none'
        }}
      >
        {allIcons.map((item) => (
          <div key={item.id} style={{ pointerEvents: 'auto' }}>
            <DesktopIcon
              item={item}
              isSelected={selectedIconId === item.id}
              position={positions[item.id] || { x: 20, y: 20 }}
              onSelect={(id) => onSelectIcon(id)}
              onOpen={(id) => {
                const clicked = allIcons.find((ic) => ic.id === id);
                if (clicked?.externalUrl) {
                  window.open(clicked.externalUrl, '_blank', 'noopener,noreferrer');
                  return;
                }
                onOpenApp(id);
              }}
              onMove={handleIconMove}
              currentTheme={currentTheme}
            />
          </div>
        ))}
      </div>

      {/* Snap Preview Box Indicator */}
      {snapPreview && (
        <div
          style={{
            position: 'absolute',
            left: `${snapPreview.x}px`,
            top: `${snapPreview.y}px`,
            width: `${snapPreview.width}px`,
            height: `${snapPreview.height}px`,
            background: 'rgba(2, 132, 199, 0.25)',
            border: '2px dashed #38bdf8',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
            zIndex: 99995,
            pointerEvents: 'none',
            transition: 'all 0.12s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}

      {/* Render Open Windows */}
      {children}

      {/* Desktop Context Menu */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '3px 3px 8px rgba(0,0,0,0.4)',
            zIndex: 99999,
            minWidth: '185px',
            padding: '2px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              sound.playClick();
              onOpenApp('projects');
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <PixelFolder size={14} color="#eab308" />
            <span>{isEn ? 'Explore Projects' : 'Explorar Proyectos'}</span>
          </div>
          <div
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              sound.playClick();
              onOpenApp('terminal');
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <PixelTerminal size={14} color="#16a34a" />
            <span>{isEn ? 'Open MS-DOS Terminal' : 'Abrir Terminal MS-DOS'}</span>
          </div>
          <div
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              sound.playClick();
              onOpenApp('settings');
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <PixelSettings size={14} color="#475569" />
            <span>{isEn ? 'Display Properties' : 'Propiedades de Pantalla'}</span>
          </div>
          <div className="start-menu-divider" />
          <div
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              toggleLang();
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <PixelLanguage size={14} color="#000080" />
            <span>{isEn ? 'Idioma: Cambiar a Español (ES)' : 'Language: Switch to English (EN)'}</span>
          </div>
          <div
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={resetPositions}
          >
            <PixelSliders size={14} color="#000080" />
            <span>{isEn ? 'Arrange and align icons' : 'Organizar y alinear iconos'}</span>
          </div>
          <div className="start-menu-divider" />
          <a
            href="https://github.com/monogonCode"
            target="_blank"
            rel="noreferrer"
            className="start-menu-item"
            style={{ fontSize: '11px', padding: '4px 8px', textDecoration: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
          >
            <PixelGithub size={14} />
            <span>{isEn ? 'View GitHub Profile' : 'Ver Perfil de GitHub'}</span>
          </a>
        </div>
      )}
    </div>
  );
};

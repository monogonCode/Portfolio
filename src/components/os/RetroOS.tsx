import React, { useState, useEffect } from 'react';
import { Desktop } from './Desktop';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { Window, type WindowState, type SnapRect } from './Window';
import { RetroBootScreen } from './RetroBootScreen';
import { RetroShutdownScreen } from './RetroShutdownScreen';
import { ProjectViewerApp } from '../apps/ProjectViewerApp';
import { CVViewerApp } from '../apps/CVViewerApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SettingsApp } from '../apps/SettingsApp';
import { ContactApp } from '../apps/ContactApp';
import { MinesweeperApp } from '../apps/MinesweeperApp';
import { InternetExplorerApp } from '../apps/InternetExplorerApp';
import { sound } from '../../lib/sound';
import { PROJECTS, getProjects } from '../../data/projects';
import { LanguageProvider, useLanguage } from '../../i18n/LanguageContext';
import {
  PixelFolder,
  PixelFileText,
  PixelTerminal,
  PixelSettings,
  PixelMail,
  PixelBomb,
  PixelGlobe,
  PixelSparkles
} from '../ui/RetroIcons';
import { ChumbosFolderApp } from '../apps/ChumbosFolderApp';
import { ImageViewerApp } from '../apps/ImageViewerApp';
import { LOGO_CHUMBOS, PROJECT_MEDIA } from '../../data/projectMedia';

const RetroOSInner: React.FC = () => {
  const { lang, isEn } = useLanguage();
  const [theme, setTheme] = useState<'win98' | 'winxp' | 'mac' | 'nes'>('win98');
  const [bg, setBg] = useState<string>('win98');
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);
  const [browserUrl, setBrowserUrl] = useState<string>('https://explotacioneschumbos.es');
  const [isShutDown, setIsShutDown] = useState<boolean>(false);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isDesktopExpanding, setIsDesktopExpanding] = useState<boolean>(false);
  const [snapPreview, setSnapPreview] = useState<SnapRect | null>(null);

  // Global unlock audio listener on first user interaction
  useEffect(() => {
    const handleUnlock = () => {
      sound.unlockAudio();
    };
    window.addEventListener('pointerdown', handleUnlock, { once: true });
    window.addEventListener('keydown', handleUnlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
    };
  }, []);

  // Windows initial configuration
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'folder-chumbos',
      title: 'C:\\Empresas\\HNOS Chumbos - [3 proyectos]',
      icon: <img src={LOGO_CHUMBOS} style={{ width: 14, height: 14, objectFit: 'contain' }} alt="" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 80, y: 35 },
      size: { width: 660, height: 480 }
    },
    {
      id: 'image-viewer',
      title: 'Visor de Imágenes y Galería',
      icon: <PixelSparkles size={14} color="#0284c7" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      position: { x: 120, y: 50 },
      size: { width: 860, height: 580 }
    },
    {
      id: 'projects',
      title: 'Explorador de Proyectos - Martín Garbiso',
      icon: <PixelFolder size={14} color="#eab308" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 60, y: 30 },
      size: { width: 840, height: 560 }
    },
    {
      id: 'browser',
      title: 'Internet Explorer 5.0 - [Visualizador Web]',
      icon: <PixelGlobe size={14} color="#0284c7" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 100, y: 45 },
      size: { width: 920, height: 600 }
    },
    {
      id: 'cv',
      title: 'Curriculum Vitae - WordPad',
      icon: <PixelFileText size={14} color="#0284c7" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      position: { x: 120, y: 55 },
      size: { width: 800, height: 580 }
    },
    {
      id: 'terminal',
      title: 'Linea de comandos [MONOGON]',
      icon: <PixelTerminal size={14} color="#16a34a" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 160, y: 90 },
      size: { width: 680, height: 460 }
    },
    {
      id: 'settings',
      title: 'Propiedades de Pantalla y Temas OS',
      icon: <PixelSettings size={14} color="#475569" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 220, y: 70 },
      size: { width: 500, height: 440 }
    },
    {
      id: 'contact',
      title: 'Outlook Express - Mensaje Nuevo',
      icon: <PixelMail size={14} color="#dc2626" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 190, y: 110 },
      size: { width: 560, height: 480 }
    },
    {
      id: 'minesweeper',
      title: 'Buscaminas',
      icon: <PixelBomb size={14} color="#dc2626" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 280, y: 100 },
      size: { width: 340, height: 380 }
    }
  ]);

  // Keep window titles localized when language or selectedProjectId changes
  useEffect(() => {
    const localizedProjects = getProjects(lang);
    const proj = localizedProjects.find((p) => p.id === selectedProjectId);
    const count = PROJECT_MEDIA[selectedProjectId]?.screenshots?.length || 0;

    setWindows((prev) =>
      prev.map((w) => {
        switch (w.id) {
          case 'folder-chumbos':
            return {
              ...w,
              title: isEn
                ? 'C:\\Companies\\HNOS Chumbos - [3 projects]'
                : 'C:\\Empresas\\HNOS Chumbos - [3 proyectos]'
            };
          case 'image-viewer':
            return {
              ...w,
              title:
                proj && count > 0
                  ? isEn
                    ? `Image Viewer - [${proj.title}] (${count} screenshots)`
                    : `Visor de Imágenes - [${proj.title}] (${count} capturas)`
                  : isEn
                  ? 'Image Viewer & Gallery'
                  : 'Visor de Imágenes y Galería'
            };
          case 'projects':
            return {
              ...w,
              title: isEn ? 'Project Explorer - Martín Garbiso' : 'Explorador de Proyectos - Martín Garbiso'
            };
          case 'browser':
            return {
              ...w,
              title: isEn ? 'Internet Explorer 5.0 - [Web Viewer]' : 'Internet Explorer 5.0 - [Visualizador Web]'
            };
          case 'cv':
            return {
              ...w,
              title: 'Curriculum Vitae - WordPad'
            };
          case 'terminal':
            return {
              ...w,
              title: isEn ? 'Command Prompt [MONOGON]' : 'Linea de comandos [MONOGON]'
            };
          case 'settings':
            return {
              ...w,
              title: isEn ? 'Display Properties & OS Themes' : 'Propiedades de Pantalla y Temas OS'
            };
          case 'contact':
            return {
              ...w,
              title: isEn ? 'Outlook Express - New Message' : 'Outlook Express - Mensaje Nuevo'
            };
          case 'minesweeper':
            return {
              ...w,
              title: isEn ? 'Minesweeper' : 'Buscaminas'
            };
          default:
            return w;
        }
      })
    );
  }, [lang, isEn, selectedProjectId]);

  // Handle responsive initial positions and screen orientation changes
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setWindows((prev) =>
          prev.map((w) => ({
            ...w,
            position: { x: 0, y: 0 },
            size: { width: window.innerWidth, height: window.innerHeight - 38 }
          }))
        );
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update theme stylesheet link in head
  useEffect(() => {
    let stylesheetUrl = '/themes/98/98.css';
    if (theme === 'winxp') stylesheetUrl = '/themes/xp/XP.css';
    else if (theme === 'mac') stylesheetUrl = '/themes/system/styles.css';
    else if (theme === 'nes') stylesheetUrl = '/themes/nes/nes.min.css';

    let linkEl = document.getElementById('retro-theme-link') as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = 'retro-theme-link';
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }
    linkEl.href = stylesheetUrl;
  }, [theme]);

  // Bring window to front
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w));
    });
  };

  const handleSelectIcon = (id: string | null) => {
    setSelectedIconId(id);
    if (!id) return;

    const matchingProject = PROJECTS.find((p) => p.id === id);
    if (matchingProject) {
      setSelectedProjectId(matchingProject.id);
    }
  };

  // Open / toggle window
  const openApp = (appId: string, customParam?: string) => {
    sound.playWindowOpen();

    if (appId === 'browser' && customParam) {
      setBrowserUrl(customParam);
    }

    const localizedProjects = getProjects(lang);

    // Check if appId is a specific project
    const matchingProject = localizedProjects.find((p) => p.id === appId);
    if (matchingProject) {
      setSelectedProjectId(matchingProject.id);

      const media = PROJECT_MEDIA[matchingProject.id];
      const hasScreenshots = media && media.screenshots && media.screenshots.length > 0;

      if (matchingProject.id === 'chumbos-portal' && matchingProject.liveUrl) {
        setBrowserUrl(matchingProject.liveUrl);
      }

      setWindows((prev) => {
        let highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
        return prev.map((w) => {
          if (w.id === 'projects') {
            highestZ += 1;
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: highestZ
            };
          }
          if (hasScreenshots && w.id === 'image-viewer') {
            highestZ += 2;
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: highestZ,
              title: isEn
                ? `Image Viewer - [${matchingProject.title}] (${media.screenshots.length} screenshots)`
                : `Visor de Imágenes - [${matchingProject.title}] (${media.screenshots.length} capturas)`
            };
          }
          if (matchingProject.id === 'chumbos-portal' && w.id === 'browser') {
            highestZ += 1;
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: highestZ
            };
          }
          return w;
        });
      });

      if (hasScreenshots) {
        setActiveWindowId('image-viewer');
      } else if (matchingProject.id === 'chumbos-portal') {
        setActiveWindowId('browser');
      } else {
        setActiveWindowId('projects');
      }

      setStartMenuOpen(false);
      return;
    }

    if (appId === 'image-viewer' && customParam) {
      setSelectedProjectId(customParam);
      const proj = localizedProjects.find((p) => p.id === customParam);
      const count = PROJECT_MEDIA[customParam]?.screenshots?.length || 0;
      setWindows((prev) => {
        const highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
        return prev.map((w) => {
          if (w.id === 'image-viewer') {
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: highestZ + 1,
              title: proj
                ? isEn
                  ? `Image Viewer - [${proj.title}] (${count} screenshots)`
                  : `Visor de Imágenes - [${proj.title}] (${count} capturas)`
                : w.title
            };
          }
          return w;
        });
      });
      setActiveWindowId('image-viewer');
      setStartMenuOpen(false);
      return;
    }


    setWindows((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => {
        if (w.id === appId) {
          return {
            ...w,
            isOpen: true,
            isMinimized: false,
            zIndex: highestZ + 1
          };
        }
        return w;
      });
    });
    setActiveWindowId(appId);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
    if (activeWindowId === id) {
      const remainingOpen = windows.filter((w) => w.isOpen && w.id !== id && !w.isMinimized);
      if (remainingOpen.length > 0) {
        setActiveWindowId(remainingOpen[remainingOpen.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  };

  const nextTheme = () => {
    const list: Array<'win98' | 'winxp' | 'mac' | 'nes'> = ['win98', 'winxp', 'mac', 'nes'];
    const idx = list.indexOf(theme);
    const next = list[(idx + 1) % list.length];
    setTheme(next);
    setBg(next);
  };

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const handleBootFinish = () => {
    setIsBooting(false);
    setIsShutDown(false);
    setIsDesktopExpanding(true);
    setTimeout(() => {
      setIsDesktopExpanding(false);
    }, 750);
  };

  return (
    <div className={`os-container theme-${theme}`} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Retro Boot Screen / Power-on CRT Monitor */}
      {isBooting ? (
        <RetroBootScreen onFinish={handleBootFinish} />
      ) : isShutDown ? (
        <RetroShutdownScreen
          onPowerOn={() => {
            setIsShutDown(false);
            setIsBooting(true);
          }}
        />
      ) : (
        <div
          className={isDesktopExpanding ? 'crt-desktop-expand' : ''}
          style={{ width: '100vw', height: '100vh', position: 'relative' }}
        >
          {/* CRT Scanlines Overlay */}
          {crtEnabled && (
            <>
              <div className="crt-scanlines" />
              <div className="crt-vignette" />
            </>
          )}

          {/* Main Desktop Canvas with Mini-Preview Icons */}
          <Desktop
            selectedIconId={selectedIconId}
            onSelectIcon={handleSelectIcon}
            onOpenApp={(id) => openApp(id)}
            currentBg={bg}
            snapPreview={snapPreview}
            currentTheme={theme}
          >
            {/* Windows rendering */}
            {windows.map((win) => {
              const isActive = activeWindowId === win.id;

              return (
                <Window
                  key={win.id}
                  window={win}
                  isActive={isActive}
                  onFocus={() => focusWindow(win.id)}
                  onClose={() => closeWindow(win.id)}
                  onMinimize={() => minimizeWindow(win.id)}
                  onMaximize={() => maximizeWindow(win.id)}
                  onSnapPreviewChange={(snap) => setSnapPreview(snap)}
                  onUpdateBounds={({ pos, size }) => {
                    setWindows((prev) =>
                      prev.map((w) => (w.id === win.id ? { ...w, position: pos, size } : w))
                    );
                  }}
                >
                  {win.id === 'folder-chumbos' && (
                    <ChumbosFolderApp
                      onOpenProject={(pId) => openApp(pId)}
                      onOpenBrowser={(url) => openApp('browser', url)}
                    />
                  )}

                  {win.id === 'image-viewer' && (
                    <ImageViewerApp
                      initialProjectId={selectedProjectId}
                      onOpenProjectSpecs={(pId) => {
                        setSelectedProjectId(pId);
                        focusWindow('projects');
                      }}
                    />
                  )}

                  {win.id === 'projects' && (
                    <ProjectViewerApp
                      initialProjectId={selectedProjectId}
                      onOpenProject={(pId) => setSelectedProjectId(pId)}
                      onOpenBrowser={(url) => openApp('browser', url)}
                      onOpenImageViewer={(pId) => {
                        setSelectedProjectId(pId);
                        openApp('image-viewer', pId);
                      }}
                    />
                  )}

                  {win.id === 'browser' && (
                    <InternetExplorerApp initialUrl={browserUrl} />
                  )}

                  {win.id === 'cv' && <CVViewerApp />}

                  {win.id === 'terminal' && (
                    <TerminalApp
                      onSetTheme={(newTheme) => {
                        if (['win98', 'winxp', 'mac', 'nes'].includes(newTheme)) {
                          setTheme(newTheme as typeof theme);
                          setBg(newTheme);
                        }
                      }}
                      onOpenApp={(appId) => openApp(appId)}
                    />
                  )}

                  {win.id === 'settings' && (
                    <SettingsApp
                      currentTheme={theme}
                      onSelectTheme={(t) => setTheme(t as typeof theme)}
                      crtEnabled={crtEnabled}
                      onToggleCrt={() => setCrtEnabled(!crtEnabled)}
                      soundEnabled={soundEnabled}
                      onToggleSound={toggleSound}
                      currentBg={bg}
                      onSelectBg={(b) => setBg(b)}
                      onClose={() => closeWindow('settings')}
                    />
                  )}

                  {win.id === 'contact' && <ContactApp onClose={() => closeWindow('contact')} />}

                  {win.id === 'minesweeper' && <MinesweeperApp />}
                </Window>
              );
            })}
          </Desktop>

          {/* Start Menu */}
          <StartMenu
            isOpen={startMenuOpen}
            onClose={() => setStartMenuOpen(false)}
            onOpenApp={(id) => openApp(id)}
            onShutDown={() => setIsShutDown(true)}
            currentTheme={theme}
          />

          {/* Fixed Taskbar */}
          <Taskbar
            windows={windows}
            activeWindowId={activeWindowId}
            startMenuOpen={startMenuOpen}
            onToggleStartMenu={() => setStartMenuOpen(!startMenuOpen)}
            onSelectWindow={(id) => {
              const win = windows.find((w) => w.id === id);
              if (win?.isMinimized || activeWindowId !== id) {
                focusWindow(id);
              } else {
                minimizeWindow(id);
              }
            }}
            onOpenApp={(id) => openApp(id)}
            currentTheme={theme}
            onNextTheme={nextTheme}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        </div>
      )}
    </div>
  );
};

export const RetroOS: React.FC = () => (
  <LanguageProvider>
    <RetroOSInner />
  </LanguageProvider>
);


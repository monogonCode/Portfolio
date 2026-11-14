import React, { useState, useEffect } from 'react';
import type { WindowState } from './Window';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PixelFolder,
  PixelTerminal,
  PixelTv,
  PixelVolume2,
  PixelVolumeX,
  PixelSliders,
  PixelLanguage
} from '../ui/RetroIcons';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onSelectWindow: (id: string) => void;
  onOpenApp: (appId: string) => void;
  currentTheme: string;
  onNextTheme: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  onToggleStartMenu,
  onSelectWindow,
  onOpenApp,
  currentTheme,
  onNextTheme,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound
}) => {
  const { isEn, toggleLang } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [langAnim, setLangAnim] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  const handleLanguageClick = () => {
    setLangAnim(true);
    toggleLang();
    setTimeout(() => setLangAnim(false), 260);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(isEn ? 'en-US' : 'es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isEn]);

  const openWindows = windows.filter((w) => w.isOpen);
  const isXP = currentTheme === 'winxp';

  if (currentTheme === 'mac') {
    const activeWin = windows.find((w) => w.id === activeWindowId && w.isOpen && !w.isMinimized);
    const activeAppTitle = activeWin ? activeWin.title.split(' - ')[0].replace(/^C:\\.*\\/, '') : 'Finder';

    return (
      <div className="system7-menubar">
        <div className="system7-menubar-left">
          {/* Apple Menu */}
          <div
            className={`system7-menubar-item apple-menu ${startMenuOpen ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              onToggleStartMenu();
            }}
            title={isEn ? 'Apple Menu' : 'Menú Apple'}
          >
            <img src="/images/icons/mac/apple.png" alt="Apple" className="system7-apple-icon" />
          </div>

          {/* Menus: Archivo, Edición, Ver, Especial */}
          <div
            className="system7-menubar-item"
            onClick={() => {
              sound.playClick();
              onOpenApp('projects');
            }}
          >
            {isEn ? 'File' : 'Archivo'}
          </div>
          <div
            className="system7-menubar-item"
            onClick={() => {
              sound.playClick();
              onOpenApp('cv');
            }}
          >
            {isEn ? 'Edit' : 'Edición'}
          </div>
          <div
            className="system7-menubar-item"
            onClick={() => {
              sound.playClick();
              onOpenApp('image-viewer');
            }}
          >
            {isEn ? 'View' : 'Ver'}
          </div>
          <div
            className="system7-menubar-item"
            onClick={() => {
              sound.playClick();
              onOpenApp('settings');
            }}
          >
            {isEn ? 'Special' : 'Especial'}
          </div>
        </div>

        <div className="system7-menubar-right">
          {/* Interactive Language Toggle Button */}
          <button
            className={`system7-util-btn ${isEn ? 'active' : ''}`}
            title={isEn ? 'Switch language to Spanish (ES)' : 'Cambiar idioma a Inglés (EN)'}
            onClick={handleLanguageClick}
          >
            <PixelLanguage size={11} color={isEn ? '#ffffff' : '#000000'} />
            <span>{isEn ? 'EN' : 'ES'}</span>
          </button>

          {/* Theme Selector Button */}
          <button
            className="system7-util-btn"
            title={
              isEn
                ? `Current theme: ${currentTheme.toUpperCase()} (Click to cycle)`
                : `Tema actual: ${currentTheme.toUpperCase()} (Clic para alternar)`
            }
            onClick={() => {
              sound.playClick();
              onNextTheme();
            }}
          >
            <PixelSliders size={11} color="#000000" />
            <span>{currentTheme.toUpperCase()}</span>
          </button>

          {/* CRT Toggle Button */}
          <button
            className={`system7-util-btn ${crtEnabled ? 'active' : ''}`}
            title={
              isEn
                ? crtEnabled
                  ? 'Disable CRT effect'
                  : 'Enable CRT effect'
                : crtEnabled
                ? 'Desactivar efecto CRT'
                : 'Activar efecto CRT'
            }
            onClick={() => {
              sound.playClick();
              onToggleCrt();
            }}
          >
            <PixelTv size={11} color={crtEnabled ? '#ffffff' : '#000000'} />
            <span>{crtEnabled ? 'CRT ON' : 'CRT OFF'}</span>
          </button>

          {/* Audio MUTE Toggle */}
          <button
            className={`system7-util-btn ${soundEnabled ? '' : 'muted'}`}
            title={
              isEn
                ? soundEnabled
                  ? 'Mute sounds'
                  : 'Unmute sounds'
                : soundEnabled
                ? 'Silenciar sonidos'
                : 'Activar sonidos'
            }
            onClick={() => {
              onToggleSound();
            }}
          >
            {soundEnabled ? (
              <PixelVolume2 size={11} color="#000000" />
            ) : (
              <PixelVolumeX size={11} color="#666666" />
            )}
            <span>{soundEnabled ? 'VOL' : 'MUTE'}</span>
          </button>

          {/* Clock */}
          <span className="system7-clock">{currentTime || '12:00'}</span>

          {/* Active Application / Finder Indicator */}
          <div
            className="system7-app-indicator"
            onClick={() => {
              sound.playClick();
              if (activeWindowId) {
                onSelectWindow(activeWindowId);
              } else {
                onOpenApp('projects');
              }
            }}
            title={isEn ? 'Active application' : 'Aplicación activa'}
          >
            <img
              src="/images/icons/mac/finder.png"
              alt="App"
              style={{ width: '15px', height: '15px', objectFit: 'contain' }}
            />
            <span className="system7-app-title">{activeAppTitle}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`retro-taskbar ${isXP ? 'retro-taskbar-xp' : ''}`}>
      {/* Start Button */}
      {isXP ? (
        <button
          className={`taskbar-start-btn xp-start-btn ${startMenuOpen ? 'active' : ''}`}
          aria-expanded={startMenuOpen}
          aria-label={isEn ? 'Start menu' : 'Menú Inicio'}
          onClick={() => {
            sound.playClick();
            onToggleStartMenu();
          }}
          title={isEn ? 'Click here to begin' : 'Haga clic aquí para comenzar'}
        >
          <img src="/images/icons/xp/winxp_flag.svg" alt="Windows XP" className="xp-start-flag" />
          <span className="xp-start-text">{isEn ? 'start' : 'inicio'}</span>
        </button>
      ) : (
        <button
          className={`taskbar-start-btn ${startMenuOpen ? 'active' : ''}`}
          aria-expanded={startMenuOpen}
          aria-label={isEn ? 'Start menu' : 'Menú Inicio'}
          onClick={() => {
            sound.playClick();
            onToggleStartMenu();
          }}
          style={{
            border: '2px solid',
            borderColor: startMenuOpen ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '7px'
          }}
        >
          <img
            src="/images/monogon-logo-128.png"
            alt="MONOGON"
            style={{ width: '22px', height: '22px', objectFit: 'contain', background: '#0f172a', borderRadius: '3px', padding: '1px' }}
          />
          <span>{isEn ? 'Start' : 'Inicio'}</span>
        </button>
      )}

      {/* Quick Launch Icons */}
      <div
        className="xp-quick-launch"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isXP ? '5px' : '4px',
          padding: '0 5px',
          borderRight: isXP ? '1px solid rgba(255,255,255,0.2)' : '1px solid #808080',
          borderLeft: isXP ? 'none' : '1px solid #ffffff',
          margin: '0 4px'
        }}
      >
        <button
          title={isEn ? 'Open Project Explorer' : 'Abrir Explorador de Proyectos'}
          aria-label={isEn ? 'Open Project Explorer' : 'Abrir Explorador de Proyectos'}
          className={isXP ? 'xp-quick-launch-btn' : ''}
          onClick={() => {
            sound.playClick();
            onOpenApp('projects');
          }}
          style={
            isXP
              ? undefined
              : {
                  width: '34px',
                  minWidth: '34px',
                  maxWidth: '34px',
                  height: '32px',
                  minHeight: 'unset',
                  padding: '0',
                  background: '#d4d0c8',
                  border: '1px solid #808080',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
          }
        >
          {isXP ? (
            <img src="/images/icons/xp/folder.webp" alt="Proyectos" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          ) : (
            <PixelFolder size={20} color="#ca8a04" />
          )}
        </button>
        <button
          title={isEn ? 'Open MS-DOS Prompt' : 'Abrir Terminal MS-DOS'}
          aria-label={isEn ? 'Open MS-DOS Prompt' : 'Abrir Terminal MS-DOS'}
          className={isXP ? 'xp-quick-launch-btn' : ''}
          onClick={() => {
            sound.playClick();
            onOpenApp('terminal');
          }}
          style={
            isXP
              ? undefined
              : {
                  width: '34px',
                  minWidth: '34px',
                  maxWidth: '34px',
                  height: '32px',
                  minHeight: 'unset',
                  padding: '0',
                  background: '#d4d0c8',
                  border: '1px solid #808080',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
          }
        >
          {isXP ? (
            <img src="/images/icons/xp/cmd.webp" alt="Terminal" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          ) : (
            <PixelTerminal size={20} color="#16a34a" />
          )}
        </button>

        {/* Interactive Language Toggle Button (ES / EN) */}
        <button
          title={
            isEn
              ? 'Switch language to Spanish / Cambiar idioma a Español (ES)'
              : 'Cambiar idioma a Inglés / Switch language to English (EN)'
          }
          aria-label={isEn ? 'Switch language to Spanish' : 'Switch language to English'}
          className={isXP ? 'xp-quick-launch-btn taskbar-lang-btn' : 'taskbar-lang-btn'}
          onClick={handleLanguageClick}
          style={
            isXP
              ? {
                  width: 'auto',
                  minWidth: '48px',
                  height: '32px',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: isEn ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.18)',
                  border: isEn ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '3px',
                  color: '#ffffff',
                  cursor: 'pointer'
                }
              : {
                  width: 'auto',
                  minWidth: '48px',
                  height: '32px',
                  minHeight: 'unset',
                  padding: '0 7px',
                  background: isEn ? '#000080' : '#d4d0c8',
                  color: isEn ? '#ffffff' : '#000080',
                  border: '1px solid #808080',
                  boxShadow: isEn
                    ? 'inset 1px 1px 0px #000000, inset -1px -1px 0px #38bdf8'
                    : 'inset 1px 1px 0px #ffffff, inset -1px -1px 0px #808080',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background 0.15s ease, color 0.15s ease'
                }
          }
        >
          <PixelLanguage
            size={16}
            color={isXP ? '#38bdf8' : isEn ? '#38bdf8' : '#000080'}
            style={{
              transform: langAnim ? 'scale(1.22) rotate(-10deg)' : 'scale(1) rotate(0deg)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              lineHeight: 1
            }}
          >
            {isEn ? 'EN' : 'ES'}
          </span>
        </button>
      </div>

      {/* Open Windows Tabs */}
      <div className="taskbar-apps-container">
        {openWindows.map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <button
              key={win.id}
              className={`taskbar-app-tab ${isXP ? 'xp-app-tab' : ''} ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
              onClick={() => {
                sound.playClick();
                onSelectWindow(win.id);
              }}
              title={win.title}
              style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
            >
              {win.icon || <PixelFolder size={16} />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {win.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div
        className={`taskbar-tray ${isXP ? 'xp-tray' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {/* Theme Cycle Button */}
        <button
          title={
            isEn
              ? `Current theme: ${currentTheme.toUpperCase()} (Click to cycle theme)`
              : `Tema actual: ${currentTheme.toUpperCase()} (Clic para alternar tema)`
          }
          aria-label={isEn ? `Cycle theme, current ${currentTheme}` : `Cambiar tema, actual ${currentTheme}`}
          onClick={() => {
            sound.playClick();
            onNextTheme();
          }}
          style={{
            padding: '4px 7px',
            fontSize: '11px',
            minWidth: 'unset',
            minHeight: '30px',
            background: isXP ? 'rgba(255,255,255,0.15)' : '#ffffff',
            border: isXP ? '1px solid rgba(255,255,255,0.35)' : '1px solid #808080',
            color: isXP ? '#ffffff' : '#000000',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <PixelSliders size={14} color={isXP ? '#ffffff' : '#000080'} />
          <span>{currentTheme.toUpperCase()}</span>
        </button>

        {/* CRT Toggle Button */}
        <button
          title={
            isEn
              ? crtEnabled
                ? 'Disable CRT Scanlines effect'
                : 'Enable CRT Scanlines effect'
              : crtEnabled
              ? 'Desactivar efecto CRT Scanlines'
              : 'Activar efecto CRT Scanlines'
          }
          aria-label={isEn ? 'Toggle CRT effect' : 'Alternar efecto CRT'}
          aria-pressed={crtEnabled}
          onClick={() => {
            sound.playClick();
            onToggleCrt();
          }}
          style={{
            background: crtEnabled ? '#15803d' : isXP ? 'rgba(0,0,0,0.3)' : '#475569',
            color: '#ffffff',
            border: '1px solid',
            borderColor: crtEnabled
              ? '#86efac #14532d #14532d #86efac'
              : isXP
              ? 'rgba(255,255,255,0.25)'
              : '#94a3b8 #0f172a #0f172a #94a3b8',
            cursor: 'pointer',
            padding: isMobile ? '4px 6px' : '4px 8px',
            fontSize: '10px',
            fontWeight: 'bold',
            minWidth: 'unset',
            minHeight: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '3px' : '5px',
            borderRadius: isXP ? '2px' : '0'
          }}
        >
          <PixelTv size={14} color="#ffffff" />
          <span className="taskbar-tray-label-desktop">
            {isEn
              ? crtEnabled
                ? 'DISABLE CRT'
                : 'ENABLE CRT'
              : crtEnabled
              ? 'DESACTIVAR CRT'
              : 'ACTIVAR CRT'}
          </span>
        </button>

        {/* Audio MUTE Toggle Button */}
        <button
          title={
            isEn
              ? soundEnabled
                ? 'Mute sounds (MUTE)'
                : 'Unmute sounds'
              : soundEnabled
              ? 'Silenciar sonidos (MUTE)'
              : 'Activar sonidos'
          }
          aria-label={isEn ? (soundEnabled ? 'Mute sounds' : 'Unmute sounds') : soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          aria-pressed={!soundEnabled}
          onClick={() => {
            onToggleSound();
          }}
          style={{
            background: soundEnabled ? (isXP ? 'rgba(255,255,255,0.2)' : '#dbeafe') : isXP ? 'rgba(0,0,0,0.3)' : '#f1f5f9',
            color: soundEnabled ? (isXP ? '#ffffff' : '#1e40af') : '#94a3b8',
            border: isXP ? '1px solid rgba(255,255,255,0.25)' : '1px solid #94a3b8',
            cursor: 'pointer',
            padding: isMobile ? '4px 6px' : '4px 8px',
            fontSize: '10px',
            fontWeight: 'bold',
            minWidth: 'unset',
            minHeight: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '3px' : '5px',
            borderRadius: isXP ? '2px' : '0'
          }}
        >
          {soundEnabled ? (
            <PixelVolume2 size={14} color={isXP ? '#ffffff' : '#1d4ed8'} />
          ) : (
            <PixelVolumeX size={14} color="#94a3b8" />
          )}
          <span className="taskbar-tray-label-desktop">{soundEnabled ? 'MUTE' : 'UNMUTE'}</span>
        </button>

        {/* Real-time Clock */}
        <span
          style={{
            fontFamily: isXP ? "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" : 'monospace',
            fontWeight: 'bold',
            paddingLeft: '4px',
            fontSize: '12px',
            color: isXP ? '#ffffff' : '#000000',
            textShadow: isXP ? '1px 1px 1px rgba(0,0,0,0.7)' : 'none'
          }}
        >
          {currentTime || '12:00'}
        </span>
      </div>
    </div>
  );
};


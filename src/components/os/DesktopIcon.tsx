import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';

export interface DesktopIconItem {
  id: string;
  title: string;
  tag?: string;
  badge?: string;
  previewType?: string;
  accentColor?: string;
  iconImage?: string;
  isFolder?: boolean;
}

interface DesktopIconProps {
  item: DesktopIconItem;
  isSelected: boolean;
  position?: { x: number; y: number };
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMove?: (id: string, newPos: { x: number; y: number }) => void;
  currentTheme?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  item,
  isSelected,
  position,
  onSelect,
  onOpen,
  onMove,
  currentTheme = 'win98'
}) => {
  const { isEn } = useLanguage();
  const [currentPos, setCurrentPos] = useState(position || { x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startIconPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    if (position) {
      setCurrentPos(position);
    }
  }, [position?.x, position?.y]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startIconPos.current = { ...currentPos };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (Math.hypot(dx, dy) > 4) {
      hasMoved.current = true;
      const isMac = currentTheme === 'mac';
      const topLimit = isMac ? 26 : 8;
      const deskWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const deskHeight = typeof window !== 'undefined' ? window.innerHeight - (isMac ? 24 : 38) : 700;
      const newX = Math.max(8, Math.min(deskWidth - 100, startIconPos.current.x + dx));
      const newY = Math.max(topLimit, Math.min(deskHeight - 110, startIconPos.current.y + dy));
      setCurrentPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}

      if (hasMoved.current) {
        if (onMove) {
          onMove(item.id, currentPos);
        }
      } else {
        const isTouchOrMobile =
          typeof window !== 'undefined' &&
          (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

        if (isTouchOrMobile || isSelected) {
          sound.playWindowOpen();
          onOpen(item.id);
        } else {
          sound.playClick();
          onSelect(item.id);
        }
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playWindowOpen();
    onOpen(item.id);
  };

  // Determine icon image source
  const getIconSource = (): string => {
    if (item.iconImage) return item.iconImage;

    switch (item.previewType) {
      case 'glados-eye':
        return '/images/icons/xp/glados.svg';
      case 'audio-wave':
        return '/images/icons/xp/media-player.webp';
      case 'terminal-status':
        return '/images/icons/xp/network.webp';
      case 'ie-browser':
      case 'browser':
        return '/images/icons/xp/ie.webp';
      case 'cv-card':
        return '/images/icons/xp/wordpad.webp';
      case 'dos-terminal':
        return '/images/icons/xp/cmd.webp';
      case 'display-settings':
        return '/images/icons/xp/display.webp';
      case 'contact-mail':
        return '/images/icons/xp/outlook.webp';
      case 'minesweeper':
        return '/images/icons/xp/minesweeper.webp';
      case 'python-code':
        return '/images/icons/xp/python.svg';
      case 'folder':
        return '/images/icons/xp/folder.webp';
      default:
        return '/images/icons/xp/document.webp';
    }
  };

  const isPositioned = position !== undefined;
  const iconSrc = getIconSource();

  return (
    <div
      className={`desktop-icon-card ${isSelected ? 'selected' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      title={`${item.title} - ${isEn ? 'Double-click to open' : 'Doble clic para abrir'}`}
      style={
        isPositioned
          ? {
              position: 'absolute',
              left: `${currentPos.x}px`,
              top: `${currentPos.y}px`,
              touchAction: 'none'
            }
          : {
              touchAction: 'none'
            }
      }
    >
      {/* Standalone transparent icon container without square card background */}
      <div className="desktop-icon-graphic">
        {item.isFolder ? (
          <div className="desktop-icon-folder-wrapper">
            <img
              src={currentTheme === 'mac' ? '/images/icons/mac/folder.png' : '/images/icons/xp/folder.webp'}
              alt={item.title}
              className="desktop-icon-img"
              draggable={false}
            />
            {item.iconImage && item.iconImage !== (currentTheme === 'mac' ? '/images/icons/mac/folder.png' : '/images/icons/xp/folder.webp') && (
              <div className="desktop-icon-badge-overlay">
                <img
                  src={item.iconImage}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />
              </div>
            )}
          </div>
        ) : (
          <img
            src={iconSrc}
            alt={item.title}
            className="desktop-icon-img"
            draggable={false}
          />
        )}
      </div>

      {/* Clear Label with shadow for full readability */}
      <div className="desktop-icon-label">{item.title}</div>
      {item.badge && <div className="desktop-icon-badge">{item.badge}</div>}
    </div>
  );
};

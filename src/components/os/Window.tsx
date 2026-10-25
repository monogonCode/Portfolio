import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { WindowErrorBoundary } from './WindowErrorBoundary';

export interface WindowState {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  children?: React.ReactNode;
}

export interface SnapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onSnapPreviewChange?: (snap: SnapRect | null) => void;
  onUpdateBounds?: (bounds: { pos: { x: number; y: number }; size: { width: number; height: number } }) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onSnapPreviewChange,
  onUpdateBounds,
  children
}) => {
  const { isEn } = useLanguage();
  const [pos, setPos] = useState(win.position);
  const [size, setSize] = useState(win.size);
  const [activeSnap, setActiveSnap] = useState<SnapRect | null>(null);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialDragPos = useRef({ x: 0, y: 0 });

  const isResizing = useRef<string | null>(null);
  const resizeStart = useRef({ x: 0, y: 0 });
  const initialResizeSize = useRef({ width: 0, height: 0 });
  const initialResizePos = useRef({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPos(win.position);
  }, [win.position]);

  useEffect(() => {
    setSize(win.size);
  }, [win.size]);

  // DRAGGING TITLEBAR & SNAPPING
  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onFocus();
    sound.playClick();
    if (win.isMaximized) return;

    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialDragPos.current = { ...pos };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const isMacBar = typeof document !== 'undefined' && !!document.querySelector('.system7-menubar');
    const topOffset = isMacBar ? 22 : 0;
    const bottomBarHeight = isMacBar ? 0 : 38;

    const newX = Math.max(-100, Math.min(window.innerWidth - 80, initialDragPos.current.x + dx));
    const newY = Math.max(topOffset, Math.min(window.innerHeight - 60, initialDragPos.current.y + dy));
    setPos({ x: newX, y: newY });

    // Edge & Corner Snapping Detection
    const deskWidth = window.innerWidth;
    const deskHeight = window.innerHeight - (topOffset + bottomBarHeight);
    const EDGE = 24;
    const CORNER = 70;
    let snap: SnapRect | null = null;

    if (e.clientX <= EDGE && e.clientY <= CORNER + topOffset) {
      // Top-left quarter
      snap = { x: 0, y: topOffset, width: Math.round(deskWidth / 2), height: Math.round(deskHeight / 2), type: 'top-left' };
    } else if (e.clientX >= deskWidth - EDGE && e.clientY <= CORNER + topOffset) {
      // Top-right quarter
      snap = { x: Math.round(deskWidth / 2), y: topOffset, width: Math.round(deskWidth / 2), height: Math.round(deskHeight / 2), type: 'top-right' };
    } else if (e.clientX <= EDGE && e.clientY >= deskHeight - CORNER) {
      // Bottom-left quarter
      snap = { x: 0, y: Math.round(deskHeight / 2) + topOffset, width: Math.round(deskWidth / 2), height: Math.round(deskHeight / 2), type: 'bottom-left' };
    } else if (e.clientX >= deskWidth - EDGE && e.clientY >= deskHeight - CORNER) {
      // Bottom-right quarter
      snap = { x: Math.round(deskWidth / 2), y: Math.round(deskHeight / 2) + topOffset, width: Math.round(deskWidth / 2), height: Math.round(deskHeight / 2), type: 'bottom-right' };
    } else if (e.clientY <= 12 + topOffset) {
      // Top edge -> Full screen
      snap = { x: 0, y: topOffset, width: deskWidth, height: deskHeight, type: 'maximize' };
    } else if (e.clientX <= EDGE) {
      // Left edge -> Left half
      snap = { x: 0, y: topOffset, width: Math.round(deskWidth / 2), height: deskHeight, type: 'left-half' };
    } else if (e.clientX >= deskWidth - EDGE) {
      // Right edge -> Right half
      snap = { x: Math.round(deskWidth / 2), y: topOffset, width: Math.round(deskWidth / 2), height: deskHeight, type: 'right-half' };
    }

    setActiveSnap(snap);
    if (onSnapPreviewChange) {
      onSnapPreviewChange(snap);
    }
  };

  const handleTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}

      if (activeSnap) {
        sound.playSnap();
        setPos({ x: activeSnap.x, y: activeSnap.y });
        setSize({ width: activeSnap.width, height: activeSnap.height });
        if (onUpdateBounds) {
          onUpdateBounds({
            pos: { x: activeSnap.x, y: activeSnap.y },
            size: { width: activeSnap.width, height: activeSnap.height }
          });
        }
        setActiveSnap(null);
        if (onSnapPreviewChange) {
          onSnapPreviewChange(null);
        }
      } else {
        if (onUpdateBounds) {
          onUpdateBounds({ pos, size });
        }
      }
    }
  };

  // RESIZING HANDLERS
  const startResize = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    if (win.isMaximized) return;

    isResizing.current = dir;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    initialResizeSize.current = { ...size };
    initialResizePos.current = { ...pos };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing.current) return;
    const dir = isResizing.current;
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;

    let newWidth = initialResizeSize.current.width;
    let newHeight = initialResizeSize.current.height;
    let newX = initialResizePos.current.x;
    let newY = initialResizePos.current.y;

    if (dir.includes('e')) {
      newWidth = Math.max(340, Math.min(window.innerWidth - newX, initialResizeSize.current.width + dx));
    }
    if (dir.includes('s')) {
      newHeight = Math.max(220, Math.min(window.innerHeight - 38 - newY, initialResizeSize.current.height + dy));
    }
    if (dir.includes('w')) {
      const possibleW = initialResizeSize.current.width - dx;
      if (possibleW >= 340) {
        newWidth = possibleW;
        newX = initialResizePos.current.x + dx;
      }
    }
    if (dir.includes('n')) {
      const possibleH = initialResizeSize.current.height - dy;
      if (possibleH >= 220) {
        newHeight = possibleH;
        newY = initialResizePos.current.y + dy;
      }
    }

    setSize({ width: newWidth, height: newHeight });
    setPos({ x: newX, y: newY });
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing.current) {
      isResizing.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      if (onUpdateBounds) {
        onUpdateBounds({ pos, size });
      }
    }
  };

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  const isMacBar = typeof document !== 'undefined' && !!document.querySelector('.system7-menubar');
  const topOffset = isMacBar ? 22 : 0;
  const bottomBarHeight = isMacBar ? 0 : 38;

  const windowStyle: React.CSSProperties = win.isMaximized || isMobile
    ? {
        position: 'fixed',
        top: topOffset,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${topOffset + bottomBarHeight}px)`,
        zIndex: win.zIndex,
        display: 'flex',
        flexDirection: 'column'
      }
    : {
        position: 'absolute',
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxWidth: '100vw',
        maxHeight: `calc(100vh - ${topOffset + bottomBarHeight}px)`,
        zIndex: win.zIndex,
        display: 'flex',
        flexDirection: 'column'
      };

  return (
    <div
      className={`window retro-window-container ${!isActive ? 'inactive' : ''}`}
      style={windowStyle}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar */}
      <div
        className="title-bar"
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={() => {
          sound.playClick();
          onMaximize();
        }}
      >
        <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {win.icon && <span>{win.icon}</span>}
          <span>{win.title}</span>
        </div>
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              sound.playWindowClose();
              onMinimize();
            }}
          />
          <button
            aria-label="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onMaximize();
            }}
          />
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              sound.playWindowClose();
              onClose();
            }}
          />
        </div>
      </div>

      {/* Window Body */}
      <div className="window-body" style={{ flex: 1, margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <WindowErrorBoundary windowTitle={win.title}>
          {children}
        </WindowErrorBoundary>
      </div>

      {/* Status Bar */}
      <div className="status-bar" style={{ display: 'flex', gap: '6px', padding: '2px 6px', fontSize: '11px', background: '#d4d0c8', borderTop: '1px solid #808080', position: 'relative' }}>
        <p className="status-bar-field" style={{ margin: 0, flex: 1, padding: '1px 4px' }}>
          {isActive ? (isEn ? 'Active window' : 'Ventana activa') : isEn ? 'Background' : 'Segundo plano'}
        </p>
        <p className="status-bar-field" style={{ margin: 0, padding: '1px 6px', fontFamily: 'monospace' }}>
          {size.width}x{size.height}
        </p>

        {/* Diagonal Corner Resize Grip */}
        {!win.isMaximized && !isMobile && (
          <div
            onPointerDown={(e) => startResize(e, 'se')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            title={isEn ? 'Drag to resize' : 'Arrastrar para redimensionar'}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'se-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="8" y1="2" x2="2" y2="8" stroke="#808080" strokeWidth="1" />
              <line x1="9" y1="5" x2="5" y2="9" stroke="#808080" strokeWidth="1" />
              <line x1="9" y1="8" x2="8" y2="9" stroke="#808080" strokeWidth="1" />
              <line x1="8" y1="3" x2="3" y2="8" stroke="#ffffff" strokeWidth="1" />
              <line x1="9" y1="6" x2="6" y2="9" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* 8 Resize Edge & Corner Handles */}
      {!win.isMaximized && !isMobile && (
        <>
          {/* East */}
          <div
            onPointerDown={(e) => startResize(e, 'e')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', right: '-4px', top: '10px', bottom: '10px', width: '8px', cursor: 'e-resize', zIndex: 10, touchAction: 'none' }}
          />
          {/* South */}
          <div
            onPointerDown={(e) => startResize(e, 's')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', bottom: '-4px', left: '10px', right: '10px', height: '8px', cursor: 's-resize', zIndex: 10, touchAction: 'none' }}
          />
          {/* West */}
          <div
            onPointerDown={(e) => startResize(e, 'w')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', left: '-4px', top: '10px', bottom: '10px', width: '8px', cursor: 'w-resize', zIndex: 10, touchAction: 'none' }}
          />
          {/* North */}
          <div
            onPointerDown={(e) => startResize(e, 'n')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', top: '-4px', left: '10px', right: '10px', height: '8px', cursor: 'n-resize', zIndex: 10, touchAction: 'none' }}
          />
          {/* South-East */}
          <div
            onPointerDown={(e) => startResize(e, 'se')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', right: '-5px', bottom: '-5px', width: '12px', height: '12px', cursor: 'se-resize', zIndex: 11, touchAction: 'none' }}
          />
          {/* South-West */}
          <div
            onPointerDown={(e) => startResize(e, 'sw')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', left: '-5px', bottom: '-5px', width: '12px', height: '12px', cursor: 'sw-resize', zIndex: 11, touchAction: 'none' }}
          />
          {/* North-East */}
          <div
            onPointerDown={(e) => startResize(e, 'ne')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', right: '-5px', top: '-5px', width: '12px', height: '12px', cursor: 'ne-resize', zIndex: 11, touchAction: 'none' }}
          />
          {/* North-West */}
          <div
            onPointerDown={(e) => startResize(e, 'nw')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            style={{ position: 'absolute', left: '-5px', top: '-5px', width: '12px', height: '12px', cursor: 'nw-resize', zIndex: 11, touchAction: 'none' }}
          />
        </>
      )}
    </div>
  );
};

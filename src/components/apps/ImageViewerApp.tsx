import React, { useState, useEffect, useRef } from 'react';
import { getProjectMedia, type ProjectScreenshot } from '../../data/projectMedia';
import { getProjects } from '../../data/projects';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PixelSliders
} from '../ui/RetroIcons';

interface ImageViewerAppProps {
  initialProjectId?: string;
  onOpenProjectSpecs?: (projectId: string) => void;
}

export const ImageViewerApp: React.FC<ImageViewerAppProps> = ({
  initialProjectId,
  onOpenProjectSpecs
}) => {
  const { lang, isEn } = useLanguage();
  const mediaMap = getProjectMedia(lang);
  const localizedProjects = getProjects(lang);

  // Only projects that have screenshots
  const galleryProjectIds = Object.keys(mediaMap).filter(
    (id) => mediaMap[id].screenshots && mediaMap[id].screenshots.length > 0
  );

  const [currentProjectId, setCurrentProjectId] = useState<string>(
    initialProjectId && galleryProjectIds.includes(initialProjectId)
      ? initialProjectId
      : galleryProjectIds[0] || 'delta-traz'
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSlideshow, setIsSlideshow] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOriginRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync when initialProjectId changes
  useEffect(() => {
    if (initialProjectId && galleryProjectIds.includes(initialProjectId)) {
      setCurrentProjectId(initialProjectId);
      setCurrentIndex(0);
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }
  }, [initialProjectId]);

  const currentMedia = mediaMap[currentProjectId] || mediaMap['delta-traz'];
  const screenshots: ProjectScreenshot[] = currentMedia?.screenshots || [];
  const currentImage = screenshots[currentIndex] || screenshots[0];
  const currentProject = localizedProjects.find((p) => p.id === currentProjectId);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isSlideshow || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }, 3800);
    return () => clearInterval(interval);
  }, [isSlideshow, screenshots.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
        setIsSlideshow(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenshots.length]);

  const handleNext = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    sound.playClick();
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    sound.playClick();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleSlideshow = () => {
    sound.playClick();
    setIsSlideshow((prev) => !prev);
  };

  const handleSelectProject = (pId: string) => {
    sound.playClick();
    setCurrentProjectId(pId);
    setCurrentIndex(0);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setIsSlideshow(false);
  };

  // Drag-to-pan handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.image-viewer-caption-box')) return;
    isPanningRef.current = true;
    setIsDragging(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
    panOriginRef.current = { ...pan };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPan({
      x: panOriginRef.current.x + dx,
      y: panOriginRef.current.y + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
    } else {
      setZoomLevel((prev) => {
        const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
        if (next === 1) {
          setPan({ x: 0, y: 0 });
        }
        return next;
      });
    }
  };

  // Double click image toggles zoom
  const handleDoubleClickImage = () => {
    sound.playClick();
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoomLevel(1.85);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ece9d8',
        color: '#000000',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Retro Explorer / Photo Viewer Toolbar */}
      <div
        style={{
          background: '#d4d0c8',
          borderBottom: '2px solid #808080',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Project Selector & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentMedia?.logo && (
            <img
              src={currentMedia.logo}
              alt=""
              style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '3px', background: '#ffffff', padding: '1px', border: '1px solid #808080' }}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b' }}>
              {isEn ? 'Project:' : 'Proyecto:'}
            </span>
            <select
              value={currentProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                background: '#ffffff',
                border: '2px solid',
                borderColor: '#808080 #ffffff #ffffff #808080',
                cursor: 'pointer',
                fontWeight: 'bold',
                maxWidth: isMobile ? '160px' : '230px'
              }}
            >
              {galleryProjectIds.map((pId) => {
                const proj = localizedProjects.find((p) => p.id === pId);
                const count = mediaMap[pId]?.screenshots?.length || 0;
                return (
                  <option key={pId} value={pId}>
                    {proj?.title || pId} ({count} {isEn ? 'screenshots' : 'capturas'})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Center / Right: Navigation & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrev}
            disabled={screenshots.length <= 1}
            title={isEn ? 'Previous screenshot (Left Arrow)' : 'Captura anterior (Flecha Izquierda)'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#d4d0c8',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            ◀ {isMobile ? '' : isEn ? 'Previous' : 'Anterior'}
          </button>

          <span
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              background: '#ffffff',
              padding: '2px 8px',
              border: '1px solid #808080',
              fontWeight: 'bold',
              minWidth: '55px',
              textAlign: 'center'
            }}
          >
            {screenshots.length > 0 ? `${currentIndex + 1} / ${screenshots.length}` : '0 / 0'}
          </span>

          <button
            onClick={handleNext}
            disabled={screenshots.length <= 1}
            title={isEn ? 'Next screenshot (Right Arrow)' : 'Siguiente captura (Flecha Derecha)'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#d4d0c8',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            {isMobile ? '' : isEn ? 'Next' : 'Siguiente'} ▶
          </button>

          <div style={{ width: '1px', height: '18px', background: '#808080', margin: '0 2px' }} />

          <button
            onClick={handleZoomIn}
            title={isEn ? 'Zoom in' : 'Acercar imagen'}
            style={{
              padding: '3px 7px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#d4d0c8',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            🔍+
          </button>

          <button
            onClick={handleZoomOut}
            title={isEn ? 'Zoom out' : 'Alejar imagen'}
            style={{
              padding: '3px 7px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#d4d0c8',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            🔍-
          </button>

          <button
            onClick={handleResetZoom}
            title={isEn ? 'Reset to actual size' : 'Restablecer tamaño normal'}
            style={{
              padding: '3px 6px',
              fontSize: '11px',
              background: zoomLevel === 1 ? '#e2e8f0' : '#d4d0c8',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            1:1
          </button>

          <button
            onClick={toggleSlideshow}
            title={
              isEn
                ? isSlideshow
                  ? 'Pause slideshow'
                  : 'Start automatic slideshow'
                : isSlideshow
                ? 'Pausar presentación'
                : 'Iniciar presentación automática'
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: isSlideshow ? '#16a34a' : '#d4d0c8',
              color: isSlideshow ? '#ffffff' : '#000000',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              cursor: 'pointer'
            }}
          >
            {isSlideshow ? (isEn ? '⏸ Pause' : '⏸ Pausa') : isEn ? '⏯ Slideshow' : '⏯ Pase'}
          </button>

          {onOpenProjectSpecs && currentProject && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenProjectSpecs(currentProjectId);
              }}
              title={
                isEn
                  ? 'Open explorer with full technical specs and architecture'
                  : 'Abrir explorador con la ficha técnica completa y arquitectura'
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                background: '#000080',
                color: '#ffffff',
                border: '2px solid',
                borderColor: '#ffffff #000000 #000000 #ffffff',
                cursor: 'pointer',
                marginLeft: '4px'
              }}
            >
              <PixelSliders size={12} color="#ffffff" />
              <span>{isMobile ? (isEn ? 'Specs' : 'Ficha') : isEn ? 'Tech Specs' : 'Ficha Técnica'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Picture Viewing Stage with Free Pan & Zoom */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{
          flex: 1,
          position: 'relative',
          background: '#18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0',
          touchAction: 'none',
          cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {currentImage ? (
          <>
            {/* Pannable & Zoomable Image Area */}
            <div
              onDoubleClick={handleDoubleClickImage}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.12s ease-out',
                pointerEvents: 'auto'
              }}
            >
              <img
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.title}
                draggable={false}
                style={{
                  maxWidth: '92%',
                  maxHeight: 'calc(100% - 75px)',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: currentImage.device === 'mobile' ? '14px' : '4px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                  border: currentImage.device === 'mobile' ? '4px solid #334155' : '1px solid #475569',
                  userSelect: 'none'
                }}
              />
            </div>

            {/* Top Left: Zoom and Pan Hint Indicator */}
            {zoomLevel > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#38bdf8',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: '1px solid #0284c7',
                  zIndex: 15,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🔍 Zoom {Math.round(zoomLevel * 100)}%</span>
                <span style={{ opacity: 0.6 }}>|</span>
                <span style={{ fontSize: '10px', color: '#e2e8f0' }}>
                  {isEn ? ' Drag to pan' : ' Arrastra para mover'}
                </span>
              </div>
            )}

            {/* Top Right: Device Badge */}
            {currentImage.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: '1px solid #0284c7',
                  letterSpacing: '0.5px',
                  zIndex: 15,
                  pointerEvents: 'none'
                }}
              >
                {currentImage.badge}
              </div>
            )}

            {/* Bottom Floating Caption Card */}
            <div
              className="image-viewer-caption-box"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '740px',
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '6px 14px',
                color: '#f8fafc',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                zIndex: 15,
                backdropFilter: 'blur(4px)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '2px' }}>
                {currentImage.title}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.35' }}>
                {currentImage.caption}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
            {isEn ? 'No screenshots available for this project.' : 'No hay capturas disponibles para este proyecto.'}
          </div>
        )}
      </div>

      {/* Filmstrip / Bottom Thumbnails Bar */}
      {screenshots.length > 0 && (
        <div
          style={{
            height: isMobile ? '70px' : '82px',
            background: '#d4d0c8',
            borderTop: '2px solid #ffffff',
            borderBottom: '1px solid #808080',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            overflowX: 'auto',
            flexShrink: 0
          }}
        >
          {screenshots.map((s, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <div
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                }}
                style={{
                  height: isMobile ? '56px' : '68px',
                  width: isMobile ? '60px' : '76px',
                  flexShrink: 0,
                  cursor: 'pointer',
                  background: '#000000',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isSelected ? '3px solid #000080' : '2px solid',
                  borderColor: isSelected ? '#000080' : '#808080 #ffffff #ffffff #808080',
                  boxShadow: isSelected ? '0 0 6px rgba(0,0,128,0.8)' : 'none',
                  opacity: isSelected ? 1 : 0.75,
                  transition: 'all 0.1s ease'
                }}
                title={s.title}
              >
                <img
                  src={s.src}
                  alt={s.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#ffffff',
                    fontSize: '8px',
                    padding: '0 2px',
                    borderRadius: '2px'
                  }}
                >
                  {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Windows 98 / Classic Status Bar */}
      <div
        style={{
          background: '#d4d0c8',
          borderTop: '1px solid #808080',
          padding: '2px 8px',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#334155'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentProject?.title} - {currentMedia.companyName}
        </span>
        <span style={{ fontFamily: 'monospace', flexShrink: 0, marginLeft: '8px' }}>
          Zoom: {Math.round(zoomLevel * 100)}%
        </span>
      </div>
    </div>
  );
};

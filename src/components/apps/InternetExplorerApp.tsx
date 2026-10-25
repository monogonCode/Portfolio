import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import {
  PixelArrowLeft,
  PixelArrowRight,
  PixelReload,
  PixelHome,
  PixelClose,
  PixelExternalLink,
  PixelLock,
  PixelGlobe,
  PixelPrinter,
  PixelSparkles
} from '../ui/RetroIcons';
import { useLanguage } from '../../i18n/LanguageContext';

interface InternetExplorerAppProps {
  initialUrl?: string;
}

export const InternetExplorerApp: React.FC<InternetExplorerAppProps> = ({
  initialUrl = 'https://explotacioneschumbos.es'
}) => {
  const { isEn } = useLanguage();
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    if (initialUrl && initialUrl !== currentUrl) {
      navigateTo(initialUrl);
    }
  }, [initialUrl]);

  const navigateTo = (url: string) => {
    sound.playClick();
    let formatted = url.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setCurrentUrl(formatted);
    setInputUrl(formatted);
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);

    setHistory((prev) => [...prev.slice(0, historyIdx + 1), formatted]);
    setHistoryIdx((prev) => prev + 1);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      sound.playClick();
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      const target = history[newIdx];
      setCurrentUrl(target);
      setInputUrl(target);
      setIsLoading(true);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      sound.playClick();
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      const target = history[newIdx];
      setCurrentUrl(target);
      setInputUrl(target);
      setIsLoading(true);
      setIframeKey((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    sound.playClick();
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleStop = () => {
    sound.playClick();
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const openInNewTab = () => {
    sound.playClick();
    window.open(currentUrl, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#d4d0c8' }}>
      {/* Top Menu Bar */}
      <div style={{ display: 'flex', gap: '12px', padding: '2px 8px', fontSize: '11px', background: '#d4d0c8', borderBottom: '1px solid #808080' }}>
        {isEn ? (
          <>
            <span><u>F</u>ile</span>
            <span><u>E</u>dit</span>
            <span><u>V</u>iew</span>
            <span>F<u>a</u>vorites</span>
            <span><u>T</u>ools</span>
            <span><u>H</u>elp</span>
          </>
        ) : (
          <>
            <span><u>A</u>rchivo</span>
            <span><u>E</u>dición</span>
            <span><u>V</u>er</span>
            <span><u>F</u>avoritos</span>
            <span><u>H</u>erramientas</span>
            <span>A<u>y</u>uda</span>
          </>
        )}
      </div>

      {/* Main Navigation Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', background: '#d4d0c8', borderBottom: '1px solid #808080', flexWrap: 'wrap' }}>
        <button
          onClick={handleBack}
          disabled={historyIdx <= 0}
          title={isEn ? 'Back' : 'Atrás'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 6px',
            fontSize: '11px',
            cursor: historyIdx > 0 ? 'pointer' : 'default',
            opacity: historyIdx > 0 ? 1 : 0.5
          }}
        >
          <PixelArrowLeft size={13} />
          <span>{isEn ? 'Back' : 'Atrás'}</span>
        </button>

        <button
          onClick={handleForward}
          disabled={historyIdx >= history.length - 1}
          title={isEn ? 'Forward' : 'Adelante'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 6px',
            fontSize: '11px',
            cursor: historyIdx < history.length - 1 ? 'pointer' : 'default',
            opacity: historyIdx < history.length - 1 ? 1 : 0.5
          }}
        >
          <span>{isEn ? 'Forward' : 'Adelante'}</span>
          <PixelArrowRight size={13} />
        </button>

        <button
          onClick={handleStop}
          title={isEn ? 'Stop' : 'Detener'}
          style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
        >
          <PixelClose size={13} color="#dc2626" />
          <span>{isEn ? 'Stop' : 'Detener'}</span>
        </button>

        <button
          onClick={handleRefresh}
          title={isEn ? 'Refresh' : 'Actualizar'}
          style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
        >
          <PixelReload size={13} color="#16a34a" />
          <span>{isEn ? 'Refresh' : 'Actualizar'}</span>
        </button>

        <button
          onClick={() => navigateTo('https://explotacioneschumbos.es')}
          title={isEn ? 'Home Page' : 'Página de Inicio'}
          style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}
        >
          <PixelHome size={13} color="#000080" />
          <span>{isEn ? 'Home' : 'Inicio'}</span>
        </button>

        <div style={{ width: '1px', height: '18px', background: '#808080', margin: '0 4px' }} />

        <button
          onClick={openInNewTab}
          title={isEn ? 'Open in a new browser tab' : 'Abrir en pestaña nueva del navegador'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: '#000080',
            color: '#ffffff',
            border: '2px solid',
            borderColor: '#ffffff #000000 #000000 #ffffff',
            cursor: 'pointer'
          }}
        >
          <PixelExternalLink size={12} color="#ffffff" />
          <span>{isEn ? 'Open in new tab' : 'Abrir pestaña nueva'}</span>
        </button>

        {/* Animated Globe / IE Throbber */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '4px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              background: '#000080',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PixelGlobe
              size={16}
              color="#38bdf8"
              style={{
                animation: isLoading ? 'spin 1.5s infinite linear' : 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 6px',
          background: '#d4d0c8',
          borderBottom: '1px solid #808080'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{isEn ? 'Address:' : 'Dirección:'}</span>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '1px 4px'
          }}
        >
          <PixelLock size={12} color="#16a34a" style={{ marginRight: '4px' }} />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '2px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          {isEn ? 'Go' : 'Ir a'}
        </button>
      </form>

      {/* Favorites / Quick Bookmarks Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 6px',
          background: '#ece9d8',
          borderBottom: '1px solid #808080',
          fontSize: '11px',
          overflowX: 'auto'
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#475569', fontSize: '10px' }}>
          {isEn ? 'Links:' : 'Vínculos:'}
        </span>

        <button
          onClick={() => navigateTo('https://explotacioneschumbos.es')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '1px 6px',
            fontSize: '11px',
            background: currentUrl.includes('chumbos') ? '#dbeafe' : '#ffffff',
            border: '1px solid #94a3b8',
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        >
          <PixelGlobe size={11} color="#0284c7" />
          <span>Explotaciones Chumbos (Astro)</span>
        </button>

        <button
          onClick={() => navigateTo('https://pastelerialidiahelem.com')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '1px 6px',
            fontSize: '11px',
            background: currentUrl.includes('lidiahelem') ? '#fce7f3' : '#ffffff',
            border: '1px solid #94a3b8',
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        >
          <PixelGlobe size={11} color="#db2777" />
          <span>Obrador Lidia Helem (React)</span>
        </button>

        <button
          onClick={() => navigateTo('https://github.com/monogonCode')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '1px 6px',
            fontSize: '11px',
            background: '#ffffff',
            border: '1px solid #94a3b8',
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        >
          <span>GitHub (@monogonCode)</span>
        </button>
      </div>

      {/* Main Browser Viewport */}
      <div style={{ flex: 1, position: 'relative', background: '#ffffff', overflow: 'hidden' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              background: '#000080',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '2px',
              fontSize: '10px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <PixelReload size={11} style={{ animation: 'spin 1s infinite linear' }} />
            <span>{isEn ? 'Loading page...' : 'Cargando página...'}</span>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={currentUrl}
          title="Internet Explorer Browser"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 8px',
          background: '#d4d0c8',
          borderTop: '1px solid #808080',
          fontSize: '10px',
          color: '#334155'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PixelGlobe size={11} color="#16a34a" />
          <span>
            {isLoading
              ? isEn
                ? `Loading ${currentUrl}...`
                : `Cargando ${currentUrl}...`
              : isEn
              ? 'Done'
              : 'Listo'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <PixelLock size={10} color="#16a34a" /> {isEn ? 'Internet Zone (HTTPS)' : 'Zona de Internet (HTTPS)'}
          </span>
        </div>
      </div>
    </div>
  );
};

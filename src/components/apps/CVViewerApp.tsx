import React, { useRef } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PixelDownload,
  PixelPrinter,
  PixelCheckDouble,
  PixelFileText,
  PixelGlobe
} from '../ui/RetroIcons';

export const CVViewerApp: React.FC = () => {
  const { lang, isEn, toggleLang } = useLanguage();
  const pdfIframeRef = useRef<HTMLIFrameElement | null>(null);

  const currentPdfUrl = isEn ? '/cv/CV_Martin_26_EN.pdf' : '/cv/CV_Martin_26.pdf';
  const currentFilename = isEn ? 'CV_Martin_26_EN.pdf' : 'CV_Martin_26.pdf';

  const toggleLanguage = () => {
    toggleLang();
  };

  const handlePrint = () => {
    sound.playClick();

    // 1. Try to print directly through the embedded PDF iframe
    if (pdfIframeRef.current && pdfIframeRef.current.contentWindow) {
      try {
        pdfIframeRef.current.contentWindow.focus();
        pdfIframeRef.current.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Direct iframe print error, trying fallback:', err);
      }
    }

    // 2. Fallback: dedicated hidden print iframe
    try {
      let printFrame = document.getElementById('retro-cv-print-frame') as HTMLIFrameElement | null;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'retro-cv-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        document.body.appendChild(printFrame);
      }

      printFrame.src = currentPdfUrl;
      printFrame.onload = () => {
        setTimeout(() => {
          try {
            printFrame?.contentWindow?.focus();
            printFrame?.contentWindow?.print();
          } catch {
            window.open(currentPdfUrl, '_blank');
          }
        }, 250);
      };
    } catch {
      window.open(currentPdfUrl, '_blank');
    }
  };

  const handleDownloadRetro = () => {
    sound.playClick();
    const link = document.createElement('a');
    link.href = currentPdfUrl;
    link.download = currentFilename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#52525b' }}>
      {/* WordPad / Acrobat Retro Toolbar */}
      <div
        className="wordpad-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '4px 8px',
          background: '#d4d0c8',
          borderBottom: '1px solid #808080'
        }}
      >
        {/* Document Tab Indicator */}
        <div style={{ display: 'flex', gap: '2px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#ffffff',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              cursor: 'default'
            }}
          >
            <PixelFileText size={12} color="#000080" />
            <span>{isEn ? 'Curriculum Vitae (EN - 1 Page)' : 'Curriculum Vitae (ES - 1 Pág.)'}</span>
          </div>
        </div>

        {/* Button to toggle/switch language */}
        <button
          onClick={toggleLanguage}
          title={isEn ? 'Cambiar a versión en Español (ES)' : 'Show English version (EN)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: isEn ? '#1d4ed8' : '#d4d0c8',
            color: isEn ? '#ffffff' : '#0f172a',
            border: '2px solid',
            borderColor: isEn ? '#93c5fd #0f172a #0f172a #93c5fd' : '#ffffff #404040 #404040 #ffffff',
            boxShadow: '1px 1px 0 #000000',
            cursor: 'pointer'
          }}
        >
          <PixelGlobe size={13} color={isEn ? '#ffffff' : '#000080'} />
          <span>{isEn ? '🇪🇸 Ver en Español' : '🇬🇧 View in English'}</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 2px' }} />

        {/* Download button */}
        <button
          onClick={handleDownloadRetro}
          title={isEn ? 'Download CV in English (CV_Martin_26_EN.pdf)' : 'Descargar CV en Español (CV_Martin_26.pdf)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: '#000080',
            color: '#ffffff',
            border: '2px solid',
            borderColor: '#ffffff #000000 #000000 #ffffff',
            boxShadow: '1px 1px 0 #000000',
            cursor: 'pointer'
          }}
        >
          <PixelDownload size={13} color="#ffffff" />
          <span>{isEn ? 'Download CV (EN_PDF)' : 'Descargar CV (PDF)'}</span>
        </button>

        {/* Print button */}
        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #404040 #404040 #ffffff',
            boxShadow: '1px 1px 0 #000000',
            cursor: 'pointer'
          }}
        >
          <PixelPrinter size={13} />
          <span>{isEn ? 'Print' : 'Imprimir'}</span>
        </button>

        {/* Active file status indicator */}
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 'bold'
          }}
        >
          <PixelCheckDouble size={14} color="#15803d" />
          <span>{isEn ? `~/Documents/${currentFilename} (1 Page)` : `~/Documentos/${currentFilename} (1 Pág)`}</span>
        </div>
      </div>

      {/* Main Content Area - Full vector PDF */}
      <div style={{ flex: 1, width: '100%', height: '100%', background: '#18181b' }}>
        <iframe
          key={lang}
          ref={pdfIframeRef}
          src={`${currentPdfUrl}#toolbar=1&view=FitH`}
          title={currentFilename}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { LOGO_CHUMBOS } from '../../data/projectMedia';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  PixelFolder
} from '../ui/RetroIcons';

interface ChumbosFolderAppProps {
  onOpenProject: (projectId: string) => void;
  onOpenBrowser: (url: string) => void;
}

interface FolderItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  type: string;
  size: string;
  targetUrl?: string;
  screenshotsCount?: number;
}

export const ChumbosFolderApp: React.FC<ChumbosFolderAppProps> = ({
  onOpenProject,
  onOpenBrowser
}) => {
  const { isEn } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>('chumbos-fichaje');

  const items: FolderItem[] = [
    {
      id: 'chumbos-portal',
      name: 'ChumbosPortal.app',
      subtitle: isEn ? 'Corporate Website & Ethics Channel' : 'Página Web Corporativa & Canal Ético',
      badge: isEn ? 'Astro + Prisma Web' : 'Web Astro + Prisma',
      type: isEn ? 'Web Application Shortcut' : 'Acceso directo a Aplicación Web',
      size: '2.4 MB',
      targetUrl: 'https://explotacioneschumbos.es'
    },
    {
      id: 'chumbos-fichaje',
      name: 'FichajeAgro.apk',
      subtitle: isEn ? 'Time Tracking, GPS & ERP Sync' : 'Control Horario, GPS y Sincronización ERP',
      badge: 'Android Kotlin',
      type: isEn ? 'Android Application Package' : 'Paquete de Aplicación Android',
      size: '18.6 MB',
      screenshotsCount: 5
    },
    {
      id: 'chumbos-chatbot',
      name: 'ChumbosBot.js',
      subtitle: isEn ? 'Autonomous WhatsApp Bot for Farms & Tasks' : 'Asistente Autónomo WhatsApp de Fincas y Tareas',
      badge: 'Node.js Bot',
      type: isEn ? 'Autonomous Service Script' : 'Script de Servicio Autónomo',
      size: '1.1 MB',
      screenshotsCount: 1
    }
  ];

  const handleItemClick = (item: FolderItem) => {
    sound.playClick();
    setSelectedId(item.id);
  };

  const handleItemDoubleClick = (item: FolderItem) => {
    sound.playWindowOpen();
    if (item.id === 'chumbos-portal') {
      onOpenBrowser(item.targetUrl || 'https://explotacioneschumbos.es');
      onOpenProject(item.id);
    } else {
      onOpenProject(item.id);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        background: '#ffffff', 
        color: '#000000',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        userSelect: 'none'
      }}
    >
      {/* Retro Windows Explorer Toolbar */}
      <div 
        style={{ 
          background: '#d4d0c8', 
          borderBottom: '1px solid #808080', 
          padding: '4px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap'
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          <span>{isEn ? '← Back' : '← Atrás'}</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          <span>{isEn ? '→ Forward' : '→ Adelante'}</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          <span>{isEn ? '↑ Up' : '↑ Arriba'}</span>
        </button>

        <div style={{ width: '1px', height: '18px', background: '#808080', margin: '0 2px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '180px' }}>
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold' }}>
            {isEn ? 'Address:' : 'Dirección:'}
          </span>
          <div 
            style={{ 
              flex: 1, 
              background: '#ffffff', 
              border: '2px solid', 
              borderColor: '#808080 #ffffff #ffffff #808080',
              padding: '2px 6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PixelFolder size={12} color="#eab308" />
            <span>{isEn ? 'C:\\Companies\\HNOS Chumbos\\' : 'C:\\Empresas\\HNOS Chumbos\\'}</span>
          </div>
        </div>
      </div>

      {/* Company Overview Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
          borderBottom: '2px solid #cbd5e1', 
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <img 
          src={LOGO_CHUMBOS} 
          alt="HNOS Chumbos" 
          style={{ 
            width: '56px', 
            height: '56px', 
            objectFit: 'contain',
            borderRadius: '6px',
            background: '#ffffff',
            padding: '4px',
            border: '1px solid #94a3b8',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }} 
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>
            Explotaciones Agrícolas Hermanos Chumbos S.L.
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', lineHeight: '1.4' }}>
            {isEn
              ? 'Fruit and vegetable agri-food company. Collection of 3 systems developed and integrated into production: Android mobile app for field clock-ins, corporate web portal, and real-time conversational bot.'
              : 'Empresa agroindustrial hortofrutícola. Colección de 3 sistemas desarrollados e integrados en producción: Aplicación móvil Android de fichajes en campo, portal web corporativo y bot conversacional en tiempo real.'}
          </div>
        </div>
      </div>

      {/* Main Folder Items Grid */}
      <div 
        style={{ 
          flex: 1, 
          padding: '16px', 
          overflowY: 'auto',
          background: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
          alignContent: 'start'
        }}
      >
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              onDoubleClick={() => handleItemDoubleClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                background: isSelected ? '#000080' : 'transparent',
                color: isSelected ? '#ffffff' : '#0f172a',
                border: isSelected ? '1px dotted #ffff80' : '1px solid transparent',
                transition: 'background 0.1s ease'
              }}
              title={
                isEn
                  ? 'Double-click to open the project and view its screenshots'
                  : 'Doble clic para abrir el proyecto y visualizar sus capturas'
              }
            >
              {/* Icon Container with Company Logo */}
              <div 
                style={{ 
                  width: '64px', 
                  height: '52px', 
                  background: '#ffffff', 
                  border: '2px solid',
                  borderColor: isSelected ? '#ffffff' : '#dfdfdf #808080 #808080 #dfdfdf',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                  position: 'relative',
                  marginBottom: '8px'
                }}
              >
                <img 
                  src={LOGO_CHUMBOS} 
                  alt={item.name} 
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                />
                {item.screenshotsCount && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-4px', 
                      right: '-4px', 
                      background: '#16a34a', 
                      color: '#ffffff', 
                      fontSize: '9px', 
                      fontWeight: 'bold', 
                      padding: '1px 4px', 
                      borderRadius: '3px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.screenshotsCount} img
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div style={{ fontSize: '12px', fontWeight: 'bold', wordBreak: 'break-word', maxWidth: '170px' }}>
                {item.name}
              </div>
              <div 
                style={{ 
                  fontSize: '10px', 
                  marginTop: '3px', 
                  opacity: isSelected ? 0.9 : 0.7, 
                  lineHeight: '1.3',
                  maxWidth: '170px' 
                }}
              >
                {item.subtitle}
              </div>

              {/* Badge */}
              <div 
                style={{ 
                  marginTop: '6px', 
                  fontSize: '9px', 
                  padding: '1px 6px', 
                  borderRadius: '3px', 
                  background: isSelected ? '#1e40af' : '#e2e8f0', 
                  color: isSelected ? '#ffffff' : '#334155',
                  fontWeight: 'bold' 
                }}
              >
                {item.badge}
              </div>

              {/* Action Prompt */}
              <div style={{ marginTop: '8px', fontSize: '9px', color: isSelected ? '#93c5fd' : '#0284c7', fontWeight: 'bold' }}>
                {item.id === 'chumbos-portal'
                  ? isEn
                    ? '🌐 Open Web / Specs'
                    : '🌐 Abrir Web / Ficha'
                  : isEn
                  ? '🖼️ View Screenshots & Specs'
                  : '🖼️ Ver Capturas & Ficha'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Detail Footer Bar */}
      <div 
        style={{ 
          background: '#d4d0c8', 
          borderTop: '2px solid #808080', 
          padding: '4px 10px', 
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px'
        }}
      >
        <span>
          {isEn ? (
            <>
              <b>{items.length} objects</b> | 1 enterprise folder selected
            </>
          ) : (
            <>
              <b>{items.length} objetos</b> | 1 carpeta empresarial seleccionada
            </>
          )}
        </span>

        {selectedId && (
          <button
            onClick={() => {
              const it = items.find((i) => i.id === selectedId);
              if (it) handleItemDoubleClick(it);
            }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 'bold',
              background: '#000080',
              color: '#ffffff',
              border: '2px solid',
              borderColor: '#ffffff #000000 #000000 #ffffff',
              cursor: 'pointer'
            }}
          >
            {isEn ? 'Open Selected Item ▶' : 'Abrir Elemento Seleccionado ▶'}
          </button>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  PixelMonitor, 
  PixelSparkles, 
  PixelImage, 
  PixelZap 
} from '../ui/RetroIcons';

interface SettingsAppProps {
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentBg: string;
  onSelectBg: (bg: string) => void;
  onClose?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  currentTheme,
  onSelectTheme,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  currentBg,
  onSelectBg,
  onClose
}) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'theme' | 'effects' | 'wallpaper'>('theme');
  const [tempTheme, setTempTheme] = useState<string>(currentTheme);
  const [tempBg, setTempBg] = useState<string>(currentBg);

  const themes = [
    {
      id: 'win98',
      name: 'Windows 98',
      desc: isEn
        ? 'Classic 1998 PC with beveled borders and gray/teal palette'
        : 'Clásico PC de 1998 con bordes biselados y paleta gris/teal',
      font: 'MS Sans Serif'
    },
    {
      id: 'winxp',
      name: 'Windows XP (Luna)',
      desc: isEn
        ? '2001 Luna blue aesthetic, rounded corners, and soft buttons'
        : 'Estética azul Luna de 2001, esquinas redondeadas y botones suaves',
      font: 'Tahoma'
    },
    {
      id: 'mac',
      name: 'Mac Classic System 7',
      desc: isEn
        ? 'Vintage 1984-1991 Apple Macintosh System 7 with Chicago font'
        : 'Sistema Apple Macintosh vintage 1984-1991 con fuente Chicago',
      font: 'Chicago'
    },
    {
      id: 'nes',
      name: 'Nintendo NES 8-Bit',
      desc: isEn
        ? '8-bit pixel art style with retro gamer typography'
        : 'Estilo pixel art de 8 bits con tipografía retro gamer',
      font: 'Press Start 2P'
    }
  ];

  const backgrounds = [
    {
      id: 'win98',
      name: isEn ? 'Classic Teal with XANA Watermark' : 'Verde Azulado Clásico con marca de agua XANA'
    },
    { id: 'winxp', name: 'Windows XP Wallpaper (Bliss Om Nom Nom)' },
    { id: 'mac', name: isEn ? 'Mac Stipple Pattern' : 'Punteado Stipple Mac' },
    { id: 'matrix', name: isEn ? 'Cybernetic Green Grid' : 'Rejilla Cibernética Verde' },
    { id: 'amber', name: isEn ? 'Amber Phosphor Grid' : 'Rejilla Fósforo Ámbar' }
  ];

  const handleApply = () => {
    sound.playClick();
    onSelectTheme(tempTheme);
    onSelectBg(tempBg);
  };

  const handleOk = () => {
    handleApply();
    if (onClose) onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#d4d0c8', padding: '10px' }}>
      {/* Tab Navigation with Pixel Icons */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080', gap: '2px', marginBottom: '10px' }}>
        {[
          { id: 'theme', label: isEn ? 'System Theme' : 'Tema de Sistema', icon: <PixelMonitor size={13} /> },
          { id: 'effects', label: isEn ? 'Effects & Sound' : 'Efectos & Sonido', icon: <PixelSparkles size={13} /> },
          { id: 'wallpaper', label: isEn ? 'Desktop Wallpaper' : 'Fondo de Pantalla', icon: <PixelImage size={13} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                background: isActive ? '#d4d0c8' : '#c0c0c0',
                border: '2px solid',
                borderColor: isActive ? '#ffffff #808080 #d4d0c8 #ffffff' : '#ffffff #808080 #808080 #ffffff',
                borderBottom: isActive ? '2px solid #d4d0c8' : '1px solid #808080',
                fontWeight: isActive ? 'bold' : 'normal',
                marginBottom: '-1px'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div 
        style={{ 
          flex: 1, 
          background: '#ffffff', 
          border: '2px solid', 
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '12px',
          overflowY: 'auto'
        }}
      >
        {/* TAB 1: THEME */}
        {activeTab === 'theme' && (
          <div>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>
              {isEn
                ? 'Select the retro graphical environment to simulate the operating system:'
                : 'Selecciona el entorno gráfico retro que simulará el sistema operativo:'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {themes.map((t) => (
                <label
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setTempTheme(t.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '8px',
                    border: '1px solid',
                    borderColor: tempTheme === t.id ? '#000080' : '#e2e8f0',
                    background: tempTheme === t.id ? '#f0f4ff' : '#f8fafc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="theme"
                    checked={tempTheme === t.id}
                    onChange={() => setTempTheme(t.id)}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Monitor Preview */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <div 
                style={{ 
                  display: 'inline-block', 
                  width: '160px', 
                  height: '100px', 
                  border: '6px solid #475569', 
                  borderRadius: '6px',
                  background: tempTheme === 'win98' ? '#008080' : tempTheme === 'winxp' ? '#2b6cb0' : tempTheme === 'mac' ? '#b0b0b0' : '#111',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '14px', background: tempTheme === 'winxp' ? '#245edb' : '#c0c0c0' }} />
                <div style={{ color: '#fff', fontSize: '9px', paddingTop: '20px', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
                  {tempTheme.toUpperCase()} PREVIEW
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EFFECTS & SOUND */}
        {activeTab === 'effects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>
                {isEn ? 'CRT Monitor Effects:' : 'Efectos de Monitor CRT:'}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={crtEnabled}
                  onChange={() => {
                    sound.playClick();
                    onToggleCrt();
                  }}
                />
                <span>
                  {isEn
                    ? 'Enable scanlines (CRT Scanlines and phosphor vignette)'
                    : 'Activar líneas de escaneo (CRT Scanlines y viñeta de fósforo)'}
                </span>
              </label>
              <div style={{ fontSize: '10px', color: '#64748b', marginLeft: '22px', marginTop: '2px' }}>
                {isEn
                  ? 'Simulates the texture of a classic 1990s cathode-ray tube monitor.'
                  : 'Simula la textura de un monitor de tubo clásico de los años 90.'}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>
                {isEn ? 'Retro Sound Effects:' : 'Efectos de Sonido Retro:'}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => {
                    onToggleSound();
                  }}
                />
                <span>
                  {isEn
                    ? 'Enable audio synthesizer (Web Audio API)'
                    : 'Activar sintetizador de audio (Web Audio API)'}
                </span>
              </label>
              <div style={{ fontSize: '10px', color: '#64748b', marginLeft: '22px', marginTop: '2px' }}>
                {isEn
                  ? 'Plays retro button clicks, startup chords, and beeps when interacting with the system.'
                  : 'Reproduce clicks retro de botones, acordes de arranque y beeps al interactuar con el sistema.'}
              </div>
            </div>

            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PixelZap size={14} color="#f59e0b" />
              <span>
                {isEn ? (
                  <>
                    <b>Tip:</b> You can also mute or unmute sound directly from the speaker icon located in the taskbar next to the clock.
                  </>
                ) : (
                  <>
                    <b>Consejo:</b> También puedes activar o silenciar el sonido directamente desde el icono de altavoz situado en la barra de tareas junto al reloj.
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: WALLPAPER */}
        {activeTab === 'wallpaper' && (
          <div>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>
              {isEn ? 'Choose the background wallpaper for your desktop:' : 'Elige el tapiz de fondo para tu escritorio:'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {backgrounds.map((bg) => (
                <label
                  key={bg.id}
                  onClick={() => {
                    sound.playClick();
                    setTempBg(bg.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    border: '1px solid',
                    borderColor: tempBg === bg.id ? '#000080' : '#cbd5e1',
                    background: tempBg === bg.id ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '11px',
                    borderRadius: '3px'
                  }}
                >
                  <input
                    type="radio"
                    name="wallpaper"
                    checked={tempBg === bg.id}
                    onChange={() => setTempBg(bg.id)}
                  />
                  <span>{bg.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog Bottom Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '10px' }}>
        <button
          onClick={handleOk}
          style={{
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 'bold',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          {isEn ? 'OK' : 'Aceptar'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '4px 14px',
            fontSize: '11px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          {isEn ? 'Cancel' : 'Cancelar'}
        </button>
        <button
          onClick={handleApply}
          style={{
            padding: '4px 14px',
            fontSize: '11px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer'
          }}
        >
          {isEn ? 'Apply' : 'Aplicar'}
        </button>
      </div>
    </div>
  );
};


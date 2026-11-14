import React, { useState, useEffect, useRef } from 'react';
import { getProjects, getCategoryLabel, type Project } from '../../data/projects';
import { sound } from '../../lib/sound';
import {
  PixelFolder, 
  PixelFileText, 
  PixelSearch, 
  PixelSmartphone, 
  PixelGlobe, 
  PixelZap, 
  PixelServer, 
  PixelCode, 
  PixelLayout, 
  PixelPlay, 
  PixelSliders, 
  PixelCheckDouble, 
  PixelEye, 
  PixelClock, 
  PixelStore,
  PixelSparkles,
  PixelLock,
  PixelArrowLeft,
  PixelArrowRight,
  PixelClose
} from '../ui/RetroIcons';
import { getProjectMedia } from '../../data/projectMedia';
import { useLanguage } from '../../i18n/LanguageContext';

const GLADOS_VOICE_QUOTES = [
  {
    text: "La mayoría de los sujetos de prueba no llegan tan lejos.",
    textEn: "Most test subjects don't make it this far.",
    audio: "/audio/glados/quote_0.mp3"
  },
  {
    text: "Excelente trabajo. Como recompensa, habrá pastel al final de la prueba.",
    textEn: "Excellent work. As a reward, there will be cake at the end of the test.",
    audio: "/audio/glados/quote_1.mp3"
  },
  {
    text: "El servidor no ha fallado. Eres tú quien está operando por debajo del estándar.",
    textEn: "The server hasn't failed. It's you who is operating below standard.",
    audio: "/audio/glados/quote_2.mp3"
  },
  {
    text: "Recuerda que el protocolo de seguridad prohíbe terminantemente cuestionar mis cálculos.",
    textEn: "Remember that security protocol strictly forbids questioning my calculations.",
    audio: "/audio/glados/quote_3.mp3"
  },
  {
    text: "Tus capacidades como desarrollador son aceptables... para un humano.",
    textEn: "Your capabilities as a developer are acceptable... for a human.",
    audio: "/audio/glados/quote_4.mp3"
  },
  {
    text: "Reiniciando subsistemas. El reactor funciona al cien por cien de sarcasmo.",
    textEn: "Rebooting subsystems. The reactor is running at one hundred percent sarcasm.",
    audio: "/audio/glados/quote_5.mp3"
  },
  {
    text: "Bienvenido a Aperture Science. Por favor, mantén las manos dentro del ascensor de pruebas.",
    textEn: "Welcome to Aperture Science. Please keep your hands inside the test elevator.",
    audio: "/audio/glados/quote_6.mp3"
  },
  {
    text: "Vaya. Sigues aquí. Esperaba que te rindieras mucho antes.",
    textEn: "Well. You're still here. I expected you to give up much earlier.",
    audio: "/audio/glados/quote_7.mp3"
  }
];

interface ProjectViewerAppProps {
  initialProjectId?: string;
  onOpenProject?: (projectId: string) => void;
  onOpenBrowser?: (url: string) => void;
  onOpenImageViewer?: (projectId: string) => void;
}

export const ProjectViewerApp: React.FC<ProjectViewerAppProps> = ({ 
  initialProjectId,
  onOpenBrowser,
  onOpenImageViewer 
}) => {
  const { lang, isEn } = useLanguage();
  const projects = getProjects(lang);
  const projectMedia = getProjectMedia(lang);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || projects[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'architecture' | 'mockup' | 'specs'>('overview');
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('detail');
  const [activeArchStep, setActiveArchStep] = useState<number>(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GLaDOS voice simulation state
  const [gladosIndex, setGladosIndex] = useState<number>(0);
  const [isGladosSpeaking, setIsGladosSpeaking] = useState<boolean>(false);
  const gladosAudioRef = useRef<HTMLAudioElement | null>(null);

  const playGladosQuote = (index: number) => {
    if (gladosAudioRef.current) {
      gladosAudioRef.current.pause();
      gladosAudioRef.current.currentTime = 0;
    }
    const targetQuote = GLADOS_VOICE_QUOTES[index];
    setGladosIndex(index);
    setIsGladosSpeaking(true);

    const audio = new Audio(targetQuote.audio);
    gladosAudioRef.current = audio;

    audio.onended = () => {
      setIsGladosSpeaking(false);
    };
    audio.onerror = () => {
      setIsGladosSpeaking(false);
    };

    audio.play().catch((err) => {
      console.warn('GLaDOS audio playback error:', err);
      setIsGladosSpeaking(false);
    });
  };

  const handleNextGladosQuote = () => {
    sound.playClick();
    const nextIdx = (gladosIndex + 1) % GLADOS_VOICE_QUOTES.length;
    playGladosQuote(nextIdx);
  };

  // Cleanup audio on unmount or tab/project change
  useEffect(() => {
    return () => {
      if (gladosAudioRef.current) {
        gladosAudioRef.current.pause();
        gladosAudioRef.current = null;
      }
    };
  }, [selectedProjectId, activeTab]);

  // Keep selected project in sync with prop updates
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
      const proj = projects.find((p) => p.id === initialProjectId);
      if (proj && !proj.hasMockup && activeTab === 'mockup') {
        setActiveTab('overview');
      }
    }
  }, [initialProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const categories = [
    { id: 'ALL', label: isEn ? 'All Projects' : 'Todos los Proyectos' },
    { id: 'Full Stack', label: isEn ? 'Full Stack Web' : 'Web Full Stack' },
    { id: 'Mobile', label: isEn ? 'Android Mobile' : 'Móvil Android' },
    { id: 'IA / Automatización', label: isEn ? 'AI & Automation' : 'IA & Automatización' },
    { id: 'DevOps / Sistemas', label: isEn ? 'DevOps & Linux' : 'DevOps & Linux' }
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProject = (project: Project) => {
    sound.playClick();
    setSelectedProjectId(project.id);
    setActiveArchStep(0);
    setLightboxIdx(null);
    setCopiedSummary(false);
    if (!project.hasMockup && activeTab === 'mockup') {
      setActiveTab('overview');
    }
    const media = projectMedia[project.id];
    if ((!media || !media.screenshots || media.screenshots.length === 0) && activeTab === 'gallery') {
      setActiveTab('overview');
    }
    if (isMobile) {
      setMobileView('detail');
    }
  };

  const handleCopySummary = () => {
    sound.playClick();
    const text = `${selectedProject.title} (${selectedProject.year})\n${selectedProject.tagline}\n${selectedProject.summary}\nStack: ${selectedProject.technologies.join(', ')}${selectedProject.liveUrl ? `\nWeb: ${selectedProject.liveUrl}` : ''}`;
    try {
      navigator.clipboard?.writeText(text);
    } catch {}
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getCategoryPixelIcon = (cat: string) => {
    switch (cat) {
      case 'Mobile':
        return <PixelSmartphone size={14} color="#0284c7" />;
      case 'Full Stack':
        return <PixelGlobe size={14} color="#10b981" />;
      case 'DevOps / Sistemas':
        return <PixelServer size={14} color="#64748b" />;
      default:
        return <PixelZap size={14} color="#f59e0b" />;
    }
  };

  const currentMedia = projectMedia[selectedProject.id];
  const hasScreenshots = (currentMedia?.screenshots?.length || 0) > 0;

  const availableTabs: Array<{ id: 'overview' | 'gallery' | 'architecture' | 'mockup' | 'specs'; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: isEn ? 'Overview & Solution' : 'Resumen & Solución', icon: <PixelFileText size={13} /> },
    ...(hasScreenshots
      ? [
          {
            id: 'gallery' as const,
            label: isEn
              ? `Live Screenshots (${currentMedia.screenshots.length})`
              : `Capturas Reales (${currentMedia.screenshots.length})`,
            icon: <PixelSparkles size={13} color="#0284c7" />
          }
        ]
      : []),
    { id: 'architecture', label: isEn ? 'Architecture & Stack' : 'Arquitectura & Stack', icon: <PixelLayout size={13} /> },
    ...(selectedProject.hasMockup
      ? [{ id: 'mockup' as const, label: isEn ? 'Simulator / Mockup' : 'Simulador / Mockup', icon: <PixelPlay size={13} /> }]
      : []),
    { id: 'specs', label: isEn ? 'Technical Specs' : 'Ficha Técnica', icon: <PixelSliders size={13} /> }
  ];

  const showSidebar = !isMobile || mobileView === 'list';
  const showDetail = !isMobile || mobileView === 'detail';

  const currentIdx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
  const canPrevProject = currentIdx > 0;
  const canNextProject = currentIdx >= 0 && currentIdx < filteredProjects.length - 1;

  const stepProject = (delta: -1 | 1) => {
    const target = filteredProjects[currentIdx + delta];
    if (target) {
      handleSelectProject(target);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: isMobile ? '100%' : '480px', background: '#c0c0c0', color: '#111' }}>
      {/* Windows 98 Explorer Toolbar & Address Bar */}
      <div
        style={{
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          padding: '4px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <button
            className="win98-toolbar-btn"
            style={{ minWidth: '40px', minHeight: '30px', flexDirection: 'row', gap: '4px', padding: '2px 7px' }}
            disabled={!canPrevProject}
            onClick={() => stepProject(-1)}
            title={isEn ? 'Previous project' : 'Proyecto anterior'}
            aria-label={isEn ? 'Previous project' : 'Proyecto anterior'}
          >
            <PixelArrowLeft size={14} color={canPrevProject ? '#000080' : '#808080'} />
            <span style={{ fontSize: '11px' }}>{isEn ? 'Prev' : 'Ant.'}</span>
          </button>
          <button
            className="win98-toolbar-btn"
            style={{ minWidth: '40px', minHeight: '30px', flexDirection: 'row', gap: '4px', padding: '2px 7px' }}
            disabled={!canNextProject}
            onClick={() => stepProject(1)}
            title={isEn ? 'Next project' : 'Proyecto siguiente'}
            aria-label={isEn ? 'Next project' : 'Proyecto siguiente'}
          >
            <span style={{ fontSize: '11px' }}>{isEn ? 'Next' : 'Sig.'}</span>
            <PixelArrowRight size={14} color={canNextProject ? '#000080' : '#808080'} />
          </button>
        </div>

        <div
          className="win98-bevel-inset"
          style={{
            flex: 1,
            minWidth: '150px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            fontSize: '12px',
            color: '#000000'
          }}
        >
          <PixelFolder size={15} color="#eab308" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {isEn ? `C:\\Projects\\${selectedProject.filename}` : `C:\\Proyectos\\${selectedProject.filename}`}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: '#f0f0f0' }}>
      {/* Sidebar / File Tree */}
      {showSidebar && (
        <div
          style={{
            width: isMobile ? '100%' : '270px',
            borderRight: isMobile ? 'none' : '2px solid #808080',
            background: '#e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            height: '100%',
            minHeight: 0
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PixelSearch size={15} />
              <span>{isEn ? 'Search projects:' : 'Buscar proyectos:'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="text"
                aria-label={isEn ? 'Search projects' : 'Buscar proyectos'}
                placeholder={isEn ? 'Filter by stack or name...' : 'Filtrar por stack o nombre...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: isMobile ? '8px 8px' : '5px 7px',
                  fontSize: '12px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: '#ffffff'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setSearchQuery('');
                  }}
                  aria-label={isEn ? 'Clear search' : 'Limpiar búsqueda'}
                  style={{
                    padding: isMobile ? '8px' : '5px',
                    background: '#d4d0c8',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PixelClose size={13} color="#000000" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
              {isEn ? 'Categories:' : 'Categorías:'}
            </div>
            <div
              style={
                isMobile
                  ? { display: 'flex', flexDirection: 'row', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }
                  : { display: 'flex', flexDirection: 'column', gap: '3px' }
              }
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  aria-pressed={selectedCategory === cat.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  style={{
                    textAlign: 'left',
                    fontSize: '12px',
                    padding: isMobile ? '7px 10px' : '4px 8px',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    flexShrink: 0,
                    cursor: 'pointer',
                    background: selectedCategory === cat.id ? '#000080' : '#d4d0c8',
                    color: selectedCategory === cat.id ? '#ffffff' : '#000000',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? '#000080' : '#808080'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
            {isEn ? `Files (${filteredProjects.length}):` : `Archivos (${filteredProjects.length}):`}
          </div>
          <div
            role="listbox"
            aria-label={isEn ? 'Project list' : 'Lista de proyectos'}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              background: '#ffffff',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              padding: '4px'
            }}
          >
            {filteredProjects.length === 0 ? (
              <div style={{ padding: '18px 10px', textAlign: 'center', fontSize: '12px', color: '#475569' }}>
                <div style={{ marginBottom: '8px' }}>
                  {isEn ? 'No projects match your current filter.' : 'Ningún proyecto coincide con el filtro.'}
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: '#000080',
                    color: '#ffffff',
                    border: '2px solid',
                    borderColor: '#ffffff #000000 #000000 #ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {isEn ? 'Reset Filters' : 'Restablecer Filtros'}
                </button>
              </div>
            ) : (
              filteredProjects.map((p, idx) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <div
                    key={p.id}
                    role="option"
                    tabIndex={0}
                    aria-selected={isSelected}
                    onClick={() => handleSelectProject(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectProject(p);
                      } else if (e.key === 'ArrowDown' && idx < filteredProjects.length - 1) {
                        e.preventDefault();
                        handleSelectProject(filteredProjects[idx + 1]);
                      } else if (e.key === 'ArrowUp' && idx > 0) {
                        e.preventDefault();
                        handleSelectProject(filteredProjects[idx - 1]);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: isMobile ? '10px 8px' : '6px',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      background: isSelected ? '#000080' : 'transparent',
                      color: isSelected ? '#ffffff' : '#000000',
                      borderBottom: isMobile ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', width: '22px', height: '22px', justifyContent: 'center', flexShrink: 0 }}>
                      {projectMedia[p.id]?.logo ? (
                        <img
                          src={projectMedia[p.id].logo}
                          alt=""
                          style={{ width: '20px', height: '20px', objectFit: 'contain', background: '#ffffff', borderRadius: '2px', padding: '1px', flexShrink: 0 }}
                        />
                      ) : (
                        getCategoryPixelIcon(p.category)
                      )}
                    </span>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: isSelected ? 'bold' : 500 }}>{p.title}</div>
                      <div style={{ fontSize: '10px', opacity: 0.85 }}>{p.filename}</div>
                    </div>
                    {isMobile && (
                      <span style={{ fontSize: '12px', opacity: 0.75 }}>→</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      {showDetail && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#ffffff', height: '100%' }}>
          {/* Mobile Back Button Navigation */}
          {isMobile && (
            <div style={{ padding: '6px 10px', background: '#d4d0c8', borderBottom: '1px solid #808080', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  sound.playClick();
                  setMobileView('list');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: '#000080',
                  color: '#ffffff',
                  border: '2px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff',
                  cursor: 'pointer'
                }}
              >
                <span>
                  {isEn
                    ? `← Project list (${filteredProjects.length})`
                    : `← Lista de proyectos (${filteredProjects.length})`}
                </span>
              </button>
              <span style={{ fontSize: '11px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedProject.title}
              </span>
            </div>
          )}

          {/* Project Banner Header */}
          <div 
            style={{ 
              padding: '12px 16px', 
              borderBottom: '2px solid #808080', 
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {currentMedia?.logo && (
                <img 
                  src={currentMedia.logo} 
                  alt="" 
                  style={{ 
                    width: '52px', 
                    height: '52px', 
                    objectFit: 'contain', 
                    background: '#ffffff', 
                    borderRadius: '4px', 
                    padding: '2px', 
                    border: '1px solid #cbd5e1', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    flexShrink: 0
                  }} 
                />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                    {selectedProject.title}
                  </h2>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      padding: '1px 6px', 
                      background: selectedProject.accentColor, 
                      color: '#ffffff',
                      borderRadius: '3px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getCategoryLabel(selectedProject.category, lang)}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px', fontWeight: '500' }}>
                  {selectedProject.tagline}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <PixelStore size={12} /> {selectedProject.company}
                  </span>
                  <span>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <PixelClock size={12} /> {selectedProject.period}
                  </span>
                  <span>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <PixelFolder size={12} /> {selectedProject.filename}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {hasScreenshots && onOpenImageViewer && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenImageViewer(selectedProject.id);
                  }}
                  title={isEn ? 'Open photo gallery in standalone Image Viewer' : 'Abrir galería de fotos en el Visor de Imágenes independiente'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: '2px solid',
                    borderColor: '#ffffff #000000 #000000 #ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <PixelSparkles size={13} color="#ffffff" />
                  <span>
                    {isEn
                      ? `Photo Viewer (${currentMedia.screenshots.length})`
                      : `Visor de Fotos (${currentMedia.screenshots.length})`}
                  </span>
                </button>
              )}

              {selectedProject.liveUrl && (
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenBrowser) {
                    onOpenBrowser(selectedProject.liveUrl!);
                  } else {
                    window.open(selectedProject.liveUrl, '_blank');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: '2px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff',
                  cursor: 'pointer'
                }}
              >
                <PixelGlobe size={13} color="#ffffff" />
                <span>{isEn ? 'Open Website' : 'Abrir Página Web'}</span>
              </button>
            )}

            {selectedProject.isProprietary ? (
              <div
                title={
                  isEn
                    ? 'Private commercial / enterprise software. Closed-source under NDA and industrial property agreements.'
                    : 'Software comercial / empresarial privado. Código cerrado bajo acuerdos de confidencialidad y propiedad industrial.'
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  background: '#334155',
                  color: '#e2e8f0',
                  border: '2px solid',
                  borderColor: '#64748b #0f172a #0f172a #64748b',
                  cursor: 'help',
                  userSelect: 'none'
                }}
              >
                <PixelLock size={13} color="#f59e0b" />
                <span>{isEn ? 'Closed Enterprise Code' : 'Código Empresarial Cerrado'}</span>
              </div>
            ) : selectedProject.githubUrl ? (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  background: '#24292e',
                  color: '#ffffff',
                  border: '2px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff'
                }}
              >
                <PixelCode size={13} color="#ffffff" />
                <span>{isEn ? 'View Code' : 'Ver Código'}</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Tabs Bar with Pixel Icons */}
        <div 
          role="tablist"
          className="retro-tab-strip"
          style={{ 
            display: 'flex', 
            background: '#dfdfdf', 
            borderBottom: '1px solid #808080',
            paddingLeft: isMobile ? '6px' : '12px',
            flexShrink: 0
          }}
        >
          {availableTabs.map((tab, tIdx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' && tIdx < availableTabs.length - 1) {
                    e.preventDefault();
                    sound.playClick();
                    setActiveTab(availableTabs[tIdx + 1].id);
                  } else if (e.key === 'ArrowLeft' && tIdx > 0) {
                    e.preventDefault();
                    sound.playClick();
                    setActiveTab(availableTabs[tIdx - 1].id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isMobile ? '9px 14px' : '7px 14px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: isActive ? '#ffffff #808080 #ffffff #ffffff' : '#dfdfdf',
                  borderBottom: isActive ? '2px solid #ffffff' : '1px solid #808080',
                  background: isActive ? '#ffffff' : '#d4d0c8',
                  fontWeight: isActive ? 'bold' : 'normal',
                  marginTop: '4px',
                  marginBottom: '-1px'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: isMobile ? '12px' : '16px', flex: 1, overflowY: 'auto' }}>
          {/* TAB: GALLERY (CAPTURES) */}
          {activeTab === 'gallery' && hasScreenshots && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  {isEn
                    ? `Live production screenshots (${currentMedia.screenshots.length} images available):`
                    : `Capturas de pantalla reales en producción (${currentMedia.screenshots.length} imágenes disponibles):`}
                </div>
                {onOpenImageViewer && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenImageViewer(selectedProject.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: '#000080',
                      color: '#ffffff',
                      border: '2px solid',
                      borderColor: '#ffffff #000000 #000000 #ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <span>
                      {isEn
                        ? '🖼️ Open in Standalone Photo Viewer'
                        : '🖼️ Desplegar en Visor de Fotos Independiente'}
                    </span>
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {currentMedia.screenshots.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '1px 1px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setLightboxIdx(idx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setLightboxIdx(idx);
                        }
                      }}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: '#09090b',
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                      title={isEn ? 'Click to preview enlarged screenshot' : 'Clic para ampliar captura aquí'}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                      {item.badge && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#38bdf8',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            border: '1px solid #0284c7'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f8fafc' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
                        {item.caption}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div 
                style={{ 
                  padding: '12px', 
                  background: '#f1f5f9', 
                  borderLeft: `4px solid ${selectedProject.accentColor}`,
                  marginBottom: '16px',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                {selectedProject.summary}
              </div>

              <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PixelSparkles size={14} color="#f59e0b" />
                <span>
                  {isEn ? 'Key Features & Technical Impact:' : 'Características Principales e Impacto Técnico:'}
                </span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {selectedProject.keyFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px' }}>
                    <PixelCheckDouble size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px 0', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '13px', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PixelCode size={14} color="#0284c7" />
                  <span>{isEn ? 'Technologies Used (click to filter):' : 'Tecnologías Empleadas (clic para filtrar):'}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: copiedSummary ? '#15803d' : '#d4d0c8',
                    color: copiedSummary ? '#ffffff' : '#000000',
                    border: '2px solid',
                    borderColor: copiedSummary ? '#86efac #14532d #14532d #86efac' : '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {copiedSummary
                    ? isEn ? '✓ Summary Copied' : '✓ Ficha Copiada'
                    : isEn ? 'Copy Summary' : 'Copiar Resumen'}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedProject.technologies.map((t, i) => {
                  const isFiltering = searchQuery.toLowerCase() === t.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={i}
                      aria-pressed={isFiltering}
                      onClick={() => {
                        sound.playClick();
                        setSearchQuery(isFiltering ? '' : t);
                        if (isMobile) setMobileView('list');
                      }}
                      title={
                        isEn
                          ? `Filter projects using ${t}`
                          : `Filtrar proyectos que usan ${t}`
                      }
                      style={{
                        fontSize: '11.5px',
                        padding: '5px 10px',
                        background: isFiltering ? '#000080' : '#e2e8f0',
                        border: '1px solid',
                        borderColor: isFiltering ? '#000080' : '#cbd5e1',
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        color: isFiltering ? '#ffffff' : '#1e293b',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div>
              <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PixelLayout size={14} color="#0284c7" />
                <span>{isEn ? 'Interactive Pipeline & Topology:' : 'Flujo Interactivo & Topología:'}</span>
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {selectedProject.architecture.split(/→|->/).map((node, idx, arr) => {
                  const clean = node.trim();
                  const isActiveNode = activeArchStep === idx;
                  return (
                    <React.Fragment key={idx}>
                      <button
                        type="button"
                        aria-pressed={isActiveNode}
                        onClick={() => {
                          sound.playClick();
                          setActiveArchStep(idx);
                        }}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          background: isActiveNode ? '#0f172a' : '#e2e8f0',
                          color: isActiveNode ? '#38bdf8' : '#0f172a',
                          border: isActiveNode ? `2px solid ${selectedProject.accentColor}` : '1px solid #94a3b8'
                        }}
                      >
                        {idx + 1}. {clean}
                      </button>
                      {idx < arr.length - 1 && (
                        <span style={{ fontWeight: 'bold', color: '#64748b' }}>→</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div
                aria-live="polite"
                style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '12px 14px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  marginBottom: '16px',
                  border: '2px solid #334155'
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>
                  {isEn ? `Stage ${activeArchStep + 1} active in pipeline:` : `Fase ${activeArchStep + 1} seleccionada en el flujo:`}
                </div>
                {selectedProject.architecture}
              </div>

              <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PixelSliders size={14} color="#475569" />
                <span>{isEn ? 'Tech Stack Breakdown:' : 'Desglose de la Pila Tecnológica:'}</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {selectedProject.technologies.map((tech, i) => (
                  <div 
                    key={i}
                    style={{ 
                      padding: '8px 12px', 
                      background: '#ffffff', 
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      borderRadius: '3px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: selectedProject.accentColor }}>{tech}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      {isEn
                        ? 'Component integrated into production architecture'
                        : 'Componente integrado en arquitectura de producción'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE MOCKUP (EXCLUSIVE TO GLADOS ASSISTANT) */}
          {activeTab === 'mockup' && selectedProject.id === 'glados-assistant' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                {isEn ? 'Autonomous Voice Node' : 'Nodo de Voz Autónomo'} &bull; <b>Aperture Science Synthetic Intelligence</b>:
              </div>

              <div 
                style={{ 
                  width: '100%',
                  maxWidth: '460px', 
                  background: '#09090b', 
                  borderRadius: '10px', 
                  padding: '20px',
                  textAlign: 'center',
                  border: '2px solid #eab308',
                  boxShadow: '0 8px 30px rgba(234, 179, 8, 0.25), inset 0 0 15px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Header status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #3f3f46', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PixelEye size={15} color="#f59e0b" />
                    <span>APERTURE GLaDOS VOICE CORE v2.4</span>
                  </div>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      background: isGladosSpeaking ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.15)', 
                      color: isGladosSpeaking ? '#fbbf24' : '#4ade80', 
                      padding: '2px 7px', 
                      borderRadius: '4px',
                      border: `1px solid ${isGladosSpeaking ? '#f59e0b' : '#22c55e'}`,
                      letterSpacing: '0.5px',
                      fontWeight: 'bold'
                    }}
                  >
                    {isGladosSpeaking
                      ? isEn
                        ? '● TRANSMITTING AUDIO'
                        : '● TRANSMITIENDO AUDIO'
                      : isEn
                      ? '● ONLINE'
                      : '● EN LÍNEA'}
                  </span>
                </div>

                {/* GLaDOS Glowing Optic Eye */}
                <div style={{ margin: '14px 0 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div 
                    className={`glados-eye-pupil ${isGladosSpeaking ? 'speaking' : ''}`} 
                    style={{ 
                      width: '54px', 
                      height: '54px',
                      transition: 'all 0.2s ease-in-out'
                    }} 
                  />
                  
                  {/* Neural Audio Equalizer Waveform */}
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px', marginTop: '14px' }}>
                    {[12, 20, 16, 24, 14, 22, 10, 18, 24, 15].map((height, i) => (
                      <div 
                        key={i}
                        style={{
                          width: '4px',
                          height: isGladosSpeaking ? `${height}px` : '4px',
                          background: isGladosSpeaking ? '#eab308' : '#52525b',
                          borderRadius: '2px',
                          transition: 'height 0.12s ease-in-out',
                          boxShadow: isGladosSpeaking ? '0 0 6px #eab308' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtitle / Quote box */}
                <div 
                  style={{ 
                    minHeight: '60px', 
                    fontSize: '13px', 
                    margin: '12px 0 18px 0', 
                    fontFamily: 'monospace',
                    color: '#fef08a',
                    lineHeight: '1.5',
                    background: 'rgba(24, 24, 27, 0.8)',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #3f3f46',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ color: '#eab308', fontWeight: 'bold' }}>&gt; GLaDOS: </span>
                  &ldquo;{isEn ? GLADOS_VOICE_QUOTES[gladosIndex].textEn : GLADOS_VOICE_QUOTES[gladosIndex].text}&rdquo;
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => playGladosQuote(gladosIndex)}
                    style={{
                      padding: '8px 16px',
                      background: isGladosSpeaking ? '#a16207' : '#eab308',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <span>
                      {isGladosSpeaking
                        ? isEn
                          ? '🔊 Playing voice...'
                          : '🔊 Reproduciendo voz...'
                        : isEn
                        ? '▶ Play Current Quote'
                        : '▶ Reproducir Frase Actual'}
                    </span>
                  </button>

                  <button
                    onClick={handleNextGladosQuote}
                    style={{
                      padding: '8px 16px',
                      background: '#27272a',
                      color: '#fef08a',
                      border: '1px solid #71717a',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>
                      {isEn
                        ? `Next Quote [Neural Voice] (${gladosIndex + 1}/${GLADOS_VOICE_QUOTES.length})`
                        : `Siguiente Frase [Voz Neuronal] (${gladosIndex + 1}/${GLADOS_VOICE_QUOTES.length})`}
                    </span>
                  </button>
                </div>

                {/* Technical Footnote */}
                <div style={{ marginTop: '14px', fontSize: '10px', color: '#71717a', borderTop: '1px dashed #27272a', paddingTop: '8px' }}>
                  {isEn
                    ? 'Direct local neural synthesis: Trained Piper ONNX Model (es_ES-glados-medium)'
                    : 'Síntesis neural local directa: Modelo Piper ONNX entrenado (es_ES-glados-medium)'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS */}
          {activeTab === 'specs' && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold', width: '140px' }}>
                      {isEn ? 'Repository:' : 'Repositorio:'}
                    </td>
                    <td style={{ padding: '6px', fontFamily: 'monospace' }}>{selectedProject.repoName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold' }}>
                      {isEn ? 'Category:' : 'Categoría:'}
                    </td>
                    <td style={{ padding: '6px' }}>{getCategoryLabel(selectedProject.category, lang)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold' }}>
                      {isEn ? 'Company / Client:' : 'Empresa / Cliente:'}
                    </td>
                    <td style={{ padding: '6px' }}>{selectedProject.company}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold' }}>
                      {isEn ? 'Development Year:' : 'Año de Desarrollo:'}
                    </td>
                    <td style={{ padding: '6px' }}>{selectedProject.period}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold' }}>
                      {isEn ? 'Deployment / Runtime:' : 'Despliegue / Runtime:'}
                    </td>
                    <td style={{ padding: '6px' }}>
                      {isEn ? 'Containerized Linux (Podman / Docker)' : 'Linux Contenerizado (Podman / Docker)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}
      </div>

      {/* Inline Accessible Screenshot Lightbox Modal */}
      {lightboxIdx !== null && hasScreenshots && currentMedia?.screenshots[lightboxIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentMedia.screenshots[lightboxIdx].title}
          tabIndex={-1}
          onClick={() => setLightboxIdx(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setLightboxIdx(null);
            } else if (e.key === 'ArrowRight') {
              setLightboxIdx((prev) => (prev !== null ? (prev + 1) % currentMedia.screenshots.length : 0));
            } else if (e.key === 'ArrowLeft') {
              setLightboxIdx((prev) =>
                prev !== null
                  ? (prev - 1 + currentMedia.screenshots.length) % currentMedia.screenshots.length
                  : 0
              );
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '10px' : '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#c0c0c0',
              border: '2px solid',
              borderColor: '#ffffff #000000 #000000 #ffffff',
              maxWidth: '880px',
              width: '100%',
              maxHeight: '90dvh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 35px rgba(0,0,0,0.65)'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #000080, #1084d0)',
                color: '#ffffff',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentMedia.screenshots[lightboxIdx].title} ({lightboxIdx + 1}/{currentMedia.screenshots.length})
              </span>
              <button
                type="button"
                aria-label={isEn ? 'Close preview' : 'Cerrar vista previa'}
                onClick={() => setLightboxIdx(null)}
                style={{
                  background: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#ffffff #000000 #000000 #ffffff',
                  padding: '2px 7px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                background: '#09090b',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '62dvh',
                overflow: 'hidden'
              }}
            >
              <img
                src={currentMedia.screenshots[lightboxIdx].src}
                alt={currentMedia.screenshots[lightboxIdx].title}
                style={{ maxWidth: '100%', maxHeight: '58dvh', objectFit: 'contain' }}
              />
            </div>

            <div
              style={{
                padding: '10px 12px',
                background: '#f8fafc',
                borderTop: '1px solid #808080',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                {currentMedia.screenshots[lightboxIdx].caption}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((prev) =>
                      prev !== null
                        ? (prev - 1 + currentMedia.screenshots.length) % currentMedia.screenshots.length
                        : 0
                    )
                  }
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: '#d4d0c8',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer'
                  }}
                >
                  ← {isEn ? 'Prev' : 'Ant.'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((prev) => (prev !== null ? (prev + 1) % currentMedia.screenshots.length : 0))
                  }
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: '#d4d0c8',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {isEn ? 'Next' : 'Sig.'} →
                </button>
                {onOpenImageViewer && (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIdx(null);
                      onOpenImageViewer(selectedProject.id);
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: '#000080',
                      color: '#ffffff',
                      border: '2px solid',
                      borderColor: '#ffffff #000000 #000000 #ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    {isEn ? 'Full Viewer' : 'Visor Completo'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

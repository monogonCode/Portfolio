import React, { useState, useEffect, useMemo } from 'react';
import { getProjects } from '../../data/projects';
import {
  getProjectMedia,
  LOGO_CHUMBOS,
  LOGO_CONTROID,
  LOGO_LIDIA,
  LOGO_XANA,
  LOGO_GARBISOFT,
  LOGO_FICHAJE_AGRO,
  LOGO_CHUMBOS_BOT
} from '../../data/projectMedia';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PixelFolder,
  PixelFileText,
  PixelGlobe,
  PixelArrowLeft,
  PixelArrowRight,
  PixelMonitor,
  PixelLayout,
  PixelExternalLink,
  PixelCode,
  PixelSmartphone,
  PixelGithub
} from '../ui/RetroIcons';

interface ChumbosFolderAppProps {
  onOpenProject: (projectId: string) => void;
  onOpenBrowser: (url: string) => void;
}

type FolderId = 'my-pc' | 'c-drive' | 'empresas' | 'chumbos' | 'proyectos' | 'enlaces-web';
type ViewMode = 'icons' | 'list' | 'details';
type SortField = 'name' | 'size' | 'type' | 'modified';

interface ExplorerEntry {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  size: string;
  sizeBytes: number;
  modified: string;
  kind: 'drive' | 'folder' | 'project' | 'url';
  folderTarget?: FolderId;
  projectId?: string;
  url?: string;
  iconSrc?: string;
  badge?: string;
}

const PARENT_MAP: Record<FolderId, FolderId | null> = {
  'my-pc': null,
  'c-drive': 'my-pc',
  empresas: 'c-drive',
  chumbos: 'empresas',
  proyectos: 'c-drive',
  'enlaces-web': 'c-drive'
};

const FOLDER_PATHS: Record<FolderId, { es: string; en: string; labelEs: string; labelEn: string }> = {
  'my-pc': { es: 'Mi PC', en: 'My Computer', labelEs: 'Mi PC', labelEn: 'My Computer' },
  'c-drive': { es: 'C:\\', en: 'C:\\', labelEs: 'Disco local (C:)', labelEn: 'Local Disk (C:)' },
  empresas: { es: 'C:\\Empresas', en: 'C:\\Companies', labelEs: 'Empresas', labelEn: 'Companies' },
  chumbos: { es: 'C:\\Empresas\\HNOS Chumbos', en: 'C:\\Companies\\HNOS Chumbos', labelEs: 'HNOS Chumbos', labelEn: 'HNOS Chumbos' },
  proyectos: { es: 'C:\\Proyectos', en: 'C:\\Projects', labelEs: 'Proyectos', labelEn: 'Projects' },
  'enlaces-web': { es: 'C:\\Enlaces Web', en: 'C:\\Web Links', labelEs: 'Enlaces Web', labelEn: 'Web Links' }
};

export const ChumbosFolderApp: React.FC<ChumbosFolderAppProps> = ({
  onOpenProject,
  onOpenBrowser
}) => {
  const { lang, isEn } = useLanguage();
  const [history, setHistory] = useState<FolderId[]>(['chumbos']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const currentFolder = history[historyIdx];

  const [selectedId, setSelectedId] = useState<string | null>('chumbos-fichaje');
  const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const [showFoldersPane, setShowFoldersPane] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [showWebView, setShowWebView] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    desktop: true,
    'my-pc': true,
    'c-drive': true,
    empresas: true
  });
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const projects = useMemo(() => getProjects(lang), [lang]);
  const mediaMap = useMemo(() => getProjectMedia(lang), [lang]);

  const navigateTo = (folder: FolderId) => {
    sound.playClick();
    if (folder === currentFolder) {
      if (isMobile) setShowFoldersPane(false);
      return;
    }
    const nextHistory = [...history.slice(0, historyIdx + 1), folder];
    setHistory(nextHistory);
    setHistoryIdx(nextHistory.length - 1);
    setSelectedId(null);
    setOpenMenu(null);
    if (isMobile) setShowFoldersPane(false);
  };

  const canGoBack = historyIdx > 0;
  const canGoForward = historyIdx < history.length - 1;
  const parentFolder = PARENT_MAP[currentFolder];

  const handleBack = () => {
    if (!canGoBack) return;
    sound.playClick();
    setHistoryIdx((idx) => idx - 1);
    setSelectedId(null);
  };

  const handleForward = () => {
    if (!canGoForward) return;
    sound.playClick();
    setHistoryIdx((idx) => idx + 1);
    setSelectedId(null);
  };

  const handleUp = () => {
    if (!parentFolder) return;
    navigateTo(parentFolder);
  };

  const entries: ExplorerEntry[] = useMemo(() => {
    const baseFolders: Record<FolderId, ExplorerEntry[]> = {
      'my-pc': [
        {
          id: 'drive-c',
          name: isEn ? 'Local Disk (C:)' : 'Disco local (C:)',
          subtitle: isEn ? 'System & Portfolio Filesystem' : 'Sistema de archivos del Portfolio',
          type: isEn ? 'Local Disk' : 'Disco local',
          size: '4.2 GB',
          sizeBytes: 4200000,
          modified: '14/11/2026',
          kind: 'drive',
          folderTarget: 'c-drive'
        },
        {
          id: 'shortcut-chumbos',
          name: 'HNOS Chumbos',
          subtitle: isEn ? 'Enterprise Software Ecosystem' : 'Ecosistema Empresarial Chumbos',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '22.1 MB',
          sizeBytes: 22100,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'chumbos',
          iconSrc: LOGO_CHUMBOS
        },
        {
          id: 'shortcut-proyectos',
          name: isEn ? 'Projects' : 'Proyectos',
          subtitle: isEn ? 'Full Portfolio Engineering Archive' : 'Archivo Completo de Ingeniería',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '64.8 MB',
          sizeBytes: 64800,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'proyectos'
        },
        {
          id: 'shortcut-enlaces',
          name: isEn ? 'Web Links' : 'Enlaces Web',
          subtitle: isEn ? 'Live Production URLs' : 'Páginas Web en Producción',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '14 KB',
          sizeBytes: 14,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'enlaces-web'
        }
      ],
      'c-drive': [
        {
          id: 'dir-empresas',
          name: isEn ? 'Companies' : 'Empresas',
          subtitle: isEn ? 'Production Enterprise Deployments' : 'Despliegues Empresariales en Producción',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '22.1 MB',
          sizeBytes: 22100,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'empresas'
        },
        {
          id: 'dir-proyectos',
          name: isEn ? 'Projects' : 'Proyectos',
          subtitle: isEn ? `${projects.length} Software Systems` : `${projects.length} Sistemas de Software`,
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '64.8 MB',
          sizeBytes: 64800,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'proyectos'
        },
        {
          id: 'dir-enlaces',
          name: isEn ? 'Web Links' : 'Enlaces Web',
          subtitle: isEn ? 'Direct Browser Bookmarks' : 'Accesos Directos a Webs',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '14 KB',
          sizeBytes: 14,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'enlaces-web'
        }
      ],
      empresas: [
        {
          id: 'dir-hnos-chumbos',
          name: 'HNOS Chumbos',
          subtitle: isEn ? 'Portal, Android APK & WhatsApp Bot' : 'Web Corporativa, App Android & Bot WhatsApp',
          type: isEn ? 'File Folder' : 'Carpeta de archivos',
          size: '22.1 MB',
          sizeBytes: 22100,
          modified: '14/11/2026',
          kind: 'folder',
          folderTarget: 'chumbos',
          iconSrc: LOGO_CHUMBOS
        }
      ],
      chumbos: [
        {
          id: 'chumbos-portal',
          name: 'ChumbosPortal.app',
          subtitle: isEn ? 'Corporate Website & Ethics Channel' : 'Página Web Corporativa & Canal Ético',
          badge: isEn ? 'Astro + Prisma Web' : 'Web Astro + Prisma',
          type: isEn ? 'Web Application' : 'Aplicación Web',
          size: '2.4 MB',
          sizeBytes: 2400,
          modified: '12/11/2026',
          kind: 'project',
          projectId: 'chumbos-portal',
          url: 'https://explotacioneschumbos.es',
          iconSrc: LOGO_CHUMBOS
        },
        {
          id: 'chumbos-fichaje',
          name: 'FichajeAgro.apk',
          subtitle: isEn ? 'Time Tracking, GPS & ERP Sync' : 'Control Horario, GPS y Sincronización ERP',
          badge: 'Android Kotlin',
          type: isEn ? 'Android Package' : 'Aplicación Android',
          size: '18.6 MB',
          sizeBytes: 18600,
          modified: '10/11/2026',
          kind: 'project',
          projectId: 'chumbos-fichaje',
          iconSrc: LOGO_FICHAJE_AGRO
        },
        {
          id: 'chumbos-chatbot',
          name: 'ChumbosBot.js',
          subtitle: isEn ? 'Autonomous WhatsApp Bot for Farms & Tasks' : 'Asistente Autónomo WhatsApp de Fincas y Tareas',
          badge: 'Node.js Bot',
          type: isEn ? 'Service Script' : 'Servicio Node.js',
          size: '1.1 MB',
          sizeBytes: 1100,
          modified: '08/11/2026',
          kind: 'project',
          projectId: 'chumbos-chatbot',
          iconSrc: LOGO_CHUMBOS_BOT
        }
      ],
      proyectos: projects.map((proj, idx) => ({
        id: proj.id,
        name: `${proj.title}.exe`,
        subtitle: proj.subtitle,
        badge: proj.category.toUpperCase(),
        type: isEn ? `${proj.category} Project` : `Proyecto ${proj.category}`,
        size: `${(2.4 + idx * 1.3).toFixed(1)} MB`,
        sizeBytes: Math.round((2.4 + idx * 1.3) * 1000),
        modified: `${proj.year}`,
        kind: 'project' as const,
        projectId: proj.id,
        url: proj.liveUrl,
        iconSrc: mediaMap[proj.id]?.logo
      })),
      'enlaces-web': [
        {
          id: 'link-mc',
          name: 'Minecraft.url',
          subtitle: 'mc.monogoncode.dev',
          badge: 'LIVE WEB',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://mc.monogoncode.dev',
          iconSrc: '/images/icons/mc.svg'
        },
        {
          id: 'link-lidia',
          name: 'LidiaHelem.url',
          subtitle: 'pastelerialidiahelem.com',
          badge: 'E-COMMERCE',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://pastelerialidiahelem.com',
          iconSrc: LOGO_LIDIA
        },
        {
          id: 'link-chumbos',
          name: 'ExplotacionesChumbos.url',
          subtitle: 'explotacioneschumbos.es',
          badge: 'CORPORATE',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://explotacioneschumbos.es',
          iconSrc: LOGO_CHUMBOS
        },
        {
          id: 'link-xana',
          name: 'XanaTakeControl.url',
          subtitle: 'xana.monogoncode.dev',
          badge: 'WEB APP',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://xana.monogoncode.dev',
          iconSrc: LOGO_XANA
        },
        {
          id: 'link-dt',
          name: 'DeltaTraz.url',
          subtitle: 'dt.monogoncode.dev',
          badge: 'INDUSTRIAL',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://dt.monogoncode.dev',
          iconSrc: LOGO_GARBISOFT
        },
        {
          id: 'link-controid',
          name: 'Controid.url',
          subtitle: 'controid.monogoncode.dev',
          badge: 'APP WEB',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://controid.monogoncode.dev',
          iconSrc: LOGO_CONTROID
        },
        {
          id: 'link-github',
          name: 'GitHub.url',
          subtitle: 'github.com/monogonCode',
          badge: 'REPOS',
          type: isEn ? 'Internet Shortcut' : 'Acceso directo Web',
          size: '2 KB',
          sizeBytes: 2,
          modified: '14/11/2026',
          kind: 'url',
          url: 'https://github.com/monogonCode',
          iconSrc: '/images/icons/github.svg'
        }
      ]
    };

    const rawList = [...(baseFolders[currentFolder] || [])];
    if (viewMode === 'details') {
      rawList.sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'size') cmp = a.sizeBytes - b.sizeBytes;
        else if (sortField === 'type') cmp = a.type.localeCompare(b.type);
        else cmp = a.modified.localeCompare(b.modified);
        return sortAsc ? cmp : -cmp;
      });
    }
    return rawList;
  }, [currentFolder, isEn, projects, mediaMap, viewMode, sortField, sortAsc]);

  const selectedItem = entries.find((item) => item.id === selectedId) || null;

  const openEntry = (entry: ExplorerEntry) => {
    sound.playWindowOpen();
    if ((entry.kind === 'folder' || entry.kind === 'drive') && entry.folderTarget) {
      navigateTo(entry.folderTarget);
      return;
    }
    if (entry.kind === 'url' && entry.url) {
      onOpenBrowser(entry.url);
      return;
    }
    if (entry.projectId) {
      onOpenProject(entry.projectId);
    }
  };

  const renderEntryIcon = (entry: ExplorerEntry, sizePx: number) => {
    if (entry.kind === 'drive') {
      return <PixelMonitor size={sizePx} color="#000080" />;
    }
    if (entry.kind === 'folder') {
      return (
        <div style={{ position: 'relative', width: sizePx, height: sizePx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/images/icons/xp/folder.webp"
            alt=""
            style={{ width: sizePx, height: sizePx, objectFit: 'contain' }}
            draggable={false}
          />
          {entry.iconSrc && (
            <img
              src={entry.iconSrc}
              alt=""
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: Math.round(sizePx * 0.45),
                height: Math.round(sizePx * 0.45),
                objectFit: 'contain',
                background: '#ffffff',
                border: '1px solid #808080',
                borderRadius: '2px',
                padding: '1px'
              }}
              draggable={false}
            />
          )}
        </div>
      );
    }
    if (entry.iconSrc) {
      return (
        <img
          src={entry.iconSrc}
          alt={entry.name}
          style={{
            width: sizePx,
            height: sizePx,
            objectFit: 'contain',
            filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.22))'
          }}
          draggable={false}
        />
      );
    }
    if (entry.kind === 'url') {
      return <PixelGlobe size={sizePx} color="#0369a1" />;
    }
    if (entry.badge?.includes('MOBILE')) {
      return <PixelSmartphone size={sizePx} color="#0f766e" />;
    }
    if (entry.id.includes('github')) {
      return <PixelGithub size={sizePx} color="#111827" />;
    }
    return <PixelCode size={sizePx} color="#000080" />;
  };

  const toggleNode = (key: string) => {
    sound.playClick();
    setExpandedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSort = (field: SortField) => {
    sound.playClick();
    if (sortField === field) setSortAsc((p) => !p);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const pathInfo = FOLDER_PATHS[currentFolder];
  const currentPathText = isEn ? pathInfo.en : pathInfo.es;
  const currentTitleText = isEn ? pathInfo.labelEn : pathInfo.labelEs;

  return (
    <div
      onClick={() => setOpenMenu(null)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#c0c0c0',
        color: '#000000',
        fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* 1. Windows 98 Menu Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px 4px',
          background: '#c0c0c0',
          borderBottom: '1px solid #808080',
          position: 'relative',
          zIndex: 25,
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'file', label: isEn ? 'File' : 'Archivo' },
          { id: 'view', label: isEn ? 'View' : 'Ver' },
          { id: 'go', label: isEn ? 'Go' : 'Ir a' },
          { id: 'help', label: isEn ? 'Help' : 'Ayuda' }
        ].map((menu) => (
          <div key={menu.id} style={{ position: 'relative' }}>
            <button
              className={`win98-menu-btn ${openMenu === menu.id ? 'open' : ''}`}
              aria-expanded={openMenu === menu.id}
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setOpenMenu((prev) => (prev === menu.id ? null : menu.id));
              }}
            >
              <u>{menu.label[0]}</u>{menu.label.slice(1)}
            </button>

            {openMenu === menu.id && (
              <div
                className="win98-bevel-outset"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: '185px',
                  background: '#c0c0c0',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.35)',
                  padding: '2px',
                  zIndex: 50
                }}
              >
                {menu.id === 'file' && (
                  <>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px' }}
                      disabled={!selectedItem}
                      onClick={() => {
                        if (selectedItem) openEntry(selectedItem);
                        setOpenMenu(null);
                      }}
                    >
                      {isEn ? 'Open Selected' : 'Abrir seleccionado'}
                    </button>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px' }}
                      onClick={() => {
                        navigateTo('chumbos');
                      }}
                    >
                      {isEn ? 'Reset to HNOS Chumbos' : 'Volver a HNOS Chumbos'}
                    </button>
                  </>
                )}

                {menu.id === 'view' && (
                  <>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', justifyContent: 'space-between' }}
                      onClick={() => { setViewMode('icons'); setOpenMenu(null); }}
                    >
                      <span>{isEn ? 'Large Icons' : 'Iconos grandes'}</span>
                      <span>{viewMode === 'icons' ? '✓' : ''}</span>
                    </button>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', justifyContent: 'space-between' }}
                      onClick={() => { setViewMode('list'); setOpenMenu(null); }}
                    >
                      <span>{isEn ? 'List' : 'Lista'}</span>
                      <span>{viewMode === 'list' ? '✓' : ''}</span>
                    </button>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', justifyContent: 'space-between' }}
                      onClick={() => { setViewMode('details'); setOpenMenu(null); }}
                    >
                      <span>{isEn ? 'Details' : 'Detalles'}</span>
                      <span>{viewMode === 'details' ? '✓' : ''}</span>
                    </button>
                    <div className="start-menu-divider" />
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', justifyContent: 'space-between' }}
                      onClick={() => { setShowFoldersPane((p) => !p); setOpenMenu(null); }}
                    >
                      <span>{isEn ? 'Explorer Bar: Folders' : 'Barra: Todas las carpetas'}</span>
                      <span>{showFoldersPane ? '✓' : ''}</span>
                    </button>
                    <button
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', justifyContent: 'space-between' }}
                      onClick={() => { setShowWebView((p) => !p); setOpenMenu(null); }}
                    >
                      <span>{isEn ? 'as Web Page' : 'Como página Web'}</span>
                      <span>{showWebView ? '✓' : ''}</span>
                    </button>
                  </>
                )}

                {menu.id === 'go' &&
                  (['my-pc', 'c-drive', 'chumbos', 'proyectos', 'enlaces-web'] as FolderId[]).map((fid) => (
                    <button
                      key={fid}
                      className="start-menu-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '12px', padding: '6px 10px', fontWeight: currentFolder === fid ? 'bold' : 'normal' }}
                      onClick={() => navigateTo(fid)}
                    >
                      {isEn ? FOLDER_PATHS[fid].en : FOLDER_PATHS[fid].es}
                    </button>
                  ))}

                {menu.id === 'help' && (
                  <div style={{ padding: '8px 10px', fontSize: '11px', lineHeight: 1.4, color: '#000000' }}>
                    <strong>Windows 98 Explorer</strong>
                    <br />
                    {isEn
                      ? 'Select any item and press Enter or Open. Double-click folders to browse.'
                      : 'Selecciona un elemento y pulsa Abrir o Enter. Doble clic en carpetas para navegar.'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 2. Windows 98 Standard Buttons Toolbar */}
      <div
        style={{
          background: '#c0c0c0',
          borderTop: '1px solid #ffffff',
          borderBottom: '1px solid #808080',
          padding: '3px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          overflowX: 'auto'
        }}
      >
        <button
          className="win98-toolbar-btn"
          disabled={!canGoBack}
          onClick={handleBack}
          title={isEn ? 'Back' : 'Atrás'}
          aria-label={isEn ? 'Back' : 'Atrás'}
        >
          <PixelArrowLeft size={16} color={canGoBack ? '#000080' : '#808080'} />
          <span>{isEn ? 'Back' : 'Atrás'}</span>
        </button>

        <button
          className="win98-toolbar-btn"
          disabled={!canGoForward}
          onClick={handleForward}
          title={isEn ? 'Forward' : 'Adelante'}
          aria-label={isEn ? 'Forward' : 'Adelante'}
        >
          <PixelArrowRight size={16} color={canGoForward ? '#000080' : '#808080'} />
          <span>{isEn ? 'Forward' : 'Adelante'}</span>
        </button>

        <button
          className="win98-toolbar-btn"
          disabled={!parentFolder}
          onClick={handleUp}
          title={isEn ? 'Up One Level' : 'Subir un nivel'}
          aria-label={isEn ? 'Up One Level' : 'Subir un nivel'}
        >
          <PixelFolder size={16} color={parentFolder ? '#ca8a04' : '#808080'} />
          <span>{isEn ? 'Up' : 'Arriba'}</span>
        </button>

        <div style={{ width: '2px', height: '30px', borderLeft: '1px solid #808080', borderRight: '1px solid #ffffff', margin: '0 3px' }} />

        <button
          className={`win98-toolbar-btn ${showFoldersPane ? 'active' : ''}`}
          aria-pressed={showFoldersPane}
          onClick={() => {
            sound.playClick();
            setShowFoldersPane((prev) => !prev);
          }}
          title={isEn ? 'Toggle Folders Tree' : 'Mostrar / Ocultar Árbol de Carpetas'}
        >
          <PixelFolder size={16} color="#000080" />
          <span>{isEn ? 'Folders' : 'Carpetas'}</span>
        </button>

        <button
          className="win98-toolbar-btn"
          onClick={() => {
            sound.playClick();
            setViewMode((prev) => (prev === 'icons' ? 'list' : prev === 'list' ? 'details' : 'icons'));
          }}
          title={isEn ? 'Switch View Mode' : 'Cambiar Vista (Iconos / Lista / Detalles)'}
        >
          <PixelLayout size={16} color="#000080" />
          <span>{viewMode === 'icons' ? (isEn ? 'Icons' : 'Iconos') : viewMode === 'list' ? (isEn ? 'List' : 'Lista') : isEn ? 'Details' : 'Detalles'}</span>
        </button>

        {selectedItem && (
          <button
            className="win98-toolbar-btn"
            onClick={() => openEntry(selectedItem)}
            style={{ background: '#dbeafe', border: '1px solid #000080' }}
            title={isEn ? 'Open selected item' : 'Abrir elemento seleccionado'}
          >
            <PixelExternalLink size={16} color="#000080" />
            <span style={{ fontWeight: 'bold', color: '#000080' }}>{isEn ? 'Open' : 'Abrir'}</span>
          </button>
        )}
      </div>

      {/* 3. Windows 98 Address Bar */}
      <div
        style={{
          background: '#c0c0c0',
          borderTop: '1px solid #ffffff',
          borderBottom: '1px solid #808080',
          padding: '3px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ fontSize: '11px', color: '#444444', whiteSpace: 'nowrap' }}>
          {isEn ? 'Address' : 'Dirección'}
        </span>
        <div
          className="win98-bevel-inset"
          style={{
            flex: 1,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 6px',
            minWidth: 0
          }}
        >
          <PixelFolder size={15} color="#eab308" />
          <select
            aria-label={isEn ? 'Folder address' : 'Dirección de carpeta'}
            value={currentFolder}
            onChange={(e) => navigateTo(e.target.value as FolderId)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
              color: '#000000',
              outline: 'none',
              cursor: 'pointer',
              minWidth: 0
            }}
          >
            {(['my-pc', 'c-drive', 'empresas', 'chumbos', 'proyectos', 'enlaces-web'] as FolderId[]).map((fid) => (
              <option key={fid} value={fid}>
                {isEn ? FOLDER_PATHS[fid].en : FOLDER_PATHS[fid].es}
              </option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '11px', color: '#666666', display: isMobile ? 'none' : 'inline' }}>
          {currentPathText}
        </span>
      </div>

      {/* 4. Split Pane Workspace */}
      <div
        className="win98-explorer-split"
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          background: '#ffffff',
          borderTop: '1px solid #808080'
        }}
      >
        {/* Left Folder Tree Pane */}
        {showFoldersPane && (
          <div
            className={`win98-explorer-tree-pane ${isMobile ? 'mobile-open' : ''}`}
            style={{
              width: '215px',
              minWidth: '180px',
              background: '#ffffff',
              borderRight: '3px solid #c0c0c0',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                background: '#c0c0c0',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                borderBottom: '1px solid #808080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{isEn ? 'All Folders' : 'Todas las carpetas'}</span>
              <button
                aria-label={isEn ? 'Close folder tree' : 'Cerrar panel de carpetas'}
                onClick={() => setShowFoldersPane(false)}
                style={{
                  border: '1px solid #808080',
                  background: '#d4d0c8',
                  fontSize: '10px',
                  lineHeight: 1,
                  padding: '2px 5px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div role="tree" style={{ padding: '6px 4px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* Desktop root */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 4px', color: '#333' }}>
                <button
                  onClick={() => toggleNode('desktop')}
                  style={{ width: '14px', height: '14px', fontSize: '10px', lineHeight: '10px', padding: 0, border: '1px solid #808080', background: '#fff', cursor: 'pointer' }}
                >
                  {expandedNodes.desktop ? '-' : '+'}
                </button>
                <PixelMonitor size={14} color="#000080" />
                <span>{isEn ? 'Desktop' : 'Escritorio'}</span>
              </div>

              {expandedNodes.desktop && (
                <div style={{ paddingLeft: '14px', borderLeft: '1px dotted #808080', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {/* Mi PC */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => toggleNode('my-pc')}
                      style={{ width: '14px', height: '14px', fontSize: '10px', lineHeight: '10px', padding: 0, border: '1px solid #808080', background: '#fff', cursor: 'pointer' }}
                    >
                      {expandedNodes['my-pc'] ? '-' : '+'}
                    </button>
                    <button
                      role="treeitem"
                      aria-selected={currentFolder === 'my-pc'}
                      onClick={() => navigateTo('my-pc')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 5px',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: currentFolder === 'my-pc' ? '#000080' : 'transparent',
                        color: currentFolder === 'my-pc' ? '#ffffff' : '#000000'
                      }}
                    >
                      <PixelMonitor size={14} color={currentFolder === 'my-pc' ? '#ffffff' : '#000080'} />
                      <span>{isEn ? 'My Computer' : 'Mi PC'}</span>
                    </button>
                  </div>

                  {expandedNodes['my-pc'] && (
                    <div style={{ paddingLeft: '14px', borderLeft: '1px dotted #808080', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {/* C:\ */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => toggleNode('c-drive')}
                          style={{ width: '14px', height: '14px', fontSize: '10px', lineHeight: '10px', padding: 0, border: '1px solid #808080', background: '#fff', cursor: 'pointer' }}
                        >
                          {expandedNodes['c-drive'] ? '-' : '+'}
                        </button>
                        <button
                          role="treeitem"
                          aria-selected={currentFolder === 'c-drive'}
                          onClick={() => navigateTo('c-drive')}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 5px',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: '12px',
                            cursor: 'pointer',
                            background: currentFolder === 'c-drive' ? '#000080' : 'transparent',
                            color: currentFolder === 'c-drive' ? '#ffffff' : '#000000'
                          }}
                        >
                          <PixelFolder size={14} color={currentFolder === 'c-drive' ? '#fde047' : '#ca8a04'} />
                          <span>(C:)</span>
                        </button>
                      </div>

                      {expandedNodes['c-drive'] && (
                        <div style={{ paddingLeft: '14px', borderLeft: '1px dotted #808080', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {/* Empresas */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={() => toggleNode('empresas')}
                              style={{ width: '14px', height: '14px', fontSize: '10px', lineHeight: '10px', padding: 0, border: '1px solid #808080', background: '#fff', cursor: 'pointer' }}
                            >
                              {expandedNodes.empresas ? '-' : '+'}
                            </button>
                            <button
                              role="treeitem"
                              aria-selected={currentFolder === 'empresas'}
                              onClick={() => navigateTo('empresas')}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 5px',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '12px',
                                cursor: 'pointer',
                                background: currentFolder === 'empresas' ? '#000080' : 'transparent',
                                color: currentFolder === 'empresas' ? '#ffffff' : '#000000'
                              }}
                            >
                              <PixelFolder size={14} color={currentFolder === 'empresas' ? '#fde047' : '#ca8a04'} />
                              <span>{isEn ? 'Companies' : 'Empresas'}</span>
                            </button>
                          </div>

                          {expandedNodes.empresas && (
                            <div style={{ paddingLeft: '18px', borderLeft: '1px dotted #808080', marginLeft: '10px' }}>
                              <button
                                role="treeitem"
                                aria-selected={currentFolder === 'chumbos'}
                                onClick={() => navigateTo('chumbos')}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 5px',
                                  border: 'none',
                                  textAlign: 'left',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  background: currentFolder === 'chumbos' ? '#000080' : 'transparent',
                                  color: currentFolder === 'chumbos' ? '#ffffff' : '#000000'
                                }}
                              >
                                <PixelFolder size={14} color={currentFolder === 'chumbos' ? '#fde047' : '#eab308'} />
                                <span>HNOS Chumbos</span>
                              </button>
                            </div>
                          )}

                          {/* Proyectos */}
                          <button
                            role="treeitem"
                            aria-selected={currentFolder === 'proyectos'}
                            onClick={() => navigateTo('proyectos')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 5px 3px 20px',
                              border: 'none',
                              textAlign: 'left',
                              fontSize: '12px',
                              cursor: 'pointer',
                              background: currentFolder === 'proyectos' ? '#000080' : 'transparent',
                              color: currentFolder === 'proyectos' ? '#ffffff' : '#000000'
                            }}
                          >
                            <PixelFolder size={14} color={currentFolder === 'proyectos' ? '#fde047' : '#ca8a04'} />
                            <span>{isEn ? 'Projects' : 'Proyectos'}</span>
                          </button>

                          {/* Enlaces Web */}
                          <button
                            role="treeitem"
                            aria-selected={currentFolder === 'enlaces-web'}
                            onClick={() => navigateTo('enlaces-web')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 5px 3px 20px',
                              border: 'none',
                              textAlign: 'left',
                              fontSize: '12px',
                              cursor: 'pointer',
                              background: currentFolder === 'enlaces-web' ? '#000080' : 'transparent',
                              color: currentFolder === 'enlaces-web' ? '#ffffff' : '#000000'
                            }}
                          >
                            <PixelGlobe size={14} color={currentFolder === 'enlaces-web' ? '#ffffff' : '#0369a1'} />
                            <span>{isEn ? 'Web Links' : 'Enlaces Web'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right File Canvas (Win98 Web View + Items) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            minWidth: 0,
            minHeight: 0,
            background: '#ffffff'
          }}
        >
          {/* Classic Win98 Web View Left Panel */}
          {showWebView && (
            <div
              style={{
                width: isMobile ? '100%' : '205px',
                minWidth: isMobile ? '100%' : '185px',
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRight: isMobile ? 'none' : '1px solid #cbd5e1',
                borderBottom: isMobile ? '1px solid #cbd5e1' : 'none',
                padding: isMobile ? '10px 12px' : '14px 12px',
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: '10px',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-start', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: isMobile ? '44px' : '56px',
                    height: isMobile ? '44px' : '56px',
                    background: '#ffffff',
                    border: '1px solid #94a3b8',
                    borderRadius: '4px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {selectedItem ? (
                    renderEntryIcon(selectedItem, isMobile ? 32 : 42)
                  ) : currentFolder === 'chumbos' || currentFolder === 'empresas' ? (
                    <img src={LOGO_CHUMBOS} alt="HNOS Chumbos" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <PixelFolder size={isMobile ? 30 : 40} color="#ca8a04" />
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', wordBreak: 'break-word' }}>
                    {selectedItem ? selectedItem.name : currentTitleText}
                  </div>
                  <div style={{ height: '3px', width: '48px', background: 'linear-gradient(90deg, #dc2626, #38bdf8)', margin: '4px 0' }} />
                  <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.35 }}>
                    {selectedItem
                      ? selectedItem.subtitle
                      : isEn
                      ? 'Select an item to inspect details, or double-click / tap Open.'
                      : 'Selecciona un elemento para ver detalles o pulsa Abrir.'}
                  </div>
                  {selectedItem && !isMobile && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><strong>{isEn ? 'Type:' : 'Tipo:'}</strong> {selectedItem.type}</div>
                      <div><strong>{isEn ? 'Size:' : 'Tamaño:'}</strong> {selectedItem.size}</div>
                    </div>
                  )}
                </div>
              </div>

              {selectedItem && (
                <button
                  onClick={() => openEntry(selectedItem)}
                  style={{
                    background: '#000080',
                    color: '#ffffff',
                    border: '2px solid',
                    borderColor: '#93c5fd #0f172a #0f172a #93c5fd',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    width: isMobile ? 'auto' : '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <PixelExternalLink size={14} color="#ffffff" />
                  <span>{isEn ? 'Open' : 'Abrir'}</span>
                </button>
              )}
            </div>
          )}

          {/* Items View Area */}
          <div
            onClick={() => setSelectedId(null)}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: viewMode === 'details' ? '0' : '14px'
            }}
          >
            {viewMode === 'icons' && (
              <div
                role="listbox"
                aria-label={currentTitleText}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(112px, 1fr))' : 'repeat(auto-fill, minmax(132px, 1fr))',
                  gap: isMobile ? '10px' : '14px',
                  alignItems: 'start'
                }}
              >
                {entries.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      tabIndex={0}
                      aria-selected={isSelected}
                      className={`win98-explorer-item ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        if (isMobile && isSelected) {
                          openEntry(item);
                        } else {
                          setSelectedId(item.id);
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        openEntry(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          openEntry(item);
                        }
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '10px 6px',
                        borderRadius: '2px',
                        textAlign: 'center',
                        gap: '6px'
                      }}
                    >
                      <div style={{ width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderEntryIcon(item, 48)}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: isSelected ? 'bold' : 500,
                          lineHeight: 1.25,
                          wordBreak: 'break-word',
                          maxWidth: '120px'
                        }}
                      >
                        {item.name}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '9.5px',
                            padding: '1px 5px',
                            background: isSelected ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                            color: isSelected ? '#ffffff' : '#334155',
                            borderRadius: '2px'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'list' && (
              <div
                role="listbox"
                aria-label={currentTitleText}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '4px 12px'
                }}
              >
                {entries.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      tabIndex={0}
                      aria-selected={isSelected}
                      className={`win98-explorer-item ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        if (isMobile && isSelected) openEntry(item);
                        else setSelectedId(item.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        openEntry(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openEntry(item);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 8px'
                      }}
                    >
                      {renderEntryIcon(item, 22)}
                      <span style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'details' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="win98-details-table">
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort('name')}>
                        {isEn ? 'Name' : 'Nombre'} {sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      <th onClick={() => toggleSort('size')}>
                        {isEn ? 'Size' : 'Tamaño'} {sortField === 'size' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      <th onClick={() => toggleSort('type')}>
                        {isEn ? 'Type' : 'Tipo'} {sortField === 'type' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      {!isMobile && (
                        <th onClick={() => toggleSort('modified')}>
                          {isEn ? 'Modified' : 'Modificado'} {sortField === 'modified' ? (sortAsc ? '▲' : '▼') : ''}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((item) => {
                      const isSelected = selectedId === item.id;
                      return (
                        <tr
                          key={item.id}
                          tabIndex={0}
                          className={`win98-explorer-item ${isSelected ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick();
                            if (isMobile && isSelected) openEntry(item);
                            else setSelectedId(item.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            openEntry(item);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openEntry(item);
                            }
                          }}
                        >
                          <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {renderEntryIcon(item, 20)}
                            <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{item.name}</span>
                          </td>
                          <td>{item.size}</td>
                          <td>{item.type}</td>
                          {!isMobile && <td>{item.modified}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Windows 98 Status Bar */}
      <div
        style={{
          background: '#c0c0c0',
          borderTop: '1px solid #ffffff',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <div className="win98-status-panel" style={{ flex: 2 }}>
          {selectedItem
            ? `${selectedItem.name} (${selectedItem.size}) — ${selectedItem.subtitle}`
            : `${entries.length} ${isEn ? 'object(s)' : 'objeto(s)'}`}
        </div>
        {!isMobile && (
          <div className="win98-status-panel" style={{ width: '135px' }}>
            {currentFolder === 'enlaces-web' ? 'Internet' : isEn ? 'My Computer' : 'Mi PC'}
          </div>
        )}
      </div>
    </div>
  );
};

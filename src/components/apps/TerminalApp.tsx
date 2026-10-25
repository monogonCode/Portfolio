import React, { useState, useRef, useEffect } from 'react';
import { getProjects, getCategoryLabel } from '../../data/projects';
import { getProfile } from '../../data/profile';
import { sound } from '../../lib/sound';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { useLanguage } from '../../i18n/LanguageContext';

interface TerminalAppProps {
  onSetTheme?: (theme: string) => void;
  onOpenApp?: (appId: string) => void;
}

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
  isBanner?: boolean;
}

// Las 5 frases sarcásticas originales de GLaDOS de la terminal de Martín
interface TerminalGladosQuote {
  text: string;
  textEn: string;
  audio: string;
}

const TERMINAL_GLADOS_QUOTES: TerminalGladosQuote[] = [
  {
    text: 'Bienvenido a las instalaciones de enriquecimiento asistido por ordenador, en otras palabras, el curriculum de Martín..',
    textEn: "Welcome to the computer-aided enrichment center, in other words, Martín's resume..",
    audio: '/audio/glados/terminal_0.mp3'
  },
  {
    text: 'He revisado tu código. El 80% de los errores son biológicos.',
    textEn: 'I have reviewed your code. 80% of the bugs are biological.',
    audio: '/audio/glados/terminal_1.mp3'
  },
  {
    text: 'El pastel es mentira, pero este portfolio,... También ja, ja, ja.',
    textEn: 'The cake is a lie, and this portfolio,... is too ha, ha, ha.',
    audio: '/audio/glados/terminal_2.mp3'
  },
  {
    text: 'Como parte del protocolo, debo recordarte que no pulsar el botón de contratar no te salvará de mis neurotoxinas.',
    textEn: 'As part of the protocol, I must remind you that not clicking the hire button will not save you from my neurotoxins.',
    audio: '/audio/glados/terminal_3.mp3'
  },
  {
    text: 'Los sensores indican que estás impresionado con este sistema operativo.',
    textEn: 'Sensors indicate that you are impressed with this operating system.',
    audio: '/audio/glados/terminal_4.mp3'
  }
];

const renderWelcomeBanner = (isEn: boolean) => (
  <div>
    <div>
      {isEn
        ? 'MONOGON [Version 4.10.1998 - Linux Kernel 6.12]'
        : 'MONOGON [Versión 4.10.1998 - Kernel Linux 6.12]'}
    </div>
    <div>
      {isEn
        ? '(C) Copyright Martín Alejandro Garbiso Ortíz 2026. All rights reserved.'
        : '(C) Copyright Martín Alejandro Garbiso Ortíz 2026. Todos los derechos reservados.'}
    </div>
    <br />
    <div>
      {isEn ? (
        <>
          Type <span style={{ color: '#ffffff', fontWeight: 'bold' }}>help</span> to list available commands.
        </>
      ) : (
        <>
          Escribe <span style={{ color: '#ffffff', fontWeight: 'bold' }}>help</span> para listar los comandos disponibles.
        </>
      )}
    </div>
  </div>
);

export const TerminalApp: React.FC<TerminalAppProps> = ({ onSetTheme }) => {
  const { lang, isEn } = useLanguage();
  const projects = getProjects(lang);
  const profile = getProfile(lang);

  const [history, setHistory] = useState<CommandHistoryItem[]>(() => [
    {
      command: '',
      output: renderWelcomeBanner(isEn),
      isBanner: true
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>([]);
  const [isAmber, setIsAmber] = useState<boolean>(false);
  const [isMatrix, setIsMatrix] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gladosAudioRef = useRef<HTMLAudioElement | null>(null);

  // Keep welcome banner localized when switching language
  useEffect(() => {
    setHistory((prev) =>
      prev.map((item) =>
        item.isBanner ? { ...item, output: renderWelcomeBanner(isEn) } : item
      )
    );
  }, [isEn]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isMatrix]);

  // Clean up audio and speech synthesis when unmounted
  useEffect(() => {
    return () => {
      if (gladosAudioRef.current) {
        try {
          gladosAudioRef.current.pause();
          gladosAudioRef.current = null;
        } catch {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reproducción de frases originales de GLaDOS mediante la voz pura de Glad0sAsistant
  const playTerminalGladosQuote = (quote: TerminalGladosQuote) => {
    if (!sound.isEnabled()) return;

    if (gladosAudioRef.current) {
      try {
        gladosAudioRef.current.pause();
        gladosAudioRef.current.currentTime = 0;
      } catch {}
    }

    sound.unlockAudio().catch(() => {});

    const audio = new Audio(quote.audio);
    audio.volume = 1.0;
    gladosAudioRef.current = audio;

    audio.play().catch((err) => {
      console.warn('GLaDOS audio playback error:', err);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playKeypress();

    if (e.key === 'Enter') {
      executeCommand(inputVal.trim());
      if (inputVal.trim()) {
        setCommandList((prev) => [...prev, inputVal.trim()]);
        setHistoryIndex(-1);
      }
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length > 0) {
        const nextIdx = historyIndex + 1 < commandList.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(commandList[commandList.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandList[commandList.length - 1 - nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const available = [
        'help',
        'projects',
        'cat cv.txt',
        'skills',
        'glados',
        'neofetch',
        'theme',
        'clear',
        'cls',
        'contact',
        'matrix',
        'color'
      ];
      const match = available.find((cmd) => cmd.startsWith(inputVal.toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const raw = cmd.trim();
    const parts = raw.split(' ');
    const main = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output: string | React.ReactNode = '';

    switch (main) {
      case '':
        output = '';
        break;

      case 'help':
        output = isEn ? (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>AVAILABLE COMMANDS:</div>
            <div>  <span style={{ color: '#ffff00' }}>help</span>                     - Displays this help menu</div>
            <div>  <span style={{ color: '#ffff00' }}>projects</span>                 - Lists created projects</div>
            <div>  <span style={{ color: '#ffff00' }}>cat cv.txt</span>               - Displays resume summary</div>
            <div>  <span style={{ color: '#ffff00' }}>skills</span>                   - Breakdown of technical skills and stack</div>
            <div>  <span style={{ color: '#ffff00' }}>contact</span>                  - Contact information and social links</div>
            <div>  <span style={{ color: '#ffff00' }}>glados</span>                   - GLaDOS speaks one of her famous terminal lines</div>
            <div>  <span style={{ color: '#ffff00' }}>neofetch</span>                 - Displays MONOGON logo and technical info</div>
            <div>  <span style={{ color: '#ffff00' }}>matrix</span>                   - Toggles interactive Matrix digital rain</div>
            <div>  <span style={{ color: '#ffff00' }}>color</span>                    - Toggles between green and amber phosphor</div>
            <div>  <span style={{ color: '#ffff00' }}>theme &lt;opt&gt;</span>               - Changes OS theme (win98, winxp, mac, nes)</div>
            <div>  <span style={{ color: '#ffff00' }}>clear / cls</span>              - Clears the terminal screen</div>
          </div>
        ) : (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>ÓRDENES DISPONIBLES:</div>
            <div>  <span style={{ color: '#ffff00' }}>help</span>                     - Muestra este menú de ayuda</div>
            <div>  <span style={{ color: '#ffff00' }}>projects</span>                 - Lista los proyectos creados</div>
            <div>  <span style={{ color: '#ffff00' }}>cat cv.txt</span>               - Muestra el resumen del currículum</div>
            <div>  <span style={{ color: '#ffff00' }}>skills</span>                   - Desglose de capacidades y stack tecnológico</div>
            <div>  <span style={{ color: '#ffff00' }}>contact</span>                  - Información de contacto y redes</div>
            <div>  <span style={{ color: '#ffff00' }}>glados</span>                   - GLaDOS habla con una de sus frases célebres de la terminal</div>
            <div>  <span style={{ color: '#ffff00' }}>neofetch</span>                 - Muestra el logotipo de MONOGON e info técnica</div>
            <div>  <span style={{ color: '#ffff00' }}>matrix</span>                   - Activa/desactiva la lluvia digital Matrix interactiva</div>
            <div>  <span style={{ color: '#ffff00' }}>color</span>                    - Alterna entre fósforo verde y ámbar</div>
            <div>  <span style={{ color: '#ffff00' }}>theme &lt;opc&gt;</span>               - Cambia el tema (win98, winxp, mac, nes)</div>
            <div>  <span style={{ color: '#ffff00' }}>clear / cls</span>              - Limpia la pantalla</div>
          </div>
        );
        break;

      case 'projects':
      case 'dir':
      case 'ls':
        output = (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
              {isEn ? 'REGISTERED PROJECTS INDEX:' : 'ÍNDICE DE PROYECTOS REGISTRADOS:'}
            </div>
            {projects.map((p) => (
              <div key={p.id} style={{ margin: '4px 0' }}>
                <span style={{ color: '#38bdf8' }}>[{p.filename}]</span> <b>{p.title}</b> ({getCategoryLabel(p.category, lang)})
                <div style={{ paddingLeft: '16px', color: '#94a3b8', fontSize: '15px' }}>
                  {p.tagline} | Stack: {p.technologies.slice(0, 4).join(', ')}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'cat':
        if (arg.includes('cv') || arg.includes('curriculum') || arg.includes('resume')) {
          output = (
            <div>
              <div style={{ color: '#ffffff', fontWeight: 'bold' }}>{profile.name}</div>
              <div>{profile.title} | {profile.location}</div>
              <br />
              <div style={{ color: '#38bdf8' }}>{isEn ? '[EXPERIENCE]' : '[EXPERIENCIA]'}</div>
              {profile.experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  • <b>{exp.role}</b> @ {exp.company} ({exp.period})
                  <div style={{ paddingLeft: '12px', color: '#cbd5e1' }}>{exp.description[0]}</div>
                </div>
              ))}
              <br />
              <div style={{ color: '#38bdf8' }}>{isEn ? '[EDUCATION]' : '[EDUCACIÓN]'}</div>
              <div>• {profile.education[0].title} ({profile.education[0].institution})</div>
            </div>
          );
        } else {
          output = isEn
            ? `File not found: '${arg}'. Try 'cat cv.txt'.`
            : `Archivo no encontrado: '${arg}'. Prueba con 'cat cv.txt'.`;
        }
        break;

      case 'skills':
        output = (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
              {isEn ? 'TECHNICAL SKILLS:' : 'COMPETENCIAS TÉCNICAS:'}
            </div>
            {profile.skillGroups.map((g, i) => (
              <div key={i} style={{ margin: '4px 0' }}>
                <span style={{ color: '#f59e0b' }}>[{g.category}]</span>: {g.skills.map((s) => `${s.name} (${s.level}%)`).join(', ')}
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
              {isEn ? 'CONTACT INFORMATION:' : 'DATOS DE CONTACTO:'}
            </div>
            <div>• Email:    <a href={`mailto:${profile.email}`} style={{ color: '#38bdf8' }}>{profile.email}</a></div>
            <div>• {isEn ? 'Phone:' : 'Teléfono:'} {profile.phone}</div>
            <div>• GitHub:   <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{profile.github}</a></div>
            <div>• LinkedIn: <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{profile.linkedin}</a></div>
            <div>• {isEn ? 'Location:' : 'Ubicación:'} {profile.location}</div>
          </div>
        );
        break;

      case 'glados':
        {
          const chosen = TERMINAL_GLADOS_QUOTES[Math.floor(Math.random() * TERMINAL_GLADOS_QUOTES.length)];
          playTerminalGladosQuote(chosen);

          output = (
            <div style={{ color: '#f59e0b', margin: '4px 0' }}>
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#eab308' }}>[GLaDOS v3.11 - Aperture Science OS]</span>
                <span style={{ fontSize: '12px', color: '#86efac' }}>
                  {isEn ? '● Voice active' : '● Voz activa'}
                </span>
              </div>
              <div style={{ fontStyle: 'italic', marginTop: '3px', paddingLeft: '8px' }}>
                &ldquo;{isEn ? chosen.textEn : chosen.text}&rdquo;
              </div>
            </div>
          );
        }
        break;

      case 'neofetch':
        output = (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'nowrap',
              alignItems: 'center',
              margin: '4px 0',
              overflowX: 'auto'
            }}
          >
            {/* MONOGON ASCII Art Sphere from user reference */}
            <pre
              style={{
                margin: 0,
                color: isAmber ? '#ffb000' : '#38bdf8',
                lineHeight: '1.14',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0px',
                flexShrink: 0
              }}
            >
{`           .---''''---.
        .-'     /\\     \`-.
      .'       /  \\       \`.
     /       .'    \\        \\
    /       :       \\        \\
   |       :         |        |
  ;       :           |        ;
  |      :             |       |
  | M   O   N   O   G   O   N  |
  |      :             |       |
  ;       :           |        ;
   |       :         |        |
    \\       :       /        /
     \\       \`.    /        /
      \`.       \\  /       .'
        \`-.     \\/     .-'
           \`---....---'
      MONOGON INDUSTRIES`}
            </pre>

            <div style={{ lineHeight: '1.3', fontSize: '12px', flexShrink: 0 }}>
              <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '13px' }}>martin@retro-workstation</div>
              <div style={{ color: isAmber ? '#ffb000' : '#38bdf8' }}>---------------------------------</div>
              <div><b style={{ color: '#ffffff' }}>OS:</b> Martín Retro OS 2026 (Astro + React)</div>
              <div><b style={{ color: '#ffffff' }}>Host:</b> Full Stack &amp; Mobile Engineer</div>
              <div><b style={{ color: '#ffffff' }}>Kernel:</b> Linux 6.12.0-monogon-x86_64</div>
              <div><b style={{ color: '#ffffff' }}>Uptime:</b> 99.99% High Availability</div>
              <div><b style={{ color: '#ffffff' }}>Packages:</b> 10 Real Projects (Podman, Vite, Kotlin)</div>
              <div><b style={{ color: '#ffffff' }}>Shell:</b> monogon-sh 4.10 [Zsh Emulation]</div>
              <div><b style={{ color: '#ffffff' }}>Terminal:</b> CRT Phosphor Display (VT100)</div>
              <div><b style={{ color: '#ffffff' }}>CPU:</b> Intel Core i9-14900K (32) @ 5.80GHz</div>
              <div><b style={{ color: '#ffffff' }}>Memory:</b> 128MB / 32768MB (Retro Emulated)</div>
              <div><b style={{ color: '#ffffff' }}>Resolution:</b> 1920x1080 (CRT Scanlines Active)</div>
              <div><b style={{ color: '#ffffff' }}>Theme:</b> MONOGON Industries OS [Retro]</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                <span style={{ background: '#000000', width: '12px', height: '12px', display: 'inline-block', border: '1px solid #444' }} />
                <span style={{ background: '#ef4444', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#22c55e', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#eab308', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#3b82f6', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#a855f7', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#06b6d4', width: '12px', height: '12px', display: 'inline-block' }} />
                <span style={{ background: '#ffffff', width: '12px', height: '12px', display: 'inline-block' }} />
              </div>
            </div>
          </div>
        );
        break;

      case 'theme':
        if (['win98', 'winxp', 'mac', 'nes'].includes(arg)) {
          if (onSetTheme) {
            onSetTheme(arg);
            output = isEn
              ? `System theme updated to: '${arg}'.`
              : `Tema del sistema actualizado a: '${arg}'.`;
          } else {
            output = isEn ? `Changing theme to: ${arg}` : `Cambiando tema a: ${arg}`;
          }
        } else {
          output = isEn
            ? 'Usage: theme <win98 | winxp | mac | nes>'
            : 'Uso: theme <win98 | winxp | mac | nes>';
        }
        break;

      case 'color':
        setIsAmber(!isAmber);
        output = isEn
          ? `Phosphor color changed to: ${!isAmber ? 'Amber' : 'Green'}.`
          : `Color del fósforo cambiado a: ${!isAmber ? 'Ámbar' : 'Verde'}.`;
        break;

      case 'matrix':
        setIsMatrix(!isMatrix);
        output = !isMatrix ? (
          <span style={{ color: '#86efac' }}>
            {isEn
              ? "[MATRIX]: Digital code rain started. Type 'matrix' to disable."
              : "[MATRIX]: Lluvia digital de código iniciada. Escribe 'matrix' para desactivar."}
          </span>
        ) : (
          <span style={{ color: '#94a3b8' }}>
            {isEn ? '[MATRIX]: Digital code rain stopped.' : '[MATRIX]: Lluvia digital de código detenida.'}
          </span>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'sudo':
        output = (
          <div style={{ color: '#ef4444' }}>
            {isEn
              ? "[GLaDOS Core]: User 'guest' is not in the sudoers file. This incident will be reported to the supervisor."
              : "[GLaDOS Core]: Usuario 'visitante' no está en el archivo sudoers. Este incidente será reportado al supervisor."}
          </div>
        );
        break;

      default:
        output = isEn
          ? `Command not recognized: '${raw}'. Type 'help' to see available commands.`
          : `Orden no reconocida: '${raw}'. Escribe 'help' para ver las órdenes disponibles.`;
        break;
    }

    setHistory((prev) => [...prev, { command: raw, output }]);
  };

  return (
    <div
      className={`terminal-container ${isAmber ? 'terminal-amber' : ''}`}
      onClick={() => inputRef.current?.focus()}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Matrix rain background canvas */}
      {isMatrix && <MatrixRainCanvas isAmber={isAmber} />}

      {/* Terminal text & commands (above canvas) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {/* History */}
        {history.map((item, index) => (
          <div key={index} style={{ marginBottom: '6px' }}>
            {item.command && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: isAmber ? '#ffb000' : '#38bdf8' }}>C:\MARTIN&gt;</span>
                <span>{item.command}</span>
              </div>
            )}
            {item.output && (
              <div style={{ marginTop: '2px', paddingLeft: item.command ? '8px' : '0' }}>
                {item.output}
              </div>
            )}
          </div>
        ))}

        {/* Active input line */}
        <div className="terminal-input-line" style={{ display: 'flex', alignItems: 'center' }}>
          <span className="terminal-prompt" style={{ color: isAmber ? '#ffb000' : '#38bdf8', whiteSpace: 'nowrap' }}>
            C:\MARTIN&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="terminal-input"
            spellCheck={false}
            autoComplete="off"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              outline: 'none',
              color: isAmber ? '#ffb000' : '#22c55e',
              fontFamily: 'monospace, Courier New, monospace',
              fontSize: '14px',
              lineHeight: '1.2',
              padding: '0 0 0 6px',
              margin: 0,
              flex: 1,
              width: '100%',
              caretColor: isAmber ? '#ffb000' : '#22c55e'
            }}
          />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

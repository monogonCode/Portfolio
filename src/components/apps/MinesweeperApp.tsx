import React, { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import { 
  PixelSmile, 
  PixelEye, 
  PixelTrophy, 
  PixelSkull, 
  PixelBomb, 
  PixelFlag, 
  PixelZap 
} from '../ui/RetroIcons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type FaceState = 'smile' | 'surprised' | 'won' | 'dead';

export const MinesweeperApp: React.FC = () => {
  const { isEn } = useLanguage();
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [flagCount, setFlagCount] = useState<number>(MINES);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [faceState, setFaceState] = useState<FaceState>('smile');
  const [flagModeMobile, setFlagModeMobile] = useState<boolean>(false);

  // Initialize board
  const initGame = () => {
    sound.playClick();
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      newBoard.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFlagCount(MINES);
    setTimer(0);
    setTimerActive(false);
    setFaceState('smile');
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, gameWon]);

  // Reveal cell logic
  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || board[r][c].isFlagged || board[r][c].isRevealed) return;

    if (!timerActive) setTimerActive(true);
    sound.playClick();

    const newBoard = [...board.map((row) => [...row])];
    const cell = newBoard[r][c];

    if (cell.isMine) {
      sound.playError();
      cell.isRevealed = true;
      // Reveal all mines
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (newBoard[row][col].isMine) {
            newBoard[row][col].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      setFaceState('dead');
      return;
    }

    // Cascade reveal
    const cascade = (row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      const target = newBoard[row][col];
      if (target.isRevealed || target.isFlagged || target.isMine) return;

      target.isRevealed = true;
      if (target.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            cascade(row + dr, col + dc);
          }
        }
      }
    };

    cascade(r, c);

    // Check win condition
    let unrevealedSafeCells = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine && !newBoard[row][col].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      sound.playStartup();
      setGameWon(true);
      setFaceState('won');
      setTimerActive(false);
    }

    setBoard(newBoard);
  };

  // Flag toggle logic
  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (gameOver || gameWon || board[r][c].isRevealed) return;

    sound.playClick();
    const newBoard = [...board.map((row) => [...row])];
    const cell = newBoard[r][c];

    if (!cell.isFlagged && flagCount > 0) {
      cell.isFlagged = true;
      setFlagCount((prev) => prev - 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagCount((prev) => prev + 1);
    }

    setBoard(newBoard);
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return '#0000ff';
      case 2: return '#008000';
      case 3: return '#ff0000';
      case 4: return '#000080';
      case 5: return '#800000';
      case 6: return '#008080';
      case 7: return '#000000';
      case 8: return '#808080';
      default: return '#000000';
    }
  };

  const renderFaceIcon = () => {
    switch (faceState) {
      case 'smile':
        return <PixelSmile size={20} color="#000000" />;
      case 'surprised':
        return <PixelEye size={20} color="#000080" />;
      case 'won':
        return <PixelTrophy size={20} color="#16a34a" />;
      case 'dead':
        return <PixelSkull size={20} color="#dc2626" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#c0c0c0', padding: '12px' }}>
      <div className="minesweeper-board">
        {/* Header with Counters and Pixel Smiley */}
        <div className="minesweeper-header">
          <div className="minesweeper-counter">
            {String(Math.max(0, flagCount)).padStart(3, '0')}
          </div>

          <button
            onClick={initGame}
            title={isEn ? 'Restart game' : 'Reiniciar partida'}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              background: '#c0c0c0',
              padding: 0
            }}
          >
            {renderFaceIcon()}
          </button>

          <div className="minesweeper-counter">
            {String(Math.min(999, timer)).padStart(3, '0')}
          </div>
        </div>

        {/* 9x9 Grid with Pixel Icons */}
        <div 
          className="minesweeper-grid"
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, 28px)` 
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine && cell.isRevealed ? 'mine-exploded' : ''}`}
                onClick={() => {
                  if (flagModeMobile) {
                    toggleFlag(r, c);
                  } else {
                    revealCell(r, c);
                  }
                }}
                onContextMenu={(e) => toggleFlag(r, c, e)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <PixelBomb size={16} color="#000000" />
                  ) : cell.neighborMines > 0 ? (
                    <span style={{ color: getNumberColor(cell.neighborMines) }}>
                      {cell.neighborMines}
                    </span>
                  ) : (
                    ''
                  )
                ) : cell.isFlagged ? (
                  <PixelFlag size={15} color="#dc2626" />
                ) : (
                  ''
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Toggle Mode Helper with Pixel Icons */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => {
            sound.playClick();
            setFlagModeMobile(!flagModeMobile);
          }}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            background: flagModeMobile ? '#dc2626' : '#d4d0c8',
            color: flagModeMobile ? '#ffffff' : '#000000',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {flagModeMobile ? (
            <>
              <PixelFlag size={13} color="#ffffff" />
              <span>{isEn ? 'Flag Mode (Active)' : 'Modo Bandera (Activo)'}</span>
            </>
          ) : (
            <>
              <PixelZap size={13} color="#f59e0b" />
              <span>{isEn ? 'Dig Mode (Active)' : 'Modo Cavar (Activo)'}</span>
            </>
          )}
        </button>
        <span style={{ fontSize: '10px', color: '#555' }}>
          {isEn ? '(Right-click or button to place flag)' : '(Clic derecho o botón para poner bandera)'}
        </span>
      </div>
    </div>
  );
};

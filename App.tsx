
import React, { useState, useEffect, useCallback } from 'react';
import { CROSSWORD_WORDS, GRID_ROWS, GRID_COLS } from './constants';
import { WordData, CellData } from './types';
import { Heart, CheckCircle2, Award, RefreshCw, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [grid, setGrid] = useState<(CellData | null)[][]>([]);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [winStatus, setWinStatus] = useState(false);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  // Initialize Grid
  useEffect(() => {
    const newGrid: (CellData | null)[][] = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => null)
    );


    CROSSWORD_WORDS.forEach((wordObj) => {
      const { word, row, col, direction, id } = wordObj;
      for (let i = 0; i < word.length; i++) {
        const r = direction === 'H' ? row : row + i;
        const c = direction === 'H' ? col + i : col;

        if (r < GRID_ROWS && c < GRID_COLS) {
          if (!newGrid[r][c]) {
            newGrid[r][c] = {
              char: word[i].toUpperCase(),
              row: r,
              col: c,
              wordNumbers: [id],
              userInput: '',
            };
          } else {
            newGrid[r][c]!.wordNumbers.push(id);
          }
        }
      }
    });

    setGrid(newGrid);
  }, []);

  const checkWordCompletion = useCallback((wordId: number, currentGrid: (CellData | null)[][]) => {
    const wordObj = CROSSWORD_WORDS.find(w => w.id === wordId);
    if (!wordObj) return false;

    for (let i = 0; i < wordObj.word.length; i++) {
      const r = wordObj.direction === 'H' ? wordObj.row : wordObj.row + i;
      const c = wordObj.direction === 'H' ? wordObj.col + i : wordObj.col;
      const cell = currentGrid[r]?.[c];
      if (!cell || cell.userInput.toUpperCase() !== cell.char) {
        return false;
      }
    }
    return true;
  }, []);

  const focusNextCell = (wordId: number, r: number, c: number, currentGrid: (CellData | null)[][]) => {
    const wordObj = CROSSWORD_WORDS.find(w => w.id === wordId);
    if (!wordObj) return;

    const currentIndex = wordObj.direction === 'H' ? c - wordObj.col : r - wordObj.row;

    // Smart jump: Find the next cell that is either empty or incorrect
    for (let i = currentIndex + 1; i < wordObj.word.length; i++) {
      const nextR = wordObj.direction === 'H' ? wordObj.row : wordObj.row + i;
      const nextC = wordObj.direction === 'H' ? wordObj.col + i : wordObj.col;
      const cell = currentGrid[nextR]?.[nextC];

      if (cell && (cell.userInput === '' || cell.userInput.toUpperCase() !== cell.char)) {
        const nextInput = document.getElementById(`cell-${nextR}-${nextC}`);
        if (nextInput) {
          nextInput.focus();
          return;
        }
      }
    }
  };

  const handleInputChange = (r: number, c: number, value: string) => {
    if (winStatus || !grid[r]) return;

    const newGrid = grid.map(row => row ? [...row] : null) as (CellData | null)[][];
    const cell = newGrid[r]?.[c];
    if (!cell) return;

    const char = value.slice(-1).toUpperCase();
    cell.userInput = char;
    setGrid(newGrid);

    const newlyCompleted: number[] = [];
    cell.wordNumbers.forEach(wId => {
      if (checkWordCompletion(wId, newGrid)) {
        newlyCompleted.push(wId);
      }
    });

    if (newlyCompleted.length > 0) {
      setCompletedWords(prev => {
        const updated = Array.from(new Set([...prev, ...newlyCompleted]));
        if (updated.length === CROSSWORD_WORDS.length) {
          setWinStatus(true);
        }
        return updated;
      });
    }

    if (char && selectedWordId !== null) {
      focusNextCell(selectedWordId, r, c, newGrid);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Backspace' && grid[r]?.[c]?.userInput === '' && selectedWordId !== null) {
      const currentWord = CROSSWORD_WORDS.find(w => w.id === selectedWordId);
      if (currentWord) {
        const indexInWord = currentWord.direction === 'H' ? c - currentWord.col : r - currentWord.row;
        if (indexInWord > 0) {
          const prevR = currentWord.direction === 'H' ? r : r - 1;
          const prevC = currentWord.direction === 'H' ? c - 1 : c;
          const prevInput = document.getElementById(`cell-${prevR}-${prevC}`);
          if (prevInput) prevInput.focus();
        }
      }
    }
  };

  const handleClueClick = (wordId: number) => {
    setSelectedWordId(wordId);
    const word = CROSSWORD_WORDS.find(w => w.id === wordId);
    if (word) {
      // Find the first cell Bianca needs to fill in this word
      let targetR = word.row;
      let targetC = word.col;
      for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'H' ? word.row : word.row + i;
        const c = word.direction === 'H' ? word.col + i : word.col;
        const cell = grid[r]?.[c];
        if (cell && (cell.userInput === '' || cell.userInput.toUpperCase() !== cell.char)) {
          targetR = r;
          targetC = c;
          break;
        }
      }
      const input = document.getElementById(`cell-${targetR}-${targetC}`);
      if (input) input.focus();
    }
  };

  const isCellSelected = (r: number, c: number) => {
    if (selectedWordId === null || !grid[r]) return false;
    return grid[r]?.[c]?.wordNumbers.includes(selectedWordId);
  };

  const resetGame = () => {
    const clearedGrid = grid.map(row =>
      row ? row.map(cell => cell ? { ...cell, userInput: '' } : null) : null
    ) as (CellData | null)[][];
    setGrid(clearedGrid);
    setCompletedWords([]);
    setWinStatus(false);
    setSelectedWordId(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-[#fff5f7]">
      {/* Header */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-4xl md:text-6xl font-love text-rose-600 mb-2 flex items-center justify-center gap-3">
          <Heart className="fill-rose-600 text-rose-600 animate-pulse" />
          Veremos si te llevas tus regalitos
          <Heart className="fill-rose-600 text-rose-600 animate-pulse" />
        </h1>
        <p className="text-rose-400 font-medium italic">Cada uno que aciertes te iré dando un regalo</p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pistas */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-rose-100 h-full">
            <h2 className="text-2xl font-bold text-rose-700 mb-4 flex items-center gap-2 border-b-2 border-rose-50 border-dashed pb-2">
              <CheckCircle2 className="text-rose-500" />
              Tus Pistas
            </h2>
            <div className="space-y-3 max-h-[100vh] overflow-y-auto pr-2 custom-scrollbar">
              {CROSSWORD_WORDS.sort((a, b) => a.id - b.id).map((word) => (
                <div
                  key={word.id}
                  onClick={() => handleClueClick(word.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-2 
                    ${selectedWordId === word.id ? 'bg-rose-50 border-rose-300 shadow-sm scale-[1.02]' : 'bg-white border-transparent hover:bg-rose-50/50'}
                    ${completedWords.includes(word.id) ? 'bg-green-50/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                      ${completedWords.includes(word.id) ? 'bg-green-500 text-white rotate-[360deg]' : 'bg-rose-100 text-rose-600'}`}>
                      {completedWords.includes(word.id) ? '✓' : word.id}
                    </span>
                    <p className={`text-sm md:text-base leading-relaxed transition-all ${completedWords.includes(word.id) ? 'line-through text-gray-400 italic' : 'text-gray-700 font-medium'}`}>
                      {word.displayClue}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-2xl transition-all"
            >
              <RefreshCw size={18} />
              Volver a empezar
            </button>
          </div>
        </div>

        {/* Tablero */}
        <div className="lg:col-span-8 flex flex-col items-center order-1 lg:order-2">
          <div className="bg-white p-4 md:p-8 rounded-[40px] shadow-2xl border-4 border-rose-200 relative overflow-hidden w-full overflow-x-auto">
            <div
              className="grid gap-1 md:gap-1.5 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                width: 'fit-content'
              }}
            >
              {grid.map((row, r) => (
                row && row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center"
                  >
                    {cell ? (
                      <div className="relative w-full h-full">
                        <input
                          id={`cell-${r}-${c}`}
                          type="text"
                          maxLength={1}
                          autoComplete="off"
                          value={cell.userInput}
                          onFocus={() => {
                            if (cell.wordNumbers.length > 0) {
                              if (!selectedWordId || !cell.wordNumbers.includes(selectedWordId)) {
                                setSelectedWordId(cell.wordNumbers[0]);
                              }
                            }
                          }}
                          onChange={(e) => handleInputChange(r, c, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, r, c)}
                          className={`w-full h-full text-center text-sm md:text-lg font-bold uppercase rounded-md md:rounded-lg border-2 transition-all
                            ${isCellSelected(r, c)
                              ? 'bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-200'
                              : 'bg-rose-50/30 border-rose-100 text-rose-900'}
                            focus:outline-none focus:bg-white
                            ${cell.userInput && cell.userInput.toUpperCase() === cell.char ? 'border-green-400/50 bg-green-50/10' : ''}`}
                        />
                        {/* Indicador de número */}
                        {CROSSWORD_WORDS.some(w => w.row === r && w.col === c) && (
                          <span className="absolute top-0 left-0 text-[7px] md:text-[9px] leading-none p-0.5 font-bold text-rose-400 pointer-events-none">
                            {CROSSWORD_WORDS.find(w => w.row === r && w.col === c)?.id}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-transparent" />
                    )}
                  </div>
                ))
              ))}
            </div>

            {/* Visual spacer between blocks */}
            <div className="mt-8 flex justify-center opacity-30 pointer-events-none">
              <Heart className="text-rose-200" size={32} />
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-md text-sm text-rose-600 font-bold border border-rose-100">
              <Award size={18} />
              <span>Logradas: {completedWords.length} / {CROSSWORD_WORDS.length}</span>
            </div>
            {winStatus && (
              <div className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full shadow-lg text-sm font-bold animate-bounce">
                <Trophy size={18} />
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-rose-300 text-sm italic font-medium opacity-70">
        Hecho por Dani para Bi
      </footer>

      {/* Modal de Victoria */}
      {winStatus && (
        <div className="fixed inset-0 bg-rose-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-500">
          <div className="bg-white rounded-[50px] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border-8 border-rose-100 animate-in zoom-in duration-500">
            <div className="mb-6 inline-flex p-6 bg-rose-100 rounded-full text-rose-600">
              <Trophy size={64} className="animate-bounce" />
            </div>
            <h2 className="text-4xl font-love text-rose-600 mb-4">¡Prueba superada!</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              OLEEEEEEEEE oioioioi, espero que te haya gustado
            </p>
            <button
              onClick={() => setWinStatus(false)}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg transform hover:-translate-y-1"
            >
              te quiero muchísimo ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

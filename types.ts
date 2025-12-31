
export interface WordData {
  id: number;
  word: string;
  clue: string;
  displayClue: string;
  row: number;
  col: number;
  direction: 'H' | 'V';
}

export interface CellData {
  char: string;
  row: number;
  col: number;
  wordNumbers: number[];
  userInput: string;
}

export interface GridDimensions {
  rows: number;
  cols: number;
}

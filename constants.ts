
import { WordData } from './types';

export const CROSSWORD_WORDS: WordData[] = [
  // BLOQUE 1: Superior (Interconectado)
  {
    id: 1,
    word: 'PENDIENTES',
    clue: 'Accesorio que te pones en las orejas para resaltar.',
    displayClue: 'Accesorio que te pones en las orejas para resaltar.',
    row: 4,
    col: 1,
    direction: 'H'
  },
  {
    id: 2,
    word: 'FUNDA',
    clue: 'Espacio que cubre algo y te ayuda a no pagar el seguro de FNAC',
    displayClue: 'Espacio que cubre algo y te ayuda a no pagar el seguro de FNAC',
    row: 2,
    col: 3,
    direction: 'V'
  },
  {
    id: 5,
    word: 'TAZA',
    clue: 'Te tomaras el cafecito como una reina',
    displayClue: 'Te tomaras el cafecito como una reina',
    row: 6,
    col: 2,
    direction: 'H'
  },
  {
    id: 7,
    word: 'LAMPARA',
    clue: 'Hace poco te desapareció una y sirve para dormir sin miedo',
    displayClue: 'Hace poco te desapareció una y sirve para dormir sin miedo',
    row: 5,
    col: 5,
    direction: 'V'
  },
  {
    id: 4,
    word: 'TOCADOR',
    clue: 'Herramienta con luces que se usa antes de salir y te puedes ver en ella.',
    displayClue: 'Herramienta con luces que se usa antes de salir y te puedes ver en ella.',
    row: 9,
    col: 2,
    direction: 'H'
  },
  {
    id: 3,
    word: 'PROTECTOR',
    clue: 'Lamina que sirve para evitar que los cristales se te claven en el dedo',
    displayClue: 'Lamina que sirve para evitar que los cristales se te claven en el dedo',
    row: 1,
    col: 8,
    direction: 'V'
  },

  // BLOQUE 2: Inferior (Separado más abajo)
  {
    id: 8,
    word: 'LIBRO',
    clue: "La casa del '_____' (Nunca me verás con uno)",
    displayClue: "La casa del '_____' (Nunca me verás con uno)",
    row: 13,
    col: 2,
    direction: 'H'
  },
  {
    id: 9,
    word: 'BOLSO',
    clue: 'Donde guardas tus gotitas de ojos.',
    displayClue: 'Donde guardas tus gotitas de ojos.',
    row: 13,
    col: 4,
    direction: 'V'
  },
  {
    id: 6,
    word: 'BOWL',
    clue: 'Sirve para FIDEOS GALLINA BLANCA Y CALDO DE POLLO',
    displayClue: 'Sirve para FIDEOS GALLINA BLANCA Y CALDO DE POLLO',
    row: 17,
    col: 3,
    direction: 'H'
  }
];

export const GRID_ROWS = 19;
export const GRID_COLS = 12;

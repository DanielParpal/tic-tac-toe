import {TileType} from 'Game';

// 3 rows, 3 columns, 2 diagonals
const WINNING_BINARY_MASKS: number[] = [
  0b111000000,
  0b000111000,
  0b000000111,
  0b100100100,
  0b010010010,
  0b001001001,
  0b100010001,
  0b001010100
];

const WINNING_POSITION_MASK = 0b100000000;

export const checkForWinningPattern = (sequence: TileType[], player: string): number => {
  const binarySequence = parseToBinarySequence(sequence, player);

  return containsWinningPattern(binarySequence);
}

export const tileIsPartOfWinningSequence = (binarySequence: number, index: number) => {
  return ((binarySequence << index) & WINNING_POSITION_MASK) === WINNING_POSITION_MASK;
}

const parseToBinarySequence = (sequence: TileType[], player: string): number => {
  const cleanSequence = sequence.map((element: TileType) => {
    return element.playedBy === player ? 1 : 0;
  }).join('');

  return parseInt(cleanSequence, 2);
}

const containsWinningPattern = (binarySequence: number): number => {
  for (const mask of WINNING_BINARY_MASKS) {
    if ((binarySequence & mask) === mask) {
      return mask;
    }
  }

  return 0;
}
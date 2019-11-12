import {FrameType} from 'Game';

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

export const checkForWin = (sequence: FrameType[], player: string): boolean => {
  const binarySequence = parseToBinarySequence(sequence, player);

  return containsWinningPattern(binarySequence);
}

const parseToBinarySequence = (sequence: FrameType[], player: string): number => {
  const cleanSequence = sequence.map((element: FrameType) => {
    return element.playedBy === player ? 1 : 0;
  }).join('');

  return parseInt(cleanSequence, 2);
}

const containsWinningPattern = (binarySequence: number): boolean => {
  for (const mask of WINNING_BINARY_MASKS) {
    if ((binarySequence & mask) === mask) {
      return true;
    }
  }

  return false;
}
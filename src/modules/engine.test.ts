import {checkForWin} from './engine';

describe('when given a winning scenario', () => {
  it('recognizes a winning row scenario', () => {
    const winningFirstRowForX = ['x', 'x', 'x', 'o', 'o', 'x', 'o', '', ''];
    const winner = checkForWin(winningFirstRowForX, 'x');
    expect(winner).toBe(true);
  });

  it('recognizes a winning column scenario', () => {
    const winningFirstRowForX = ['x', 'o', 'x', 'x', 'o', 'o', 'x', '', ''];
    const winner = checkForWin(winningFirstRowForX, 'x');
    expect(winner).toBe(true);
  });
});

describe('when given a non-winning scenario', () => {
  it('recognizes a non-winning scenario', () => {
    const winningFirstRowForX = ['x', '', 'x', 'o', '', 'x', 'o', '', ''];
    const winner = checkForWin(winningFirstRowForX, 'x');
    expect(winner).toBe(false);
  });
});
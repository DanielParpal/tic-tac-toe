import React from 'react';
import {tileIsPartOfWinningSequence} from './modules/engine';
import {TileType} from 'Game';
import './Board.css';

interface Props {
  currentFrame: TileType[],
  winningSequence: number,
  toggleTile(index: number, _e: React.SyntheticEvent): void
}

export default function Board({currentFrame, winningSequence, toggleTile}: Props) {
  const rgb = (values: number[]) => {
    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
  };

  const styleObj = (tile: TileType) => {
    return {
      color: rgb(tile.colorScheme[0]),
      borderColor: rgb(tile.colorScheme[1]),
      backgroundColor: rgb(tile.colorScheme[2]),
      fontSize: '3em'
    };
  };

  const getClassName = (tile: TileType, index: number) => {
    if (winningSequence === 0) return 'Tile';

    const isAWinningTile = tileIsPartOfWinningSequence(index, winningSequence);
    return isAWinningTile ? 'Tile Tile__winning' : 'Tile';
  }
  
  return (
    <div className='Board'>
      {currentFrame.map((tile, index) => {
        return (
          <div 
            key={index} 
            onClick={(e) => toggleTile(index, e)} 
            className={getClassName(tile, index)}
            style={styleObj(tile)}>
              {tile.playedBy}
          </div>
        );
      })}
    </div>
  );
}
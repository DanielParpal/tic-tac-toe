import React from 'react';
import {TileType} from 'Game';

export interface Props {
  frames: TileType[][],
  travelTo(index: number, e: React.SyntheticEvent): void
}

export default function TimeTravel({frames, travelTo}: Props) {
  return (
    <div>
      <h3>Time travel</h3>
      {
        frames.map((_, index) => {
          const text = index > 0 ? `move ${index}` : "start";
          return (
            <button onClick={(e) => travelTo(index, e)} key={index}>
              Go to {text}
            </button>
          );
        })
      }
    </div>
  );
}

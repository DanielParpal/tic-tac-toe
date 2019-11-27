import React from 'react';

const defaultColors = [
  [180, 180, 180],
  [16, 16, 16],
  [240, 240, 240]
];

const fetchColorSchemes = async() => {
  const colors = new Array(9).fill(defaultColors);
  const promises = [];

  for (let i = 0; i < colors[0].length; i++) {
    const data = {model: 'default'};
    const request = new Request('http://colormind.io/api/', {method: 'POST', body: JSON.stringify(data)});
    promises.push(fetch(request));
  }
  
  Promise.all(promises).then(async (responses) => {
    for (const response of responses) {
      colors.push((await response.json()).result.slice(0, 3));
    }
  });

  return colors;
}

export const ColorsContext = React.createContext(async () => {
  return await(fetchColorSchemes());
});


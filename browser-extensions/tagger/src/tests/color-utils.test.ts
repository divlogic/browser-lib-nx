import Color from 'colorjs.io';
import {
  generateAccessibleColor,
  generateAccessibleColors,
} from '../color-utils';

describe('generateAccessibleColor', () => {
  const startingColorString = 'black';
  const startingColor = new Color(startingColorString);
  const color = generateAccessibleColor(startingColorString);
  const rating = color.contrastAPCA(startingColor);
  expect(rating).toBeGreaterThan(90);
});

// describe('generateAccessibleColors', () => {
//   it('should return an array of accessible colors based on a starting color', () => {
//     const startingColorString = 'black';
//     const startingColor = new Color(startingColorString);
//     const colors = generateAccessibleColors(startingColorString);

//     colors.forEach((backgroundColor) => {
//       const bgColor = new Color(backgroundColor);
//       const rating = bgColor.contrastAPCA(startingColor);
//       expect(rating).toBeGreaterThan(90);
//     });
//   });
// });

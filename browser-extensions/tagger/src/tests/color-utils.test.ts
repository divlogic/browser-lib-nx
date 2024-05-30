import Color from 'colorjs.io';
import {
  generateAccessibleColor,
  generateAccessibleColors,
  cycle,
} from '../color-utils';

describe('cycle', () => {
  it('should cycle through numbers, not going over the cap', () => {
    const start = 20;
    const cap = 20;
    const toAdd = 1;

    expect(cycle(start, cap, toAdd)).toEqual(1);
  });
});

describe('generateAccessibleColor', () => {
  it('should generate an accessible background color from a starting color', () => {
    const startingColorString = 'black';
    const startingColor = new Color(startingColorString);
    const color = generateAccessibleColor(startingColorString);
    const rating = color.contrastAPCA(startingColor);
    expect(rating).toBeGreaterThan(90);
  });

  it('should still work with light colors', () => {
    const startingColorString = 'white';
    const startingColor = new Color(startingColorString);
    const color = generateAccessibleColor(startingColorString);
    const rating = color.contrastAPCA(startingColor);
    expect(Math.abs(rating)).toBeGreaterThan(90);
  });
  it('should still work with basic colors', () => {
    const startingColorString = 'green';
    const startingColor = new Color(startingColorString);
    const color = generateAccessibleColor(startingColorString);
    const rating = color.contrastAPCA(startingColor);
    expect(Math.abs(rating)).toBeGreaterThan(90);
  });
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

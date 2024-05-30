import Color from 'colorjs.io';
import {
  generateAccessibleColor,
  generateAccessibleColors,
  cycle,
} from '../color-utils';

describe('cycle', () => {
  it('should cycle through numbers, not going over the cap', () => {
    const start = 0;
    const end = 20;
    const current = 20;
    const increment = 1;

    expect(cycle(start, end, current, increment)).toEqual(0);
  });

  it('should work work in the middle of the range', () => {
    const start = 0;
    const end = 20;
    const current = 11;
    const increment = 1;
    expect(cycle(start, end, current, increment)).toEqual(12);
  });

  it('should work with a range', () => {
    const start = 0;
    const end = 10;

    const currents = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const answers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0];

    currents.forEach((current, index) => {
      expect(cycle(start, end, current, 1)).toBe(answers[index]);
    });
  });

  it('should work with negatives', () => {
    const start = -5;
    const end = 5;

    const currents = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const answers = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, -5];

    currents.forEach((current, index) => {
      expect(cycle(start, end, current, 1)).toBe(answers[index]);
    });
  });
  it('should work with negatives less than 1', () => {
    const start = -5;
    const end = 5;

    const currents = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const answers = [3, 4, 5, -5, -4, -3, -2, -1, 0, 1, 2];

    currents.forEach((current, index) => {
      expect(cycle(start, end, current, -3)).toBe(answers[index]);
    });
  });

  it('should work with greater than 1 increments', () => {
    const start = -5;
    const end = 5;

    const currents = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const answers = [-2, -1, 0, 1, 2, 3, 4, 5, -5, -4, -3];

    currents.forEach((current, index) => {
      expect(cycle(start, end, current, 3)).toBe(answers[index]);
    });
  });

  it('should work with negative increments', () => {
    const start = -5;
    const end = 5;

    const currents = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const answers = [5, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4];

    currents.forEach((current, index) => {
      expect(cycle(start, end, current, -1)).toBe(answers[index]);
    });
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

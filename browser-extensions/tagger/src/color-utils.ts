import Color from 'colorjs.io';
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function generateRandomColor() {
  const color = new Color('hsl', [
    getRandomArbitrary(0, 360),
    getRandomArbitrary(0, 100),
    getRandomArbitrary(0, 100),
  ]);
  return color;
}

export function generateRandomAccessibleColor(textColor: string) {
  let difference = 0;
  const text = new Color(textColor);
  let bgColor: Color = new Color('hsluv', [
    getRandomArbitrary(0, 360),
    getRandomArbitrary(0, 100),
    getRandomArbitrary(0, 100),
  ]);
  let count = 0;
  while (difference < 7 && count < 100) {
    count += 1;
    bgColor = new Color('hsluv', [
      getRandomArbitrary(0, 360),
      getRandomArbitrary(0, 100),
      getRandomArbitrary(0, 100),
    ]);
    difference = bgColor.contrastWCAG21(text);
  }
  if (count >= 100) {
    throw new Error('Something went wrong');
  }
  return bgColor;
}

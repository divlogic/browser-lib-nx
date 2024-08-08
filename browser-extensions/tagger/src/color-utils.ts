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

export function generateRandomAccessibleColor(
  textColor: string,
  hsl: { hue: null; saturation: null; lightness: null }
) {
  let difference = 0;
  const text = new Color(textColor);
  let bgColor: Color = new Color('hsluv', [
    hsl?.hue || getRandomArbitrary(0, 360),
    hsl?.saturation || getRandomArbitrary(0, 100),
    hsl?.lightness || getRandomArbitrary(0, 100),
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

export function cycle(
  start: number,
  end: number,
  current: number,
  increment: number
) {
  let answer = current + increment;
  if (answer > end) {
    answer = Math.abs(end - answer) + start - 1;
  }
  if (answer < start) {
    const difference = Math.abs(start - answer);
    answer = end - Math.abs(difference) + 1;
  }
  return answer;
}

export function generateAccessibleColor(
  textColor: string,
  hue = 30
): Color | null {
  const fg = new Color(textColor);

  const fgLightness = fg.hsluv[2];
  let bg: Color;
  let lightness = 50;

  let highestContrast = 0;
  if (fgLightness <= 50) {
    //lighten
    bg = new Color('hsluv', [hue, 100, lightness]);
    highestContrast = Math.abs(bg.contrastAPCA(fg));
    while (highestContrast < 90) {
      if (lightness > 100) {
        return null;
      }
      lightness += 1;
      bg = new Color('hsluv', [hue, 100, lightness]);
      highestContrast = Math.abs(bg.contrastAPCA(fg));
    }
  } else {
    //darken
    bg = new Color('hsluv', [hue, 100, lightness]);
    while (Math.abs(bg.contrastAPCA(fg)) < 90) {
      lightness -= 1;
      if (lightness < 0) {
        return null;
      }
      bg = new Color('hsluv', [hue, 100, lightness]);
    }
  }
  return bg;
}

export function generateAccessibleColors(textColor: string): string[] {
  const fg = new Color(textColor);
  const basicHues = {
    red: 0,
    orange: 30,
    yellow: 50,
    green: 120,
    blue: 180,
    purple: 300,
    pink: 330,
  };
  const colors: string[] = [];
  Object.keys(basicHues).forEach((colorName) => {
    /**
     * 1. Lighten
     * 2. Darken
     * 3. Cycle through
     */
    const color = new Color('hsluv', [
      basicHues[colorName as keyof typeof basicHues],
      100,
      50,
    ]);
    console.log(color.luminance);
    if (color.contrastAPCA(fg) > 90) {
      colors.push(color.to('srgb').toString({ format: 'hex' }));
      return;
    }
    color.lighten();
    if (color.contrastAPCA(fg) > 90) {
      colors.push(color.to('srgb').toString({ format: 'hex' }));
      return;
    }
    color.lighten();
    if (color.contrastAPCA(fg) > 90) {
      colors.push(color.to('srgb').toString({ format: 'hex' }));
      return;
    }
    colors.push(color.to('srgb').toString({ format: 'hex' }));
  });
  return colors;
}

import Color from 'colorjs.io';

export function Tag(tags: string[]) {
  const body = document.getElementsByTagName('body')[0];
  const treeWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);

  const allTextNodes: Node[] = [];
  let currentNode = treeWalker.nextNode();
  while (currentNode) {
    allTextNodes.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  if (!CSS.highlights) {
    console.error('CSS Custom Highlight API not supported');
  }

  const rangesToHighlight = [];
  tags.forEach((str) => {
    const testStr = str.toLowerCase();
    const ranges = allTextNodes
      .map((el) => {
        return { el, text: el.textContent?.toLowerCase() };
      })
      .map(({ text, el }) => {
        const indices = [];
        let startPos = 0;
        while (startPos < text.length) {
          const index = text?.indexOf(testStr, startPos);
          if (index === -1) break;
          indices.push(index);
          startPos = index + testStr.length;
        }

        return indices.map((index) => {
          const range = new Range();
          range.setStart(el, index);
          range.setEnd(el, index + testStr.length);
          return range;
        });
      });
    rangesToHighlight.push(...ranges.flat());
  });
  if (rangesToHighlight.length > 0) {
    const searchResultsHighlight = new Highlight(...rangesToHighlight);

    CSS.highlights.set('search-results', searchResultsHighlight);
  }

  const bgColor = new Color('hsl', [
    getRandomArbitrary(0, 360),
    getRandomArbitrary(0, 100),
    getRandomArbitrary(0, 100),
  ]);
  const bgColorString = bgColor.toString();
  // const bgColorString = 'blue';
  const css = `
    ::highlight(search-results) {
      background-color: ${bgColorString};
      color: white;
    }
    `;
  const head = document.getElementsByTagName('head')[0];
  let styleElement = document.getElementById('styled-by-tagger');
  if (styleElement == null) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'styled-by-tagger');
    head.appendChild(styleElement);
  }
  styleElement.innerHTML = css;
  window.styleElement = styleElement;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

import Color from 'colorjs.io';
import { TagType } from './app/form-reducer';

export function Tag(tags: TagType[]) {
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
  tags.forEach((tag) => {
    const testStr = tag.text.toLowerCase();
    const ranges = allTextNodes
      .map((el) => {
        return { el, text: el.textContent?.toLowerCase() };
      })
      .map(({ text, el }) => {
        if (typeof text === 'string') {
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
        } else {
          return null;
        }
      });
    rangesToHighlight.push(...ranges.flat());
  });
  if (rangesToHighlight.length > 0) {
    const searchResultsHighlight = new Highlight(...rangesToHighlight);

    CSS.highlights.set('search-results', searchResultsHighlight);
  }

  const css = `
    ::highlight(search-results) {
      background-color: ${tags[0]?.color || 'yellow'};
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

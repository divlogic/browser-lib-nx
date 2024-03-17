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
    const ranges = allTextNodes
      .map((el) => {
        return { el, text: el.textContent?.toLowerCase() };
      })
      .map(({ text, el }) => {
        const indices = [];
        let startPos = 0;
        while (startPos < text.length) {
          const index = text?.indexOf(str, startPos);
          if (index === -1) break;
          indices.push(index);
          startPos = index + str.length;
        }

        return indices.map((index) => {
          const range = new Range();
          range.setStart(el, index);
          range.setEnd(el, index + str.length);
          return range;
        });
      });
    rangesToHighlight.push(...ranges.flat());
  });
  if (rangesToHighlight.length > 0) {
    const searchResultsHighlight = new Highlight(...rangesToHighlight);

    CSS.highlights.set('search-results', searchResultsHighlight);
  }

  const css = `
    ::highlight(search-results) {
      background-color: #f06;
      color: white;
    }
    `;
  const head = document.getElementsByTagName('head')[0];
  const newStyle = document.createElement('style');
  newStyle.innerHTML = css;
  head.appendChild(newStyle);
}

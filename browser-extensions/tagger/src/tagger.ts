import { TagSchema, TagType } from './schemas/tag-schemas';
import { HighlightStyle } from './schemas/style-schemas';

function unCamelize(str: string) {
  return str.replace(/([A-Z][a-z]+)/g, function (word: string) {
    return '-' + word.toLowerCase();
  });
}
export function HighlightTags(
  tags: Omit<TagType, 'id'>[],
  styles: { [key: string]: HighlightStyle }
) {
  const stylesInUse: { [key: string]: Range[] } = {};
  if (typeof CSS.highlights !== 'undefined') {
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

    tags.forEach((tag) => {
      try {
        TagSchema.omit({ id: true }).parse(tag);
      } catch (e) {
        console.log('Errored tag: ', tag);
        console.error(e);
      }

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

      const filteredRanges = ranges
        .flat()
        .filter((item): item is Range => item instanceof Range);

      if (Array.isArray(stylesInUse[tag.style_name])) {
        stylesInUse[tag.style_name].push(...filteredRanges);
      } else {
        stylesInUse[tag.style_name] = [];
        stylesInUse[tag.style_name].push(...filteredRanges);
      }
    });

    let css = '';
    for (const [style, ranges] of Object.entries(stylesInUse)) {
      if (ranges.length > 0) {
        const searchResultsHighlight = new Highlight(...ranges);

        CSS.highlights.set(style, searchResultsHighlight);

        css += `::highlight(${style}) {\n`;
        if (style in styles) {
          css += Object.keys(styles[style])
            .map((key) => {
              return `${unCamelize(key)}: ${
                styles[style][key as keyof HighlightStyle]
              };\n`;
            })
            .join('');
        } else {
          console.error(`style: ${style} not in styles`);
        }

        css += `}\n`;
      }
    }
    const head = document.getElementsByTagName('head')[0];
    let styleElement = document.getElementById('styled-by-tagger');
    if (styleElement == null) {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', 'styled-by-tagger');
      head.appendChild(styleElement);
    }
    styleElement.innerHTML = css;
  } else {
    console.error('CSS custom highlights API not available');
  }
}

import { TagSchema, TagType } from './schemas/tag-schemas';
import { HighlightStyle } from './schemas/style-schemas';
import { styleModel, tagModel } from './app';

function unCamelize(str: string) {
  return str.replace(/([A-Z][a-z]+)/g, function (word: string) {
    return '-' + word.toLowerCase();
  });
}
/**
 * Performs the actual highlighting
 *
 * TODO: Decide on how precedence should be handled.
 * ex: tags: test, test1, testabc
 * If they have different styles, should test's cover
 * the test in test1 and testabc, leaving the remainder to be
 * in the new style?
 *
 * Bug: creates too many new ranges.
 * Bug: Maybe related to above, but new function calls break old highlights.
 *
 * It seems that using element specific selection is doing too much work.
 * Can I make this work without:
 * 1. Relying on iterating over the style object keys and manually setting props
 * 2. Spamming ranges that will actually wind up out of date upon minor changes, if I understand what a Range is.
 *
 * It seems like I should be applying some kind of debounce and maybe just calling the function after typing is done
 * Or possibly having the function manage the Ranges and delete the old ones.
 *
 * possible solutions
 * - debounce
 * - event listener for changes
 * - singleton, add/delete ranges each time, possibly with granularity
 *
 *
 *
 * @param tags
 * @param styles
 * @param elementId
 */
export function HighlightTags(
  tags: Omit<TagType, 'id'>[],
  styles: { [key: string]: HighlightStyle },
  elementId = ''
) {
  window.Highlighter = Highlighter;
  Highlighter.counter += 1;
  console.log('Highlighter counter: ', Highlighter.counter);
  const stylesInUse: { [key: string]: Range[] } = {};
  if (typeof CSS.highlights !== 'undefined') {
    const element = elementId
      ? document.getElementById(elementId)
      : document.getElementsByTagName('body')[0];
    const body = document.getElementsByTagName('body')[0];
    const treeWalker = document.createTreeWalker(
      element || body,
      NodeFilter.SHOW_TEXT
    );

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
      if (testStr.length < 1) {
        throw new Error('Invalid tag text, cannot use empty string.');
      }
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
    for (const [styleName, ranges] of Object.entries(stylesInUse)) {
      if (ranges.length > 0) {
        Highlighter.ranges.push(...ranges);
        const searchResultsHighlight = new Highlight(...ranges);

        CSS.highlights.set(styleName + elementId, searchResultsHighlight);

        css += `::highlight(${styleName + elementId}) {\n`;
        if (styleName in styles) {
          css += Object.keys(styles[styleName])
            .map((key) => {
              return `${unCamelize(key)}: ${
                styles[styleName][key as keyof HighlightStyle]
              };\n`;
            })
            .join('');
        } else {
          console.error(`styleName: ${styleName} not in styles`, styles);
        }

        css += `}\n`;
      }
    }
    const head = document.getElementsByTagName('head')[0];
    let styleElement = document.getElementById('styled-by-tagger' + elementId);
    if (styleElement == null) {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', 'styled-by-tagger' + elementId);
      head.appendChild(styleElement);
    }
    styleElement.innerHTML = css;
  } else {
    console.error('CSS custom highlights API not available');
  }
}

export class Highlighter {
  static counter = 0;
  static ranges = [];
  static HighlightTags = HighlightTags;

  static async highlightFromDb() {
    const tags = await tagModel.get();
    const styles = await styleModel.get();
    const formattedStyles: { [key: string]: HighlightStyle } = {};
    if (styles) {
      styles.forEach((style) => {
        formattedStyles[style.name] = style;
      });
    }

    if (tags && styles && formattedStyles) {
      Highlighter.HighlightTags(tags, formattedStyles);
    }
  }
}

import { useEffect } from 'react';
import { HighlightStyle } from '../schemas';
import { TagType } from '../schemas/tag-schemas';
import { HighlightTags, Highlighter } from '../tagger';
import { Text } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface HighlightExampleProps {
  tag: Omit<TagType, 'id'>;
  style: { [key: string]: HighlightStyle } | null;
  id?: string;
}
export function HighlightExample({ tag, style, id }: HighlightExampleProps) {
  useEffect(() => {
    if (tag && tag.text.length > 0 && style) {
      Highlighter.HighlightTags([tag], style, id);
    }
  }, [tag, style, id]);
  return (
    <Text id="example" as="span">
      {tag.text || 'input text will be highlighted'}
    </Text>
  );
}

export default HighlightExample;

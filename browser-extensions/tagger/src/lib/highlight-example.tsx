import { useEffect } from 'react';
import { HighlightStyle } from '../schemas';
import { TagType } from '../schemas/tag-schemas';
import { HighlightTags } from '../tagger';
import { Text } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface HighlightExampleProps {
  tag: TagType;
  style: { [key: string]: HighlightStyle } | null;
}
export function HighlightExample({ tag, style }: HighlightExampleProps) {
  useEffect(() => {
    if (tag && style) {
      HighlightTags([tag], style);
    }
  }, [tag, style]);
  return (
    <Text id="example" as="span">
      {tag.text}
    </Text>
  );
}

export default HighlightExample;

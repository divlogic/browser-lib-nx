/* eslint-disable-next-line */
import {
  Container,
  HStack,
  Heading,
  IconButton,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { HighlightSchema, HighlightStyle } from '../schemas/style-schemas';
import { useStylesActions, useStylesData } from '../app/providers';
import HighlightExample from './highlight-example';
import { useState } from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

export function StyleList() {
  const styles = useStylesData();
  return (
    <Container>
      <Heading m="2">current styles</Heading>
      <UnorderedList>
        {styles.map((style, index) => {
          const parsed = HighlightSchema.safeParse(style);
          if (parsed.success === false) {
            console.log('style is: ', style);
            console.error('Unsuccessful parse for: ', parsed, parsed.error);
            console.log('error data is: ', parsed.error.flatten());
            return null;
          } else {
            const keys = Object.keys(parsed.data) as (keyof HighlightStyle)[];
            keys.forEach((key: keyof HighlightStyle) => {
              // const item = style[key];
              // This is causing a bug because changing the reference
              // is modifying the state in the reducer/context
              // if (Array.isArray(item)) {
              //   style[key] = item.join(' ');
              // }
            });
            return (
              <ListItem key={index}>
                <StyleItem style={style}></StyleItem>
              </ListItem>
            );
          }
        })}
      </UnorderedList>
    </Container>
  );
}

export default StyleList;

interface StyleItemProps {
  style: HighlightStyle;
}
function StyleItem({ style }: StyleItemProps) {
  const styleActions = useStylesActions();
  const [editing, setEditing] = useState(false);
  return (
    <HStack>
      <HighlightExample
        tag={{ text: style.name, style_name: style.name }}
        style={{ [style.name]: style }}
        id={style.name}
      />
      <IconButton
        aria-label="edit"
        size="sm"
        onClick={async (e) => {
          e.preventDefault();
          setEditing(!editing);
        }}
        icon={<EditIcon />}
      />
      <IconButton
        aria-label="delete"
        size="sm"
        onClick={async (e) => {
          e.preventDefault();
          await styleActions.remove(style);
        }}
        icon={<DeleteIcon />}
      />
    </HStack>
  );
}

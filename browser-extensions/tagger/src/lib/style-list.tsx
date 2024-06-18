/* eslint-disable-next-line */
import {
  Container,
  Heading,
  List,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { HighlightSchema, HighlightStyle } from '../schemas/style-schemas';
import { useContext } from 'react';
import { StylesContext } from '../app/providers';

export interface StyleListProps {
  styles: HighlightStyle[];
}

export function StyleList() {
  const styles = useContext<HighlightStyle[]>(StylesContext);
  return (
    <Container>
      <Heading m="2">current styles</Heading>
      <UnorderedList>
        {styles.map((style: HighlightStyle, index) => {
          const keys = Object.keys(
            HighlightSchema.parse(style)
          ) as (keyof HighlightStyle)[];
          keys.forEach((key: keyof HighlightStyle) => {
            const item = style[key];
            if (Array.isArray(item)) {
              style[key] = item.join(' ');
            }
          });
          return (
            <ListItem key={index}>
              <Text {...style} width={'min-content'}>
                {style.name}
              </Text>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Container>
  );
}

export default StyleList;

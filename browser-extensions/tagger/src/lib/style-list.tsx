/* eslint-disable-next-line */
import {
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { HighlightSchema, HighlightStyle } from '../schemas/style-schemas';
import { useContext } from 'react';
import { StylesContext } from '../app/providers';

export function StyleList() {
  const styles = useContext<HighlightStyle[]>(StylesContext);
  return (
    <Container>
      <Heading m="2">current styles</Heading>
      <UnorderedList>
        {styles.map((style, index) => {
          const parsed = HighlightSchema.safeParse(style);
          if (parsed.success === false) {
            console.error('Unsuccessful parse for: ', parsed, parsed.error);
            console.log('error data is: ', parsed.data);
            return null;
          } else {
            const keys = Object.keys(parsed.data) as (keyof HighlightStyle)[];
            keys.forEach((key: keyof HighlightStyle) => {
              const item = style[key];
              if (Array.isArray(item)) {
                style[key] = item.join(' ');
              }
            });
            return (
              <ListItem key={index}>
                <Text
                  // This is a problem area. When passing it in directly, it accepts a string, but for some reason it doesn't accept a string
                  {...(style as Omit<HighlightStyle, 'textDecorationStyle'>)}
                  width={'min-content'}
                >
                  {style.name}
                </Text>
              </ListItem>
            );
          }
        })}
      </UnorderedList>
    </Container>
  );
}

export default StyleList;

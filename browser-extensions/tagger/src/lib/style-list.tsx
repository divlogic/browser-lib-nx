/* eslint-disable-next-line */
import {
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { HighlightSchema, HighlightStyle } from '../schemas/style-schemas';
import { useStylesData } from '../app/providers';
import HighlightExample from './highlight-example';

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
                <HighlightExample
                  tag={{ text: style.name, style_name: style.name }}
                  style={{ [style.name]: style }}
                />
              </ListItem>
            );
          }
        })}
      </UnorderedList>
    </Container>
  );
}

export default StyleList;

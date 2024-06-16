import { Container, Heading } from '@chakra-ui/react';
import StyleForm from '../../lib/style-form';
import StyleList from '../../lib/style-list';

/* eslint-disable-next-line */
export interface StylesPageProps {}

export function StylesPage(props: StylesPageProps) {
  return (
    <Container>
      <Heading m={2}>styles</Heading>
      <StyleForm />
      <StyleList
        styles={[
          {
            name: 'foo',
            backgroundColor: 'orange',
            color: 'white',
            textDecorationLine: ['underline', 'overline'],
            textDecorationStyle: 'wavy',
          },
        ]}
      ></StyleList>
    </Container>
  );
}

export default StylesPage;

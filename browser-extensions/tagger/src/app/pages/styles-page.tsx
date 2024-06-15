import { Container, Heading } from '@chakra-ui/react';
import StyleForm from '../../lib/style-form';

/* eslint-disable-next-line */
export interface StylesPageProps {}

export function StylesPage(props: StylesPageProps) {
  return (
    <Container>
      <Heading m={2}>styles</Heading>
      <StyleForm />
    </Container>
  );
}

export default StylesPage;

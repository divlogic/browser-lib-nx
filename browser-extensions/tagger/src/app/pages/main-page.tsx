import { Container, Heading, Text } from '@chakra-ui/react';
import { AddTagForm } from '../components/add-tag-form';
import TagList from '../components/tag-list';

/* eslint-disable-next-line */
export interface MainPageProps {
  dispatch: any;
  tags: any;
}

export function MainPage({ dispatch, tags }: MainPageProps) {
  return (
    <Container>
      <Heading m={2}>tagger</Heading>
      <Text m={2}>
        tagger is a tool intended to help you more efficiently work through
        data.
      </Text>
      <AddTagForm dispatcher={dispatch}></AddTagForm>
      <Text fontWeight="bold">Current Tags:</Text>
      <TagList tags={tags.data} dispatch={dispatch} />
    </Container>
  );
}

export default MainPage;

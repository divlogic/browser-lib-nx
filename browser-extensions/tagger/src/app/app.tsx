// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Container, Heading, Text } from '@chakra-ui/react';
import { AddTagForm } from './components/add-tag-form';
import { useEffect, useReducer } from 'react';
import { tagsReducer } from './form-reducer';
import { tag } from './models/tag';
import TagList from './components/tag-list';
import { Tag } from '../tagger';

export function App() {
  const [tags, dispatch] = useReducer(tagsReducer, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    tag.get()?.then((tags) => {
      dispatch({ type: 'loaded', payload: { data: tags } });
    });
  }, []);

  useEffect(() => {
    try {
      Tag(tags.data);
    } catch (e) {
      // console.error(e);
    }
  }, [tags]);

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

export default App;

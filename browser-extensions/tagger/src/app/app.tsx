// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import MarkJS from 'mark.js';
import { AddTagForm } from './components/form';
import { useEffect, useReducer } from 'react';
import { tagsReducer, TagState } from './form-reducer';
import { tag } from '../db';

export function App() {
  const [tags, dispatch] = useReducer(tagsReducer, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    tag.getAll()?.then((tags) => {
      dispatch({ type: 'loaded', payload: { data: tags } });
    });
    // There is a sideffect of overlap marking.
    // if you have the tags: test, test1, test12
    // And they are in that order,
    // test12 will have more marks, or depending on how it's configured,
    // it will be excluded because the test portion of it is already marked
    // May or may not be a problem.

    const instance = new MarkJS(document.querySelector('body'));
    tags.data.forEach((tag) => {
      instance.mark(tag.text, { acrossElements: true });
    });
  }, []);

  return (
    <Container>
      <Heading m={2}>tagger</Heading>
      <Text m={2}>
        tagger is a tool intended to help you more efficiently work through
        data.
      </Text>
      <AddTagForm dispatcher={dispatch}></AddTagForm>
      <Text fontWeight="bold">Current Tags:</Text>
      {tags.data.map((tag, index) => {
        return <Text key={index}>{tag.text}</Text>;
      })}
    </Container>
  );
}

export default App;

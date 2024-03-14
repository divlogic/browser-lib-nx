// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Container, Heading, Text } from '@chakra-ui/react';
import MarkJS from 'mark.js';
import { AddTagForm } from './components/form';
import { useEffect, useReducer } from 'react';
import { tagsReducer } from './form-reducer';
import { tag } from '../db';

export function App() {
  const [tags, dispatch] = useReducer(tagsReducer, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    tag.get()?.then((tags) => {
      console.log('tags is: ');
      dispatch({ type: 'loaded', payload: { data: tags } });
    });
  }, []);

  useEffect(() => {
    // There is a sideffect of overlap marking.
    // if you have the tags: test, test1, test12
    // And they are in that order,
    // test12 will have more marks, or depending on how it's configured,
    // it will be excluded because the test portion of it is already marked
    // May or may not be a problem.
    const instance = new MarkJS(document.querySelectorAll('body')[0]);
    tags.data.forEach((tag) => {
      if (typeof tag.text === 'string') {
        instance.mark(tag.text, {
          acrossElements: true,
          ignoreJoiners: true,
          separateWordSearch: false,
        });
      }
    });
  });

  console.log('tags is:', tags);
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

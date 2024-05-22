import { Tag } from '../tagger';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface StyleFormProps {}

type HighlightStyle = {
  color: string;
  backgroundColor: string;
  textDecoration: string;
  textDecorationColor: string;
  textDecorationLine: string;
  textDecorationStyle: string;
  textDecorationThickness: string;
  textShadow: string;
};

const textSample = `Lorem ipsum dolor sit amet,
  consectetur adipiscing elit,
  sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut
  aliquip ex ea commodo consequat. Duis aute
  irure dolor in reprehenderit in
  voluptate velit esse cillum dolore
  eu fugiat nulla pariatur. Excepteur
  sint occaecat cupidatat non proident,
  sunt in culpa qui officia deserunt mollit
  anim id est laborum.`;

export function pickRandomWords(input: string) {
  const allWords = input.matchAll(/\w+/g);

  const randomWords = [];
  for (const word of allWords) {
    if (Math.random() > 0.75) {
      randomWords.push(word[0]);
    }
  }
  return randomWords;
}

export function StyleForm(props: StyleFormProps) {
  const randomWords = pickRandomWords(textSample);
  const tags = randomWords.map((word, index) => {
    return { text: word, color: 'red' };
  });
  console.log('tags is: ', tags);
  useEffect(() => {
    Tag(tags);
  });
  return (
    <Container>
      <Card>
        <CardHeader>Add a Style</CardHeader>
        <CardBody>
          <form>
            <FormControl>
              <FormLabel>Name of the style:</FormLabel>
              <Input type="text"></Input>
            </FormControl>
            <FormControl>
              <FormLabel></FormLabel>
              <Input type="text"></Input>
            </FormControl>
            <FormControl>
              <FormLabel></FormLabel>
              <Input type="text"></Input>
            </FormControl>
          </form>
        </CardBody>
        <CardFooter>
          <VStack>
            <Text>Example:</Text>
            <Text>{textSample}</Text>
          </VStack>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default StyleForm;

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

type TextDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

type TextDecorationLineOption =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'blink';

type ConditionalCombination<
  Input extends string,
  ToPluck extends string | never = never,
  Filtered extends string = Exclude<Input, ToPluck>,
  Reference extends string = Filtered
> = Input extends any
  ? Input extends ToPluck
    ? `${Input}`
    :
        | `${Input}`
        | `${Input} ${ConditionalCombination<Exclude<Reference, Input>>}`
  : never;

type TextDecorationLine = ConditionalCombination<
  TextDecorationLineOption,
  'none'
>;

type MinimalDecoration = {
  textDecoration?: string;
  textShadow?: string;
};
type GranularDecoration = {
  textDecorationColor: string;
  textDecorationLine: TextDecorationLine;
  textDecorationStyle: TextDecorationStyle;
  textDecorationThickness: string;
};

type HighlightCommon = {
  color: string;
  backgroundColor: string;
};

export type HighlightStyle = (MinimalDecoration | GranularDecoration) &
  HighlightCommon;

const foo: HighlightStyle = {
  color: 'test',
  backgroundColor: 'backgroundtest',
  textDecoration: 'textDecorationTest',
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
  const style: HighlightStyle = {
    backgroundColor: 'red',
    color: 'black',
    textDecorationColor: 'blue',
    textDecorationLine: 'underline overline',
    textDecorationThickness: '3px',
    textDecorationStyle: 'dotted',
  };

  const tags = randomWords.map((word, index) => {
    return { text: word, style: style };
  });
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

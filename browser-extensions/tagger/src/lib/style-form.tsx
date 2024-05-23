import { Tag } from '../tagger';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

/* eslint-disable-next-line */
export interface StyleFormProps {}

type TextDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

const TextDecorationLineOption = [
  'none',
  'underline',
  'overline',
  'line-through',
  'blink',
] as const;

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
  (typeof TextDecorationLineOption)[number],
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
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<HighlightStyle>({
    defaultValues: { backgroundColor: 'yellow', color: 'black' },
  });

  const randomWords = pickRandomWords(textSample);

  const style = watch();

  const tags = randomWords.map((word, index) => {
    return { text: word, style: style };
  });
  console.log('style is: ', style);
  console.log('textDecorationThickness', style.textDecorationThickness);
  useEffect(() => {
    Tag(tags);
  });
  console.log(watch());
  return (
    <Container>
      <Card>
        <CardHeader>Add a Style</CardHeader>
        <CardBody>
          <form>
            <FormControl>
              <FormLabel>Name of the style:</FormLabel>
              <Input type="text"></Input>
              <FormHelperText>
                What is entered here will be how this style is referenced in
                future use.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Text Decoration Line</FormLabel>
              <CheckboxGroup colorScheme="green">
                <HStack>
                  <Checkbox
                    textDecorationLine={'none'}
                    value="none"
                    {...register('textDecorationLine', {
                      setValueAs(value) {
                        console.log('underline value is: ', value);
                        return value;
                      },
                    })}
                  >
                    none
                  </Checkbox>
                  <Checkbox
                    textDecorationLine={'underline'}
                    textDecorationThickness={style.textDecorationThickness}
                    value="underline"
                    {...register('textDecorationLine', {
                      setValueAs(value) {
                        console.log('underline value is: ', value);
                        return value;
                      },
                    })}
                  >
                    underline
                  </Checkbox>
                  <Checkbox
                    value="overline"
                    textDecorationLine={'overline'}
                    textDecorationThickness={style.textDecorationThickness}
                    {...register('textDecorationLine', {
                      setValueAs(value) {
                        console.log('overline value is: ', value);
                        return value;
                      },
                    })}
                  >
                    overline
                  </Checkbox>
                  <Checkbox
                    textDecorationLine={'line-through'}
                    textDecorationThickness={style.textDecorationThickness}
                    value="line-through"
                    {...register('textDecorationLine', {
                      setValueAs(value) {
                        console.log('underline value is: ', value);
                        return value;
                      },
                    })}
                  >
                    line-through
                  </Checkbox>
                </HStack>
              </CheckboxGroup>
              <FormHelperText>
                Add an underline, overline and/or line-through for particular
                emphasis.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Text Decoration Color</FormLabel>
              <Input type="text" {...register('textDecorationColor')}></Input>
              <FormHelperText>
                Set a specific color for the underline, overline and/or
                line-through.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Text Decoration Style</FormLabel>
              <Input type="text" {...register('textDecorationStyle')}></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Text Decoration Thickness</FormLabel>
              <Input
                type="text"
                {...register('textDecorationThickness')}
              ></Input>
              <FormHelperText>
                How thick the underline, overline and/or line-through should be.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Background Color</FormLabel>
              <Input type="text" {...register('backgroundColor')}></Input>
              <FormHelperText>The highlight itself.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Color</FormLabel>
              <Input type="text" {...register('color')}></Input>
              <FormHelperText>The color of the text.</FormHelperText>
            </FormControl>
          </form>
        </CardBody>
        <CardFooter>
          <VStack>
            <Heading as="h6" size="lg">
              Demo:
            </Heading>
            <Text>{textSample}</Text>
          </VStack>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default StyleForm;

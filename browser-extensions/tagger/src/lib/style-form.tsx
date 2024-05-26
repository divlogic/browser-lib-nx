import { Tag } from '../tagger';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleFormFields, StyleFormSchema } from '../schemas/style-schemas';

/* eslint-disable-next-line */
export interface StyleFormProps {}

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
    handleSubmit,
    formState: { errors },
  } = useForm<StyleFormFields>({
    defaultValues: {
      backgroundColor: 'yellow',
      color: 'black',
      textDecorationLine: ['none'],
    },
    resolver: zodResolver(StyleFormSchema),
  });
  console.log('Errors is: ', errors);

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
  return (
    <Container>
      <Card>
        <CardHeader>Add a Style</CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit((data) => {
              console.log('Data is: ', data);
            })}
          >
            <FormControl isInvalid={'name' in errors}>
              <FormLabel>Name of the style:</FormLabel>
              <Input type="text"></Input>
              {'name' in errors && (
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              )}
              <FormHelperText>
                What is entered here will be how this style is referenced in
                future use.
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={'textDecorationLine' in errors}>
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
              {'textDecorationLine' in errors ? (
                <FormErrorMessage>
                  {errors?.textDecorationLine?.message}
                </FormErrorMessage>
              ) : null}
              <FormHelperText>
                Add an underline, overline and/or line-through for particular
                emphasis.
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={'textDecorationColor' in errors}>
              <FormLabel>Text Decoration Color</FormLabel>
              <Input type="text" {...register('textDecorationColor')}></Input>
              {'textDecorationColor' in errors && (
                <FormErrorMessage>
                  {errors?.textDecorationColor?.message}
                </FormErrorMessage>
              )}
              <FormHelperText>
                Set a specific color for the underline, overline and/or
                line-through.
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={'textDecorationStyle' in errors}>
              <FormLabel>Text Decoration Style</FormLabel>
              <RadioGroup>
                <HStack>
                  <Radio value="" {...register('textDecorationStyle')}>
                    <Text textDecorationLine="underline">None</Text>
                  </Radio>
                  <Radio value="solid" {...register('textDecorationStyle')}>
                    <Text
                      textDecorationLine={'underline'}
                      textDecorationStyle="solid"
                    >
                      Solid
                    </Text>
                  </Radio>
                  <Radio value="double" {...register('textDecorationStyle')}>
                    <Text
                      textDecorationLine={'underline'}
                      textDecorationStyle="double"
                    >
                      Double
                    </Text>
                  </Radio>
                  <Radio value="dotted" {...register('textDecorationStyle')}>
                    <Text
                      textDecorationLine={'underline'}
                      textDecorationStyle="dotted"
                    >
                      Dotted
                    </Text>
                  </Radio>
                  <Radio value="dashed" {...register('textDecorationStyle')}>
                    <Text
                      textDecorationLine={'underline'}
                      textDecorationStyle="dashed"
                    >
                      Dashed
                    </Text>
                  </Radio>
                  <Radio value="wavy" {...register('textDecorationStyle')}>
                    <Text
                      textDecorationLine={'underline'}
                      textDecorationStyle="wavy"
                    >
                      Wavy
                    </Text>
                  </Radio>
                </HStack>
              </RadioGroup>
              {/* <Input type="text" {...register('textDecorationStyle')}></Input> */}
              {'textDecorationStyle' in errors && (
                <FormErrorMessage>
                  {errors?.textDecorationStyle?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={'textDecorationThickness' in errors}>
              <FormLabel>Text Decoration Thickness</FormLabel>
              <Input
                type="text"
                {...register('textDecorationThickness')}
              ></Input>
              {'textDecorationThickness' in errors && (
                <FormErrorMessage>
                  {errors?.textDecorationThickness?.message}
                </FormErrorMessage>
              )}
              <FormHelperText>
                How thick the underline, overline and/or line-through should be.
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={'backgroundColor' in errors}>
              <FormLabel>Background Color</FormLabel>
              <Input type="text" {...register('backgroundColor')}></Input>
              {'backgroundColor' in errors ? (
                <FormErrorMessage>
                  {errors.backgroundColor?.message}
                </FormErrorMessage>
              ) : null}
              <FormHelperText>The highlight itself.</FormHelperText>
            </FormControl>
            <FormControl isInvalid={'color' in errors}>
              <FormLabel>Color</FormLabel>
              <Input type="text" {...register('color')}></Input>
              {'color' in errors ? (
                <FormErrorMessage>{errors.color?.message}</FormErrorMessage>
              ) : (
                <FormHelperText>The color of the text.</FormHelperText>
              )}
            </FormControl>
            <Button type="submit">Save</Button>
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

import Color from 'colorjs.io';
import {
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Dispatch, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Action } from '../form-reducer';
import { tag } from '../models/tag';
type Inputs = {
  text: string;
  color: string;
};
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function AddTagForm(props: { dispatcher: Dispatch<Action> }) {
  const dispatch = props.dispatcher;
  const defaultColor = useMemo(() => {
    const bgColor = new Color('hsl', [
      getRandomArbitrary(0, 360),
      getRandomArbitrary(0, 100),
      getRandomArbitrary(0, 100),
    ]);
    const bgColorString = bgColor.toString();
    return bgColorString;
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      text: '',
      color: defaultColor,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data: {
    text: string;
    color?: string;
  }) => {
    const result = (await tag.add(data)) as number;
    dispatch({ type: 'added', payload: { data: { id: result, ...data } } });
    reset();
  };

  return (
    <Container>
      <Card bgColor={'gray.50'}>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.text}>
              <FormLabel>Add tag:</FormLabel>
              <Input
                type="text"
                {...register('text', { required: true })}
              ></Input>
              <FormErrorMessage>
                {errors?.text?.type === 'required' && 'Some text is required.'}
              </FormErrorMessage>
              <Flex m={2}>
                <Spacer></Spacer>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel>Pick a color:</FormLabel>
              <Input type="text" {...register('color')}></Input>
              <Flex m={2}>
                <Spacer></Spacer>
              </Flex>
            </FormControl>
            <HStack justify={'start'}>
              <Button bgColor="green.300" type="submit">
                Add
              </Button>
              <Container>
                <HStack justify={'center'}>
                  <Text>Example: </Text>
                  <Text bgColor={watch('color')}>{watch('text')}</Text>
                </HStack>
              </Container>
            </HStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

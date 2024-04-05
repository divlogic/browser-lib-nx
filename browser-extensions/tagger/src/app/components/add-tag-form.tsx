import Color from 'colorjs.io';
import {
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { Dispatch, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Action, TagType } from '../form-reducer';
import { tag } from '../models/tag';
type Inputs = {
  text: string;
  textRequired: string;
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
    const result: number = await tag.add(data);
    dispatch({ type: 'added', payload: { data: { id: result, ...data } } });
  };

  return (
    <Container>
      <Card bgColor={defaultColor}>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel>Add tag:</FormLabel>
              <Input type="text" {...register('text')}></Input>
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
            <Button bgColor="green.300" type="submit">
              Add
            </Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

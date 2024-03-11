import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { Dispatch } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Action, TagType } from '../form-reducer';
import { tag } from '../../db';
type Inputs = {
  text: string;
  textRequired: string;
};

export function AddTagForm(props: { dispatcher: Dispatch<Action> }) {
  const dispatch = props.dispatcher;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: { text: string }) => {
    const result: number = await tag.add(data);
    dispatch({ type: 'added', payload: { data: { id: result, ...data } } });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>Add tag:</FormLabel>
          <Input type="text" {...register('text')}></Input>
          <Flex m={2}>
            <Spacer></Spacer>
            <Button bgColor="green.300" type="submit">
              Add
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Container>
  );
}

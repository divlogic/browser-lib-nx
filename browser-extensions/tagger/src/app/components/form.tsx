import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
type Inputs = {
  text: string;
  textRequired: string;
};

export function AddTagForm(props) {
  const dispatch = props.dispatcher;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    dispatch({ ...data, type: 'added' });
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

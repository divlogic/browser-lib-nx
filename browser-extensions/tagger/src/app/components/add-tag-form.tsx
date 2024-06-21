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
  Select,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Dispatch, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Action } from '../tags-reducer';
import { tagModel } from '../models/tag';
import { StylesContext } from '../providers';

type Inputs = {
  text: string;
  style: string;
};

export function AddTagForm(props: { dispatcher: Dispatch<Action> }) {
  const styles = useContext(StylesContext);
  const dispatch = props.dispatcher;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      text: '',
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data: {
    text: string;
    style?: string;
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
              <FormLabel>Pick a style:</FormLabel>
              <Select placeholder="placeholder" {...register('style')}>
                {styles.map((style) => {
                  return <option value={style.name}>{style.name}</option>;
                })}
              </Select>
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
                  <Text>{watch('text')}</Text>
                </HStack>
              </Container>
            </HStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

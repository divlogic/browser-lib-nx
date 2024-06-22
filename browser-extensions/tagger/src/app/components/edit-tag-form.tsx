import { Dispatch } from 'react';
import { Action } from '../tags-reducer';
import { TagModelType } from '../../schemas/tag-schemas';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Highlight,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Tag } from '../models/tag';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CheckIcon } from '@chakra-ui/icons';

/* eslint-disable-next-line */
export interface EditTagFormProps {
  tag: TagModelType;
  dispatch: Dispatch<Action>;
}

type Inputs = {
  color: string;
};

export function EditTagForm(props: EditTagFormProps) {
  const { tag, dispatch } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const model = new Tag();

    const updatedTagModel = { ...tag, color: data.color };
    await model.update(updatedTagModel);
    dispatch({
      type: 'edited',
      payload: { data: updatedTagModel },
    });
    reset();
  };
  console.log('Errors is: ', errors);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <FormControl>
              <FormLabel>Text:</FormLabel>
              <Input defaultValue={tag.text} disabled />
            </FormControl>
          </CardHeader>
          <CardBody>
            <FormControl isInvalid={!!errors?.color}>
              <FormLabel>Color:</FormLabel>
              <Input
                defaultValue={tag.color}
                {...register('color', {
                  required: 'The color field is required.',
                })}
              />
              <FormErrorMessage>{errors?.color?.message}</FormErrorMessage>
            </FormControl>
          </CardBody>
          <CardFooter>
            <VStack>
              <Text>
                <Highlight styles={{ bg: tag.color }} query="test">
                  Highlight Example: test
                </Highlight>
              </Text>
              <Button type="submit" bgColor={'green.300'}>
                <HStack>
                  <Text>Save</Text>
                  <CheckIcon></CheckIcon>
                </HStack>
              </Button>
            </VStack>
          </CardFooter>
        </Card>
      </form>
    </Container>
  );
}

export default EditTagForm;

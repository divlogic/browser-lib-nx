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
import { useForm, SubmitHandler } from 'react-hook-form';
import { useStylesData, useTagActions } from '../providers';
import HighlightExample from '../../lib/highlight-example';
import { HighlightStyle } from '../../schemas';

type Inputs = {
  text: string;
  style_name: string;
};

export function AddTagForm() {
  const styles = useStylesData();
  const actions = useTagActions();
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
    style_name: string;
  }) => {
    await actions.add(data);
    reset();
  };

  const currentStyle = styles.find(
    (style) => style.name === watch('style_name')
  );
  const formattedStyleObj = { [watch('style_name')]: currentStyle } as {
    [key: string]: HighlightStyle;
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
              <Select
                {...register('style_name')}
                disabled={styles.length === 0}
              >
                {styles.map((style, index) => {
                  return (
                    <option key={index} value={style.name}>
                      {style.name}
                    </option>
                  );
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
                  <HighlightExample
                    tag={{
                      text: watch('text'),
                      style_name: watch('style_name'),
                    }}
                    style={
                      typeof currentStyle !== 'undefined'
                        ? formattedStyleObj
                        : null
                    }
                  ></HighlightExample>
                </HStack>
              </Container>
            </HStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

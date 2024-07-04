import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Highlight,
  Input,
  Select,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CheckIcon } from '@chakra-ui/icons';
import { useStylesData, useTagActions } from '../providers';
import { TagType } from '../../schemas/tag-schemas';
import HighlightExample from '../../lib/highlight-example';
import { HighlightStyle } from '../../schemas';

/* eslint-disable-next-line */
export interface EditTagFormProps {
  tag: TagType;
}

type Inputs = {
  style_name: string;
};

export function EditTagForm(props: EditTagFormProps) {
  const { tag } = props;
  const styles = useStylesData();
  const actions = useTagActions();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const updatedTagModel = { ...tag, color: data.style_name };
    await actions.edit(updatedTagModel);
    reset();
  };
  console.log('Errors is: ', errors);

  const currentStyle = styles.find(
    (style) => style.name === watch('style_name')
  );
  const formattedStyleObj = { [watch('style_name')]: currentStyle } as {
    [key: string]: HighlightStyle;
  };
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
            <FormControl>
              <FormLabel>Pick a style:</FormLabel>
              <Select {...register('style_name')}>
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
          </CardBody>
          <CardFooter>
            <VStack>
              <Text>
                {currentStyle && (
                  <HighlightExample
                    tag={{ text: tag.text, style_name: currentStyle.name }}
                    style={formattedStyleObj}
                  ></HighlightExample>
                )}
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

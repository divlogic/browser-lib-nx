import { Dispatch } from 'react';
import { Action, TagType } from '../form-reducer';
import { FormControl, FormLabel, HStack, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

/* eslint-disable-next-line */
export interface EditTagFormProps {
  tag: TagType;
  dispatch: Dispatch<Action>;
}

export function EditTagForm(props: EditTagFormProps) {
  return (
    <HStack>
      <form>
        <FormControl>
          <HStack>
            <FormLabel>{props.tag.text}</FormLabel>
          </HStack>
        </FormControl>
      </form>
      <IconButton
        aria-label="delete"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          props.dispatch({ type: 'removed', payload: { data: props.tag } });
        }}
        icon={<DeleteIcon />}
      ></IconButton>
    </HStack>
  );
}

export default EditTagForm;

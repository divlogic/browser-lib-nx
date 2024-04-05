import { Dispatch } from 'react';
import { Action, TagType } from '../form-reducer';
import { FormControl, FormLabel, HStack, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { tag } from '../models/tag';

/* eslint-disable-next-line */
export interface EditTagFormProps {
  tag: TagType;
  dispatch: Dispatch<Action>;
  index: number;
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
        onClick={async (e) => {
          e.preventDefault();
          await tag.remove(props.index);
          props.dispatch({ type: 'removed', payload: { data: props.tag } });
        }}
        icon={<DeleteIcon />}
      ></IconButton>
    </HStack>
  );
}

export default EditTagForm;

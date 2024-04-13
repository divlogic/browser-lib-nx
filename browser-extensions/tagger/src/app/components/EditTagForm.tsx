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
          if (typeof props.tag.id === 'number') {
            await tag.remove(props.tag.id);
            props.dispatch({ type: 'removed', payload: { data: props.tag } });
          } else {
            throw new Error('unexpected situation: id is not a number');
          }
        }}
        icon={<DeleteIcon />}
      ></IconButton>
    </HStack>
  );
}

export default EditTagForm;

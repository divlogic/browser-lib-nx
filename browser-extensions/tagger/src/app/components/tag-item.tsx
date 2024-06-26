import { Dispatch, useState } from 'react';
import { Action } from '../tags-reducer.OLD';
import { TagType } from '../../schemas/tag-schemas';
import {
  Container,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { tagModel } from '../models/tag';
import EditTagForm from './edit-tag-form';

/* eslint-disable-next-line */
export interface TagItemProps {
  tag: TagType;
  dispatch: Dispatch<Action>;
  index: number;
}

export function TagItem(props: TagItemProps) {
  const [editing, setEditing] = useState(false);
  return (
    <Container>
      <HStack>
        <form>
          <FormControl>
            <HStack>
              <FormLabel>{props.tag.text}</FormLabel>
            </HStack>
          </FormControl>
        </form>
        <IconButton
          aria-label="edit"
          size="sm"
          onClick={async (e) => {
            e.preventDefault();
            setEditing(!editing);
          }}
          icon={<EditIcon />}
        />
        <IconButton
          aria-label="delete"
          size="sm"
          onClick={async (e) => {
            e.preventDefault();
            console.log('EditTagForm props: ', props);
            if (typeof props.tag.id === 'number') {
              await tagModel.remove(props.tag.id);
              props.dispatch({
                type: 'removed',
                payload: { data: props.tag },
              });
            } else {
              throw new Error('unexpected situation: id is not a number');
            }
          }}
          icon={<DeleteIcon />}
        />
      </HStack>
      {editing ? <EditTagForm {...props} /> : null}
    </Container>
  );
}

export default TagItem;

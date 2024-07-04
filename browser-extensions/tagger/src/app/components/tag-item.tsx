import { useState } from 'react';
import { TagType } from '../../schemas/tag-schemas';
import {
  Container,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import EditTagForm from './edit-tag-form';
import { useTagActions } from '../providers';

/* eslint-disable-next-line */
export interface TagItemProps {
  tag: TagType;
  index: number;
}

export function TagItem(props: TagItemProps) {
  const [editing, setEditing] = useState(false);
  const tagActions = useTagActions();
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
            await tagActions.remove(props.tag);
          }}
          icon={<DeleteIcon />}
        />
      </HStack>
      {editing ? <EditTagForm {...props} /> : null}
    </Container>
  );
}

export default TagItem;

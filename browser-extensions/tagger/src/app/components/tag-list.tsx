import { Dispatch } from 'react';
import { Action, TagType } from '../form-reducer';
import EditTagForm from './EditTagForm';

/* eslint-disable-next-line */
export interface TagListProps {
  tags: TagType[];
  dispatch: Dispatch<Action>;
}

export function TagList(props: TagListProps) {
  const { tags, dispatch } = props;
  return (
    <>
      {tags.map((tag, index) => {
        return <Tag tag={tag} dispatch={dispatch} key={index} />;
      })}
    </>
  );
}
function Tag(props: { tag: TagType; dispatch: Dispatch<Action>; key: number }) {
  const { tag, dispatch } = props;
  return <EditTagForm tag={tag} dispatch={dispatch}></EditTagForm>;
}

export default TagList;

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
        return <Tag tag={tag} dispatch={dispatch} index={index} key={index} />;
      })}
    </>
  );
}
function Tag(props: {
  tag: TagType;
  dispatch: Dispatch<Action>;
  index: number;
}) {
  const { tag, dispatch } = props;
  return (
    <EditTagForm
      tag={tag}
      dispatch={dispatch}
      index={props.index}
    ></EditTagForm>
  );
}

export default TagList;

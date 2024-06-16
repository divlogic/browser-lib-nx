import { Dispatch } from 'react';
import { Action, TagType } from '../tags-reducer';
import TagItem from './tag-item';

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
        return (
          <TagItem tag={tag} dispatch={dispatch} index={index} key={index} />
        );
      })}
    </>
  );
}

export default TagList;

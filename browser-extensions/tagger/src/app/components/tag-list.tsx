import TagItem from './tag-item';
import { useTagsData, useTagsDispatch } from '../providers';

/* eslint-disable-next-line */
export interface TagListProps {}

export function TagList() {
  const tags = useTagsData();
  const dispatch = useTagsDispatch();
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

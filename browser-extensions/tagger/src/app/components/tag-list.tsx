import TagItem from './tag-item';
import { useTagsData } from '../providers';

/* eslint-disable-next-line */
export interface TagListProps {}

export function TagList() {
  const tags = useTagsData();
  return (
    <>
      {tags.map((tag, index) => {
        return <TagItem tag={tag} index={index} key={index} />;
      })}
    </>
  );
}

export default TagList;

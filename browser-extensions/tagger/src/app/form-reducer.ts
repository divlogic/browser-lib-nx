export function tagsReducer(
  tags: { text: string }[],
  action: { type: string; text: string }
) {
  if (action.type === 'added') {
    return [
      ...tags,
      {
        text: action.text,
      },
    ];
  } else if (action.type === 'removed') {
    const updatedTags = tags.filter((tag) => tag.text != action.text);
    return updatedTags;
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}

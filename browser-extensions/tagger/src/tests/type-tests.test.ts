import { HighlightSchema } from '../types/style-types';

describe('HighlightSchema', () => {
  it('It should allow minimal configuration', () => {
    const instance = HighlightSchema.parse({ backgroundColor: 'red' });
    expect(instance).toBeTruthy();
  });
});

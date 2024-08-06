import {
  HighlightGranular,
  HighlightSchema,
  TextDecorationLineSchema,
  TextDecorationStyleSchema,
  UnsavedHighlightSchema,
} from '../schemas/style-schemas';

describe('TextDecorationLineSchema', () => {
  it('It should be optional', () => {
    const instance = TextDecorationLineSchema.safeParse(undefined);
    expect(instance.success).toBeTruthy();
  });

  it('It should only allow specific string literals', () => {
    let instance = TextDecorationLineSchema.safeParse(['none']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['underline']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['overline']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['line-through']);
    expect(instance.success).toBeTruthy();
  });

  it('It should only allow none OR any non repeating combination', () => {
    let instance = TextDecorationLineSchema.safeParse(['none']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['none', 'underline']);
    expect(instance.success).toBeFalsy();

    instance = TextDecorationLineSchema.safeParse(['underline', 'overline']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['overline', 'line-through']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['line-through', 'overline']);
    expect(instance.success).toBeTruthy();

    instance = TextDecorationLineSchema.safeParse(['underline', 'underline']);
    expect(instance.success).toBeFalsy();
  });
});

describe('TextDecorationStyleSchema', () => {
  it('', () => {
    let instance = TextDecorationStyleSchema.safeParse('bad');
    expect(instance.success).toBeFalsy();

    instance = TextDecorationStyleSchema.safeParse('solid');
    expect(instance.success).toBeTruthy();

    instance = TextDecorationStyleSchema.safeParse('double');
    expect(instance.success).toBeTruthy();

    instance = TextDecorationStyleSchema.safeParse('dotted');
    expect(instance.success).toBeTruthy();

    instance = TextDecorationStyleSchema.safeParse('dashed');
    expect(instance.success).toBeTruthy();

    instance = TextDecorationStyleSchema.safeParse('wavy');
    expect(instance.success).toBeTruthy();
  });
});

describe('HighlightGranular', () => {
  it('Should allow access to all members', () => {
    const instance = HighlightGranular.safeParse({
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: 'wavy',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
    expect(instance.data).toHaveProperty('textDecorationStyle', 'wavy');
  });

  it('Should have most elements be optional', () => {
    const instance = HighlightGranular.safeParse({
      backgroundColor: 'red',
    });
    expect(instance.success).toBeTruthy();
    expect(instance.data).toEqual({ backgroundColor: 'red' });
  });
});

describe('HighlightSchema', () => {
  it('It should allow minimal configuration', () => {
    const instance = HighlightSchema.safeParse({ backgroundColor: 'red' });
    expect(instance).toBeTruthy();
  });

  it('It should use TextDecorationLineSchema', () => {
    let instance = HighlightSchema.safeParse({
      backgroundColor: 'red',
      textDecorationLine: ['none'],
    });
    expect(instance).toBeTruthy();

    instance = HighlightSchema.safeParse({
      backgroundColor: 'red',
      textDecorationLine: ['none'],
    });
    expect(instance).toBeTruthy();
  });

  it('It should allow granular configuration', () => {
    let instance = HighlightSchema.safeParse({
      id: 1,
      name: 'test_schema',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: 'wavy',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
    expect(instance).toHaveProperty('data');
    expect(instance.data).toHaveProperty('textDecorationStyle', 'wavy');
    expect(instance.data).toHaveProperty('id', 1);
    expect(instance.data).toHaveProperty('name', 'test_schema');

    instance = HighlightSchema.safeParse({
      id: 2,
      name: 'test2',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: '',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
  });
});

describe('Unsaved HighlightSchema', () => {
  it('It should allow minimal configuration', () => {
    const instance = HighlightSchema.safeParse({ backgroundColor: 'red' });
    expect(instance).toBeTruthy();
  });

  it('It should use TextDecorationLineSchema', () => {
    let instance = HighlightSchema.safeParse({
      backgroundColor: 'red',
      textDecorationLine: ['none'],
    });
    expect(instance).toBeTruthy();

    instance = HighlightSchema.safeParse({
      backgroundColor: 'red',
      textDecorationLine: ['none'],
    });
    expect(instance).toBeTruthy();
  });

  it('It should allow granular configuration', () => {
    let instance = HighlightSchema.safeParse({
      id: 1,
      name: 'test-NAME',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: 'wavy',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
    expect(instance).toHaveProperty('data');
    expect(instance.data).toHaveProperty('textDecorationStyle', 'wavy');

    instance = HighlightSchema.safeParse({
      id: 2,
      name: 't3stname',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: '',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
  });

  it('UnsavedHighlightSchema should not require an id', () => {
    let instance = UnsavedHighlightSchema.safeParse({
      name: 'test-NAME',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: 'wavy',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    console.log(instance.error);
    expect(instance.success).toBeTruthy();
    expect(instance).toHaveProperty('data');
    expect(instance.data).toHaveProperty('textDecorationStyle', 'wavy');

    instance = UnsavedHighlightSchema.safeParse({
      name: 't3stname',
      backgroundColor: 'red',
      textDecorationLine: ['none'],
      textDecorationStyle: '',
      textDecorationColor: 'green',
      textDecorationThickness: '2px',
    });
    expect(instance.success).toBeTruthy();
  });
});

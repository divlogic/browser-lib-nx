import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './color-picker';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ColorPicker> = {
  component: ColorPicker,
  title: 'ColorPicker',
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Primary = {
  args: { label: 'A color picker story' },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ColorPicker!/gi)).toBeTruthy();
  },
};

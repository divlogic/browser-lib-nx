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

export const Black = {
  args: { label: 'A color picker story', startingColor: 'black' },
};

export const White: Story = {
  args: { startingColor: 'white' },
};

export const Green: Story = {
  args: { startingColor: 'green' },
};

export const Yellow: Story = {
  args: { startingColor: 'yellow' },
};

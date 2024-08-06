import type { Meta, StoryObj } from '@storybook/react';
import { StyleForm } from './style-form';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof StyleForm> = {
  component: StyleForm,
  title: 'StyleForm',
};
export default meta;
type Story = StoryObj<typeof StyleForm>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to StyleForm!/gi)).toBeTruthy();
  },
};

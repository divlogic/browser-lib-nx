import { createLazyFileRoute } from '@tanstack/react-router';
import { ColorDemo } from '../app/components/color-demo';

export const Route = createLazyFileRoute('/color-demo')({
  component: ColorDemo,
});

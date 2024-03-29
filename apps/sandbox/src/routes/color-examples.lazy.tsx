import { createLazyFileRoute } from '@tanstack/react-router';
import ColorExample from '../app/components/color-example';

export const Route = createLazyFileRoute('/color-examples')({
  component: ColorExample,
});

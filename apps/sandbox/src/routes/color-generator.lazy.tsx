import { createLazyFileRoute } from '@tanstack/react-router';
import { ColorGeneratorContainer } from '../app/components/color-generator-container';

export const Route = createLazyFileRoute('/color-generator')({
  component: ColorGeneratorContainer,
});

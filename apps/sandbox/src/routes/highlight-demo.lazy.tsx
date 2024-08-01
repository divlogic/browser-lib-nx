import { createLazyFileRoute } from '@tanstack/react-router';
import { HighlightDemo } from '../app/components/highlight-demo';

export const Route = createLazyFileRoute('/highlight-demo')({
  component: HighlightDemo,
});

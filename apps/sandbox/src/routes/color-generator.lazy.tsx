import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/color-generator')({
  component: () => <div>Hello /color-generator!</div>
})
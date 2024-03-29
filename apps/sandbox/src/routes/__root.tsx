import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink as BaseBreadcrumbLink,
  Container,
  BreadcrumbLinkProps,
} from '@chakra-ui/react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { PathOptions } from '../main';
import { ComponentProps, FC, PropsWithChildren } from 'react';

const BreadcrumbLink = ({
  ...props
}: { to: PathOptions } & BreadcrumbLinkProps) => {
  return <BaseBreadcrumbLink as={Link} {...props} />;
};

const RootComponent = () => {
  return (
    <>
      <Container>
        <Breadcrumb separator={'-'} padding={'1rem'}>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink to="/color-examples">Color Examples</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink to="/color-generator">
              Color Generator
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Container>
      <hr />
      <Container maxWidth={'container.lg'}>
        <Outlet />
      </Container>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});

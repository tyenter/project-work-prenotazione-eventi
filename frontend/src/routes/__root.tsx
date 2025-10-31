// src/routes/__root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router';
import App from '../App';

export const Route = createRootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
});

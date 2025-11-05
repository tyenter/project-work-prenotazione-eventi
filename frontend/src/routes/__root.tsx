import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import App from '../App'

export interface MyRouterContext {
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
})
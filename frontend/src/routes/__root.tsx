import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import App from '../App'

export interface MyRouterContext {
  accessToken: string | null 
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <App>
      <Outlet />
    </App>
  ),
})
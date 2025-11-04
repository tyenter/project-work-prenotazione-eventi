import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    // else if...
  },
  component: () => <Outlet />,
})

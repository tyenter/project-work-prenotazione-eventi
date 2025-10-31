import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/eventi/')({
  component: RouteComponent,
})

function RouteComponent() {


  return <div>Hello "/eventi"!</div>
}

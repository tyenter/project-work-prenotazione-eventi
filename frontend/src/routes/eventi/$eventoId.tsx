import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/eventi/$eventoId')({
  component: RouteComponent,
})

function RouteComponent() {
   const { eventoId } = Route.useParams()
  return <div>Hello "/eventi/{eventoId}"!</div>
}

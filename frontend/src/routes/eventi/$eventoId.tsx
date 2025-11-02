import { createFileRoute } from '@tanstack/react-router'
import { useUseQueries } from '../../hooks/useUseQueries'

export const Route = createFileRoute('/eventi/$eventoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventoId } = Route.useParams()
  const {useGetEventById} = useUseQueries()
  const {data: event, isLoading} = useGetEventById(eventoId)

  if(isLoading) 
    return <>Caricamento...</>
  if(!event) 
    return <p>Evento inesistente</p>

  return <div>{JSON.stringify(event)}</div>
          
}




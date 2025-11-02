import { useQuery } from "@tanstack/react-query"
import { apiEvents } from "../api/httpEventi"

export function useUseQueries(){
  const { getEventById } = apiEvents()

  const useGetEventById = (eventoId: string | undefined) =>
    useQuery({
        queryKey: ["event", eventoId],
        queryFn: () => getEventById(eventoId!),
        enabled: !!eventoId, 
        retry: 1, 
        staleTime: 5 * 60 * 1000,
    })

  return {
    useGetEventById,

  }
}

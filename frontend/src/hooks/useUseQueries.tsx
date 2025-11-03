import { useQuery } from "@tanstack/react-query"
import { apiEvents } from "../api/httpEventi"

export function useUseQueries(){
  const { getEventById, checkBooking } = apiEvents()

  const useGetEventById = (eventId: string | undefined) =>
    useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventById(eventId!),
        enabled: !!eventId, 
        retry: 1, 
        staleTime: 5 * 60 * 1000,
    })

  const useCheckBooking = (eventId: string | undefined) =>
    useQuery({
        queryKey: ["checkBooking", eventId],
        queryFn: () => checkBooking(eventId!),
        enabled: !!eventId, 
        retry: 1, 
        staleTime: 5 * 60 * 1000,
    })

  return {
    useGetEventById,
    useCheckBooking
  }
}

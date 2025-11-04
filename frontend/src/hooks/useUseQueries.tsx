import { useQuery } from "@tanstack/react-query";
import { apiEvents } from "../api/httpEventi";

export function useUseQueries(){
  const { getEventById, checkBooking,getEvents } = apiEvents()
  type EventsQueryParams = { page?: number; size?: number };


  const useGetEventById = (eventId: string | undefined) =>
    useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventById(eventId!),
        enabled: !!eventId, 
        retry: 1, 
        staleTime: 5 * 60 * 1000,
    })

  const useGetEvents = (params?: EventsQueryParams) =>
      useQuery({
    queryKey: ["events", params?.page ?? 1, params?.size ?? 6],
    queryFn: () => getEvents(params),
    placeholderData: (prev) => prev, 
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
    useCheckBooking,
    useGetEvents
  }
}

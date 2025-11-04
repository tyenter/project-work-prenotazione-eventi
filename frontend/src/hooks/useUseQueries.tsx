import { useQuery } from "@tanstack/react-query";
import { apiEvents } from "../api/httpEventi";

type EventsQueryParams = { page?: number; size?: number };

export function useUseQueries() {
  const { getEventById, getEvents } = apiEvents();

  const useGetEventById = (eventoId?: string) =>
    useQuery({
      queryKey: ["event", eventoId],
      queryFn: () => getEventById(eventoId!),
      enabled: !!eventoId,
    });

  const useGetEvents = (params?: EventsQueryParams) =>
    useQuery({
  queryKey: ["events", params?.page ?? 1, params?.size ?? 6],
  queryFn: () => getEvents(params),
  placeholderData: (prev) => prev, 
})
   

  return { useGetEventById, useGetEvents };
}

import { useMutation } from "@tanstack/react-query"
import { apiEvents } from "../api/httpEventi"
import type { IBookEvent } from "../models/models"

export function useUseMutations(){
  const {  bookEvent, removeEvent } = apiEvents()

  const useBookEventMutation = useMutation({
        mutationKey: ['bookEvent'],
        mutationFn: async (body: IBookEvent) => await bookEvent(body),
        retry: 1,
    })

  const useRemoveEventMutation = useMutation({
      mutationKey: ['removeEvent'],
      mutationFn: async (eventId: string) => await removeEvent(eventId),
      retry: 1,
    })

  return {
    bookEventMutation: useBookEventMutation,
    removeEventMutation: useRemoveEventMutation
  }
}

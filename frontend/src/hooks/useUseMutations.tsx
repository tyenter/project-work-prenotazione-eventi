import { useMutation } from "@tanstack/react-query"
import { apiEvents } from "../api/httpEventi"
import type { IBookEvent } from "../models/models"

export function useUseMutations(){
  const {  bookEvent } = apiEvents()

  const useBookEventMutation = useMutation({
        mutationKey: ['bookEvent'],
        mutationFn: async (body: IBookEvent) => await bookEvent(body),
        retry: 1,
    })

  return {
    bookEventMutation: useBookEventMutation
  }
}

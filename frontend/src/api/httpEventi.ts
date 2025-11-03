import { useAxios } from "../hooks/useAxios"
import type { IBookEvent, IEvent } from "../models/models"
import axiosClient from "./axiosClient"


export function apiEvents() {
  const axiosClientWithAuth = useAxios()

  const getEventById = async (eventId: string): Promise<IEvent> => 
    (await (axiosClient.get(`/eventi/${eventId}`))).data

  const checkBooking = async (eventId: string): Promise<{isBooked: boolean}> => 
    (await (axiosClientWithAuth.get(`/eventi/book/check/${eventId}`))).data

  const bookEvent = async (body: IBookEvent): Promise<void> => {
    await (axiosClientWithAuth.post(`/eventi/book/`,body))
  }
  
  return {
    getEventById,
    checkBooking,
    bookEvent
  }
}
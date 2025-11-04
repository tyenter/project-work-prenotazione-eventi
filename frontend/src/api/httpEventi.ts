import { useAxios } from "../hooks/useAxios"
import type { IBookEvent, IEvent, IEventsRes } from "../models/models"
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
   const getEvents = async (params?: { page?: number; size?: number }): Promise<IEventsRes> =>
    (await axiosClient.get(`/eventi`, { params })).data;
  
  return {
    getEventById,
    checkBooking,
    bookEvent,
    getEvents
  }
}
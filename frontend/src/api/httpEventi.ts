import { useAxios } from "../hooks/useAxios"
import type { EventsQueryParams, IBookEvent, IEvent, IEventsRes } from "../models/models"
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
  
  const getEvents = async (params: EventsQueryParams): Promise<IEventsRes> =>{
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.title) searchParams.append('title', params.title);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    return (await axiosClient.get(`/eventi${queryString}`)).data
  }
  
  return {
    getEventById,
    checkBooking,
    bookEvent,
    getEvents
  }
}
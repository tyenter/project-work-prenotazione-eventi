import { useAxios } from "../hooks/useAxios"
import type { EventsQueryParams, IBookEvent, IEvent, IEventsRes } from "../models/models"
import axiosClientNoToken from "./axiosClientNoToken"


export function apiEvents() {
  const axiosClient = useAxios()

  const getEventById = async (eventId: string): Promise<IEvent> => 
    (await (axiosClientNoToken.get(`/eventi/${eventId}`))).data

  const checkBooking = async (eventId: string): Promise<{isBooked: boolean}> => 
    (await (axiosClient.get(`/eventi/book/check/${eventId}`))).data

  const bookEvent = async (body: IBookEvent): Promise<void> => {
    await (axiosClient.post(`/eventi/book/`,body))
  }
  
  const getEvents = async (params: EventsQueryParams): Promise<IEventsRes> =>{
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.title) searchParams.append('title', params.title);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    return (await axiosClientNoToken.get(`/eventi${queryString}`)).data
  }

  const removeEvent = async (eventId: string): Promise<void> => 
    await axiosClient.post(`/admin/remove-event/${eventId}`)
  
  return {
    getEventById,
    checkBooking,
    bookEvent,
    getEvents,
    removeEvent
  }
}
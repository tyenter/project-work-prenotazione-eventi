import type { IEvent, IEventsRes } from "../models/models"
import axiosClientNoToken from "./axiosClientNoToken"


export function apiEvents() {

  const getEventById = async (eventoId: string): Promise<IEvent> => 
    (await (axiosClientNoToken.get(`/eventi/${eventoId}`))).data


 const getEvents = async (params?: { page?: number; size?: number }): Promise<IEventsRes> =>
    (await axiosClientNoToken.get(`/eventi`, { params })).data;






  
  return {
    getEventById,
    getEvents

  }
}
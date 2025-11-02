import type { IEvent } from "../models/models"
import axiosClientNoToken from "./axiosClientNoToken"


export function apiEvents() {

  const getEventById = async (eventoId: string): Promise<IEvent> => 
    (await (axiosClientNoToken.get(`/eventi/${eventoId}`))).data

  
  return {
    getEventById,

  }
}
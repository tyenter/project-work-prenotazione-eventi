import { WithId } from "mongodb"

export interface IPagination {
    page: number
    size: number
    totPages: number
    totElems: number
}

export interface IEventsQuery {
    page?: number
    size?: number
    title?: string
}

export interface IEvent extends WithId<Document> {
    title: string
    description: string
    date: string
    address: string
    duration: {
        hours: number
        minutes: number
    }
    city: string
    short_description: string
    category: string
}

export interface IEventsRes {
    data: IEvent[]
    pagination: IPagination
}

export interface ICredentials {
    email: string
    password: string
    firstName: string
    lastName: string
    refreshToken?: {
        token: string
        expiresAt: Date
    }
}

export interface IUserInfoPOST {
    // username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface IBookings{
    userId: string,
    eventsBooked: {
        eventId: string,
        people: number
    }[]
}
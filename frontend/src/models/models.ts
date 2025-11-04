export type TLoginError = 
| "NETWORK_ERROR"
| "INVALID_CREDENTIALS"
| "SERVER_ERROR"
| "BAD_REQUEST"
| "AXIOS_ERROR"

export type EventsQueryParams = { 
    page?: number; 
    size?: number, 
    title?: string 
};

export interface IEvent {
    _id: string
    date: Date
    title: string
    description: string
    people: number
    geoLocation: string
    category: string 
}

export interface IEventsRes {
    data: IEvent[]
    pagination: IPagination
}

export interface IPagination {
    page: number
    size: number
    totPages: number
    totElems: number
}

export interface IBookEvent {
    eventId: string,
    people: number
}

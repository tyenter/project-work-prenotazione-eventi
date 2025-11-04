export type TLoginError = 
| "NETWORK_ERROR"
| "INVALID_CREDENTIALS"
| "SERVER_ERROR"
| "BAD_REQUEST"
| "AXIOS_ERROR"


export interface IEvent {
    _id: string;
    title: string;
    description: string;
    date: string;
    address: string;
    duration: string;
    city: string;
    short_description:string;
    category:string
}

export type EventsQueryParams = { 
    page?: number; 
    size?: number, 
    title?: string 
};

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

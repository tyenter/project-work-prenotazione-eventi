import { WithId } from "mongodb"

export interface IPagination {
    page: number
    size: number
    totPages: number
    totElems: number
}

export interface IPaginationQuery {
    page?: number
    size?: number
}

export interface IEvent extends WithId<Document> {
    date: Date
    title: string
    description: string
    people: number
    geoLocation: string
    category: string // maybe enum
}

export interface IEventsRes {
    data: IEvent[],
    pagination: IPagination
}
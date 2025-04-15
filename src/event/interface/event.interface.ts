import { Schema } from "mongoose"

export interface Event {
    title: string,
    description: string,
    date: Date
    location:string,
    capacity: number
    ticketsSold: number
    club: Schema.Types.ObjectId
    tickets: Schema.Types.ObjectId[]
}
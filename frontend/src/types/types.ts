import {Dayjs} from "dayjs";

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string
    member: Member
}

export type Member = {
    user: User,
    school: number,
    classYear: number,
    position: number,
}

export type Show = {
    id: number,
    name: string,
    priority: number,
    date: Dayjs,
    time: string,
    rounds: Round[],
    address: string,
    lions: number,
    performers: Member[],
    point: Member,
    contact: Contact,
    isCampus: boolean,
    isOutOfCity: boolean,
    isOpen: boolean,
    isPending: boolean,
    status: number,
    notes: string,
}

export type Round = {
    id: number,
    time: string
}

export type Contact = {
    firstName: string,
    lastName: string,
    phone: string,
    email: string
}

export type Reimbursement = {
    user: Member,
    showk: Show,
    Amount: number,
    date: Dayjs
    Receipts: string[],
    Completed: boolean,
}

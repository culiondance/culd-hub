import { Reimbursement }from "../../../../types/types";
import {createContext} from "react";

export const ReimbTableContext = createContext(undefined)

export interface ReimbTableContextInterface {
    reimbs: Reimbursement[],
}


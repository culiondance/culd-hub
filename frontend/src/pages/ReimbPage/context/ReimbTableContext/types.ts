import { Reimbursement } from "../../../../types/types";
import { createContext } from "react";




export const ReimbTableContext = createContext(null);


export interface ReimbTableContext_T {
  reimbs: Reimbursement[];
}

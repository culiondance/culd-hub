import { Reimbursement } from "../../../../types/types";
import { createContext, Dispatch} from "react";

export const ReimbTableContext = createContext(null);

export interface ReimbTableContext_T {
  reimbs: Reimbursement[];
  needs_refresh:Dispatch<boolean>;
}

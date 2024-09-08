import React, {createContext, useContext, useEffect, useState} from "react";

const ReimbsTableContext = createContext(undefined);

export default ReimbsTableContext;


export const ReimbsTableProvider: React.FC<props> = ({children} : Props) => {
    // query to get list of reimbursements
    // return list + whether or not we should refresh
}


export const GET_REIMBS = gql``;

import React, {createContext, useContext, useEffect, useState} from "react";

import {gql} from "@apollo/client";
const ReimbsTableContext = createContext(undefined);

export default ReimbsTableContext;


// should just need to query my_reimbs from the server
export const ReimbsTableProvider: React.FC<props> = ({children} : Props) => {
    // query to get list of reimbursements
    // return list + whether or not we should refresh
}




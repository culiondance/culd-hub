import React, {createContext, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../../context/AuthContext";
import {UserContext} from "../../../../context/UserContext";
import { Reimbursement, User }from "../../../../types/types";
import {
    handleApolloError,
    useAuthQuery
} from "../../../../services/graphql";
import { ReimbTableContextInterface } from "./types";

import dayjs from "dayjs";

import {gql} from "@apollo/client";
const ReimbTableContext = createContext(undefined);

export default ReimbTableContext;

interface Props {
    children: React.ReactNode[]
}

// TODO: way to delete Reimbursement
export const ReimbTableProvider: React.FC<Props> = ({children} : Props) => {
    const {logoutUser} = useContext(AuthContext);
    const {user}: { user: User } = useContext(UserContext);
    const id = user.id;
    const [Reimbs, setReimbs] = useState(null);
    useAuthQuery(GET_REIMBS_QUERY, {
        variables: {id},
        onCompleted: ({reimbs}) => {
            reimbs.forEach(reimb => reimb.date = dayjs(reimb.date));
                setReimbs(Reimbs);
        },
        onError: () => logoutUser(),
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
    });


    const data:ReimbTableContextInterface = {
        reimbs:Reimbs,
    }

    return <ReimbTableContext.Provider value={data}>
            {children}
        </ReimbTableContext.Provider>
}



const GET_REIMBS_QUERY = gql`
{
    query MyReimbs($id: String!){
        my_reimbs(id: $id){
            show
            amount
            date
            receipts
            completed
            id
        }
    }
}
`;


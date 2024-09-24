import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { UserContext } from "../../../../context/UserContext";
import { Reimbursement, User } from "../../../../types/types";
import { useAuthQuery } from "../../../../services/graphql";
import { ReimbTableContext, ReimbTableContext_T } from "./types";
import ReimbTable from "../../components/ReimbTable";

import dayjs from "dayjs";

import { gql } from "@apollo/client";

//
// TODO: way to delete Reimbursement
//
interface Props {
  children: React.ReactNode[];
}

function getReimbs() {
  //const { logoutUser } = useContext(AuthContext);
  const { user }: { user: User } = useContext(UserContext);
  const id = user.id;
  const { loading, error, data } = useAuthQuery(GET_REIMBS_QUERY, {
    variables: { id },
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return data;
}

export const ReimbTableProvider: React.FC<Props> = ({ children }: Props) => {
  const { logoutUser } = useContext(AuthContext);
  const { user }: { user: User } = useContext(UserContext);
  const id = user.id;
  const result = useAuthQuery(GET_REIMBS_QUERY, {
    variables: { id },
    onError: logoutUser,
  });
  const loading = result.loading;
  const data: Reimbursement[] = result.data;
  if (data)
    return (
      <ReimbTableContext.Provider value={ReimbTableContext}>
        {children}
      </ReimbTableContext.Provider>
    );
  if (loading) return <div>Loading... </div>;
};

export default ReimbTableProvider;

const GET_REIMBS_QUERY = gql`
{
        my_reimbs(id: $id){
            show
            amount
            date
            receipts
            completed
            id
        }
}
`;

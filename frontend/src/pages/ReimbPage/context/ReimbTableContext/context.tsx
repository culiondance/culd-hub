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
      <ReimbTableContext.Provider value={data}>
        {children}
      </ReimbTableContext.Provider>
    );
  if (loading) return <div>Loading... </div>;
};

export default ReimbTableProvider;

const GET_REIMBS_QUERY = gql`
  {
    myReimbs {
      show {
        date
        name
      }
      amount
      date
      completed
      id
    }
  }
`;

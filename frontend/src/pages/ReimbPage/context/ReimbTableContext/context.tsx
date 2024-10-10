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

  useAuthQuery(GET_REIMBS_QUERY, {
    variables: { id },
    onError: logoutUser,
    onCompleted: ({myReimbs}) => (SetReimbColumns(myReimbs)),
  });

  const [reimb_columns, SetReimbColumns] = useState<Reimbursement[]>([]);


    return (
      <ReimbTableContext.Provider value={reimb_columns}>
        {children}
      </ReimbTableContext.Provider>
    );
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
      receipts{
          receipt
      }
    }
  }
`;


import React, { createContext, useContext, useState, useEffect} from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { UserContext } from "../../../../context/UserContext";
import { Reimbursement, User } from "../../../../types/types";
import { useAuthQuery, useAuthLazyQuery} from "../../../../services/graphql";
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

    
  const [NeedsRefresh, SetNeedsRefresh] = useState<boolean>(true);



  const { logoutUser } = useContext(AuthContext);
  const { user }: { user: User } = useContext(UserContext);
  const id = user.id;


  const [GetReimbs] = useAuthLazyQuery(GET_REIMBS_QUERY, {
    variables: { id },
    onError: logoutUser,
    onCompleted: ({myReimbs}) => {
        console.log("updating reimb columns");
        SetReimbColumns(myReimbs);
    },
  });

    if(NeedsRefresh){
        console.log("set needs refresh false");
        SetNeedsRefresh(false);
        GetReimbs();
    }


  useEffect(() => {
    const fetchReimbs = async () => {
      await GetReimbs();
    };
    fetchReimbs().catch(console.error);
  }, [NeedsRefresh, GetReimbs]);

/*
    useEffect(() => {
        
        console.log(NeedsRefresh);
        GetReimbs();
    },[NeedsRefresh]);
    */


  const [reimb_columns, SetReimbColumns] = useState<Reimbursement[]>([]);

  const context:ReimbTableContext_T = {
    reimbs:reimb_columns,
    needs_refresh:SetNeedsRefresh,
  }


    return (
      <ReimbTableContext.Provider value={context}>
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
      receiptList{
          receipts{
              image
          }
      }
      description
    }
  }
`;


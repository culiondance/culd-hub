import React, { useContext } from "react";
import { Modal, Table, Tooltip, Image } from "antd";
import {
  CheckSquareFilled,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs'

import ShowDetails from "../../../ShowsPage/components/ShowDetails";
import { Show, User, Reimbursement } from "../../../../types/types";

import { ReimbTableContext } from "../../context/ReimbTableContext/types";

const ReimbTable = () => {
  const {myReimbs: reimbs} = useContext(ReimbTableContext);

  const columns = [
    {
      title: "completed",
      key: "completed",
      dataIndex: "completed",
      render: (completed: boolean) => {
        return completed ? <CheckSquareFilled /> : <ClockCircleOutlined />;
      },
    },
    {
      title: "date",
      key: "date",
      dataIndex: "date",
      render: (date: dayjs.Dayjs) => {
        if (date){
            const _date = dayjs(date)
            return _date.format('ddd MMM DD YY');
        }
        return ""
      },
    },
    {
      title: "show",
      key: "show",
      dataIndex: "show",
      render: ({name:showname, date:showdate}) => {
        return (
          <>
            <span
              style={{
                fontSize: "1.05em",
                marginRight: "8px",
              }}
            >
            {showdate} {showname}
            </span>
        </>
        );
      },
    },
    {
      title: "amount",
      key: "amount",
      dataIndex: "amount",
      render: (amount: number) => {
        const formatter = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        const amnt = formatter.format(amount);
        return (
          <span
            style={{
              fontSize: "1.05em",
              marginRight: "8px",
            }}
          >
            {amnt}
          </span>
        );
      },
    }
    /*,
    {
      title: "receipts",
      key: "receipts",
      dataIndex: "receipts",
      render: () => {
        return <Image></Image>;
      },
    },
    */
  ];

  return <Table dataSource={reimbs} columns={columns} />;
};

export default ReimbTable;

import React, { useContext } from "react";
import { Modal, Table, Tooltip, Image } from "antd";
import {
  CheckSquareFilled,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import ShowDetails from "../../../ShowsPage/components/ShowDetails";
import { Show, User, Reimbursement } from "../../../../types/types";

import { ReimbTableContext } from "../../context/ReimbTableContext/types";

const ReimbTable = () => {
  const reimbs:Reimbursement[] = useContext(ReimbTableContext);
  console.log(reimbs);

  function render_receipts(receipts: {receipt:string}[]){
      console.log(receipts);
      const new_receipts = receipts.map((receipt,index) => {
          const hostname = window.location.hostname.toString();
          const protocol = window.location.protocol.toString();
          const url = "https://receipts." + hostname + ":9000/" + receipt.receipt;
          //const url_1 = "receipts." + window.location.origin.toString() + "/" +  receipt.receipt;
          //const url = "https://localhost:9000/" + receipt.receipt;
          console.log(`url ${url}`);
          return <Image src={url} key = {index} height = {75} width = {75} preview = {{maxScale: 100}}></Image>
      });
      return(
        <Image.PreviewGroup>
            {new_receipts}
        </Image.PreviewGroup>
      );
  }


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
        if (date) {
          const _date = dayjs(date);
          return _date.format("ddd MMM DD YY");
        }
        return "";
      },
    },
    {
      title: "show",
      key: "show",
      dataIndex: "show",
      render: ({ name: showname, date: showdate }) => {
        return (
          <>
            <span
              style={{
                fontSize: "1.05em",
                marginRight: "8px",
              }}
            >
              {showname}
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
    },
    {
      title: "description",
      key: "description",
      dataIndex: "description",
      render: (receipts) => 
      (<p>{receipts}</p>)
      ,
    },
    {
      title: "receipts",
      key: "receipts",
      dataIndex: "receipts",
      render: (receipts:{receipt:string}[]) => {
        return render_receipts(receipts);
      },
    },
      ];

  return <Table rowKey={reimb => Number(reimb.id)} dataSource={reimbs} columns={columns} />;
};

export default ReimbTable;

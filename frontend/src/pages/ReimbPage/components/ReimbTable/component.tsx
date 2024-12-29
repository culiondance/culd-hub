import React, { useContext, useEffect } from "react";
import { Modal, Table, Tooltip, Image } from "antd";
import {
  CheckOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import ShowDetails from "../../../ShowsPage/components/ShowDetails";
import { Show, User, Reimbursement } from "../../../../types/types";

import { ReimbTableContext, ReimbTableContext_T} from "../../context/ReimbTableContext/types";

const ReimbTable = () => {

  const {reimbs}:ReimbTableContext_T = useContext(ReimbTableContext);

  function render_receipts(receipts: {receipts:{image:string}[]}){
      const new_receipts = receipts.receipts.map((receipt,index) => {
          const hostname = window.location.hostname.toString();
          const url = "http://" + hostname + ":8000/receipts/" + receipt.image;
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
      title: "Completed",
      key: "completed",
      dataIndex: "completed",
      render: (completed: boolean) => {
        return completed ? <CheckOutlined /> : <ClockCircleOutlined />;
      },
    },
    {
      title: "Date",
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
      title: "Show",
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
      title: "Amount",
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
      title: "Description",
      key: "description",
      dataIndex: "description",
      render: (description) => 
      (<p>{description}</p>)
      ,
    },
    {
      title: "Receipts",
      key: "receiptList",
      dataIndex: "receiptList",
      render: (receipt_list:{receipts:{image:string}[]}) => {
          if(receipt_list){
            return render_receipts(receipt_list);
          }
      },
    },
  ];

  return (<Table rowKey={reimb => Number(reimb.id)} dataSource={reimbs} columns={columns} />);
};

export default ReimbTable;

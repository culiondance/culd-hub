import React, { useContext } from "react";
import { Modal, Table, Tooltip, Image } from "antd";
import {
  CheckSquareFilled,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Dayjs } from "dayjs";

import ShowDetails from "../../../ShowsPage/components/ShowDetails";
import { Show, User, Reimbursement } from "../../../../types/types";

import { ReimbTableContext } from "../../context/ReimbTableContext/types";

const ReimbTable = () => {
  const reimbs = useContext(ReimbTableContext);

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
      render: (date: Dayjs) => {
        return date ? date.format("ddd, MMM DD") : "";
      },
    },
    {
      title: "show",
      key: "show",
      dataIndex: "name",
      render: (show: Show) => {
        return (
          <>
            <span
              style={{
                fontSize: "1.05em",
                marginRight: "8px",
              }}
            >
              {show.name}
            </span>
            <Tooltip
              title="More Info"
              placement="bottom"
              style={{ textAlign: "center" }}
            >
              <InfoCircleOutlined
                style={{ color: "gray" }}
                onClick={() => {
                  Modal.info({
                    title: show.name,
                    content: <ShowDetails show={show} />,
                    width: "60%",
                  });
                }}
              />
            </Tooltip>
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
      title: "receipts",
      key: "receipts",
      dataIndex: "receipts",
      render: () => {
        return <Image></Image>;
      },
    },
  ];

  return <Table dataSource={reimbs} columns={columns} />;
};

export default ReimbTable;

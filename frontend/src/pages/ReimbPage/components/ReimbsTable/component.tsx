import React, { useContext } from "react";
import {
  Button,
  Modal,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
  Image,
} from "antd";
import { ColumnProps } from "antd/es/table";
import {
  CheckSquareFilled,
  ClockCircleOutlined,
  InfoCircleOutlined,
  InfoCircleTwoTone,
  PlusOutlined,
  StarFilled,
  WarningFilled,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import ShowDetails from "../../../ShowsPage/components/ShowDetails";
import { Show, User } from "../../../../types/types";

import {
  ReimbTableContextInterface,
  ReimbTableContext,
} from "../../context/ReimbTableContext/types";

const ReimbsTable = ({ user }: { user: User }) => {
  const { reimbs }: ReimbTableContextInterface = useContext(ReimbTableContext);

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
      render: (amount) => {
        return (
          <span
            style={{
              fontSize: "1.05em",
              marginRight: "8px",
            }}
          >
            ("$" + amount.toFixed(2))
          </span>
        );
      },
    },
    {
      title: "receipts",
      key: "receipts",
      dataIndex: "receipts",
      render: (urls: String[]) => {
        return <Image></Image>;
      },
    },
  ];

  return <Table dataSource={reimbs} columns={columns} />;
};

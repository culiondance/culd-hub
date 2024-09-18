import { AppstoreAddOutlined } from "@ant-design/icons";
import styles from "./style.module.css";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { User } from "../../types/types";
import ReimbTableProvider from "./context/ReimbTableContext";
import { Divider, Layout, Row, Typography } from "antd";

import ReimbTable from "./context/ReimbTableContext";

import Header from "../../components/Navigation";

const ReimbPage = () => {
  const { user }: { user: User } = useContext(UserContext);

  return (
    <Layout>
      <Header newUserTooltip />
      <Layout.Content className={styles.content}>
        <ReimbTableProvider>
          <Row
            justify="space-between"
            align="bottom"
            className={styles.heading}
          >
            <Typography.Title className={styles.title} level={2}>
              <AppstoreAddOutlined className={styles.icon} />
              Reimbursements
            </Typography.Title>
          </Row>
          <Divider className={styles.divider} />
          <ReimbTable user={user} />
          <ReimbTable />
        </ReimbTableProvider>
      </Layout.Content>
    </Layout>
  );
};

export default ReimbPage;

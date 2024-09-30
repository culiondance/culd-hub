import React, { useState } from "react";
import { Divider, Layout, Row, Typography, Button, Modal } from "antd";
import { BankOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import Header from "../../components/Navigation";

import ReimbTableProvider from "./context/ReimbTableContext";
import { User } from "../../types/types";
import ReimbTable from "./components/ReimbTable";
import ReimbForm from "./components/ReimbForm";
import styles from "./style.module.css";

const ReimbPage = () => {
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
              <BankOutlined className={styles.icon} />
              Reimbursements
            </Typography.Title>
          </Row>
          <Divider className={styles.divider} />
          <ReimbForm />
          <ReimbTable />
        </ReimbTableProvider>
      </Layout.Content>
    </Layout>
  );
};

export default ReimbPage;

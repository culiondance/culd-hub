import React, { useContext } from "react";
import { Divider, Layout, Row, Typography } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import Header from "../../components/Navigation";

import ReimbTableProvider from "./context/ReimbTableContext";
import { User } from "../../types/types";
import styles from "./style.module.css";

import ReimbTable from "./components/ReimbTable/component";

const ReimbPage = () => {
  const { user }: { user: User } = useContext(UserContext);
  //const { logoutUser } = useContext(AuthContext);

  return (
    <Layout>
      <Header newUserTooltip />
      <Layout.Content className={styles.content}>
        <ReimbTableProvider>
        </ReimbTableProvider>
      </Layout.Content>
    </Layout>
  );
};

export default ReimbPage;

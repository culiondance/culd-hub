import React, {useContext} from "react";
import {UserContext} from "../../context/UserContext";
import {User} from "../../types/types";
import {
    Layout,
} from "antd";

import Header from "../../components/Navigation";

const ReimbPage = () => {

    const {user}: { user: User } = useContext(UserContext);

    return (
        <Layout>
            <Header newUserTooltip/>
            ee oo
        </Layout>
    );
};

export default ReimbPage;

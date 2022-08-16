import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {Alert, Button, Form, Input} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";
import AuthBox from "./AuthBox";
import {REMEMBER_EMAIL} from "../../constants";
import {EMAIL_VALIDATION_RULES, PASSWORD_VALIDATION_RULES} from "../../utils/user-field-validation";

const LoginPage: React.FC = () => {

    const {loginUser, invalidCredentials, setInvalidCredentials} =
        useContext(AuthContext);

    const [form] = Form.useForm();

    const onChange: (() => void) = () => {
        setInvalidCredentials(false);
    };

    const subtitle: React.ReactNode = (
        <>
            {"Don't have an account? "}
            <Link to="/signup">
                <span style={{fontWeight: "bold"}}>Sign up!</span>
            </Link>
        </>
    );

    const alert: React.ReactNode = invalidCredentials ? (
        <Alert type="error" message="Username or password are incorrect."
               banner/>
    ) : null;

    return (
        <AuthBox subtitle={subtitle} alert={alert}>
            <Form form={form}
                  name="login"
                  onFinish={loginUser}
                  onFieldsChange={onChange}
            >
                <Form.Item
                    name="email"
                    rules={EMAIL_VALIDATION_RULES}
                    validateStatus={invalidCredentials ? "error" : ""}
                    hasFeedback={invalidCredentials}
                    initialValue={
                        localStorage.getItem(REMEMBER_EMAIL)
                            ? localStorage.getItem(REMEMBER_EMAIL)
                            : null
                    }
                >
                    <Input prefix={<MailOutlined/>}
                           placeholder="Email address"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={PASSWORD_VALIDATION_RULES}
                    validateStatus={invalidCredentials ? "error" : ""}
                    hasFeedback={invalidCredentials}
                >
                    <Input.Password prefix={<LockOutlined/>}
                                    placeholder="Password"/>
                </Form.Item>
                <Form.Item shouldUpdate style={{marginBottom: "15px"}}>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !form.isFieldsTouched(false) ||
                                !!form.getFieldsError().filter(({errors}) => errors.length)
                                    .length
                            }
                            style={{width: "100%"}}
                        >
                            Log in
                        </Button>
                    )}
                </Form.Item>
                <Link to="/password_reset"
                      style={{
                          float: "right",
                          color: "#999AAA",
                      }}>
                    <span>I forgot my password ...</span>
                </Link>
            </Form>
        </AuthBox>
    );
};

export default LoginPage;

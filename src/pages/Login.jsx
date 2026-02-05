import namelogo from "../assets/name logo.png";
import "./css/Login.css";
import { Button, Card, Col, Divider, Form, Input, Row, Typography } from "antd";
import { GithubOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const { Title, Text } = Typography;

const Login = () => {
  //usestate
  // const [husband, setwife] = useState();
  const navigate = useNavigate();
  // console.log(url);

  const onFinish = async (values) => {
    // console.log(values);
    try {
      await axiosInstance
        .post(`/api/auth/login`, values)
        .then((res) => {
          // setwife(res.data);
          const reply = res.status;
          alert("Login successful");
          // console.log(res);
          if (res?.status === 200) {
            navigate("/");
            localStorage.setItem("userToken", res.data.userToken);
            // console.log(res.data);
          }
        })
        .catch((error) => {
          alert("invalid details");
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const signup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <Row
        gutter={(30, 30)}
        className="h-screen bg-neutral-100 flex justify-center items-center"
      >
        <Col>
          <img
            src={namelogo}
            alt="SmartStock Manager Pro"
            style={{ width: "300px" }}
          />
          <p>Simplify your shop's inventory & billing management</p>
        </Col>
        <Col>
          {/* Right card */}
          <Card
            className="rounded-2xl shadow-lg w-[350px]"
            bodyStyle={{ padding: 28 }}
          >
            <Title level={3} className="!mt-0">
              Login
            </Title>

            <Form
              layout="vertical"
              size="large"
              onFinish={onFinish}
              // initialValues={{ email: "shubham.nath@example.com" }}
            >
              <Form.Item
                style={{ marginBottom: "16px" }}
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  // { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="you@example.com"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "12px" }}
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
                {/* <a href="#" className="text-blue-600 flex justify-end">
                  Forgot password
                </a> */}
              </Form.Item>
              <div className="flex justify-end -mt-1 mb-4">
                <a
                  // href="/forgot-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot password
                </a>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-11 !rounded-lg"
              >
                Log in
              </Button>

              <Divider plain className="!my-4">
                or
              </Divider>

              <Button
                block
                className="!h-11 !rounded-lg border border-gray-200"
                onClick={signup}
              >
                Sign up
              </Button>

              <div className="text-center mt-4">
                <Text type="secondary">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-600">
                    Sign up
                  </a>
                </Text>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <Button
                  block
                  className="!h-11 !rounded-lg bg-white border border-gray-200 flex items-center justify-center gap-2"
                >
                  <img
                    alt="Google"
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    className="w-5 h-5"
                  />
                  Google
                </Button>
                <Button
                  block
                  className="!h-11 !rounded-lg bg-white border border-gray-200 flex items-center justify-center gap-2"
                >
                  <GithubOutlined />
                  Github
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;

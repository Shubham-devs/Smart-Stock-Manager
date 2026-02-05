import React from "react";
import namelogo from "../assets/name logo.png";
import { Button, Card, Checkbox, Divider, Form, Input, Typography } from "antd";
import {
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    // console.log(values);
    try {
      await axiosInstance
        .post("/api/auth/register", values)
        .then((res) => {
          //   setwife(res);
          alert(res.data.message);
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.message, "");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left brand area */}
          <div className="flex justify-center items-center gap-4 lg:pl-6">
            <div>
              <Title level={2} className="!m-0 !leading-tight">
                <img
                  src={namelogo}
                  alt="SmartStock Manager Pro"
                  style={{ width: "300px" }}
                />
              </Title>
              <p className="mt-3 text-gray-500">
                Simplify your shop’s inventory
                <br />& billing management
              </p>
            </div>
          </div>

          {/* Right card */}
          <Card className="rounded-2xl shadow-lg" bodyStyle={{ padding: 28 }}>
            <Title level={3} className="!mt-0">
              Sign up
            </Title>

            <Form layout="vertical" size="large" onFinish={onFinish}>
              <Form.Item
                label="Full name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Jane Doe" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="you@example.com"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                  {
                    pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                    message: "Use letters and numbers for a stronger password",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please accept the terms")),
                  },
                ]}
                className="!mb-2"
              >
                <Checkbox>
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600">
                    Privacy Policy
                  </a>
                </Checkbox>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-11 !rounded-lg"
              >
                Create account
              </Button>

              <Divider plain className="!my-5">
                or
              </Divider>

              <div className="grid grid-cols-2 gap-3">
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

              <div className="text-center mt-5">
                <Text type="secondary">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600">
                    Log in
                  </a>
                </Text>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;

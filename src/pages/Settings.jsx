import { Button, Card, Col, Form, Input, Row, Switch, message } from "antd";
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import * as jwt_decode from "jwt-decode";

const Settings = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(false);

  // Decode token and set form values
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      const decoded = jwt_decode.default(token);
      setUser(decoded);

      // Fill form fields
      form.setFieldsValue({
        name: decoded.name,
        email: decoded.email,
      });
    }
  }, [form]);

  // Update only name (email not editable)
  // const onFinish = async (values) => {
  //   try {
  //     await axiosInstance.put("/user/profile", {
  //       name: values.name,
  //     });

  //     message.success("Name updated successfully!");

  //     // Update name in state also
  //     setUser((prev) => ({ ...prev, name: values.name }));
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Failed to update name");
  //   }
  // };

  return (
    <div>
      <Card
        style={{ marginBottom: "1.5rem" }}
        title={<span className="text-xl font-bold">Profile Information</span>}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={[16, 16]}>
            <Col lg={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
            </Col>

            <Col lg={12}>
              <Form.Item label="Email Address" name="email">
                <Input disabled style={{ background: "#f5f5f5" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item>
            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              Save Changes
            </Button>
          </Form.Item> */}
        </Form>
      </Card>
      {/* NOTIFICATION SETTINGS */}
      <Card
        title={<span className="text-xl font-bold">Notification Settings</span>}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Email Notifications</span>
            <Switch
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Push Notifications</span>
            <Switch
              checked={pushNotifications}
              onChange={setPushNotifications}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Low Stock Alerts</span>
            <Switch checked={lowStockAlerts} onChange={setLowStockAlerts} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

{
  /* <Form.Item label="Profile Picture">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Avatar
                    size={64}
                    src={fileList[0]?.url}
                    style={{ border: "1px solid #ddd" }}
                  />
                  <Upload
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // prevent auto upload
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload New</Button>
                  </Upload>
                  {fileList.length > 0 && (
                    <Button type="link" danger onClick={handleDelete}>
                      Delete
                    </Button>
                  )}
                </div>
              </Form.Item> */
}

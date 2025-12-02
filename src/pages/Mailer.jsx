import { Button, Card, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useState } from "react";

const Mailer = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await axios
        .post("http://localhost:5001/api/mail/sendmail", values)
        .then((res) => {
          // console.log("Mail send the customer");
          alert(res.data);
          form.resetFields();
        })
        .catch((error) => {
          console.log("❌ Failed to send email");
        });
    } catch (error) {
      //   if (res.data.success) {
      //     message.success("✅ Email sent successfully!");
      //     form.resetFields();
      //   } else {
      //     message.error("❌ Failed to send email");
      //   }
      console.log(error);
      console.log("❌ Server error while sending email");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "white",
      }}
    >
      <Card
        title="Contact Customer"
        style={{
          width: 400,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
                type: "email",
              },
              // { , message: "Enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message!" }]}
          >
            <TextArea rows={4} placeholder="Type your message..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Mailer;

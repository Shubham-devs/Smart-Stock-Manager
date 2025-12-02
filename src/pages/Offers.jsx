import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const Offers = () => {
  const [form] = Form.useForm(); // Add form instance for control

  // modal form
  const onFinish = (values) => {
    // try {
    //   axios.post("http://localhost:5001/api/product/addProduct", values);
    // } catch (error) {
    //   console.log(error);
    // }
    console.log("Form Values:", values); // <-- print values in console
    setIsModalOpen(false); // close modal after submission
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [drop, setDrop] = useState("flatDiscount");
  const showModal = () => {
    form.resetFields(); // Clear form values when modal opens
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //table
  const columns = [
    {
      title: "Offer Name",
      dataIndex: "offerName",
      key: "offerName",
    },
    {
      title: "Offer Code",
      dataIndex: "offercode",
      key: "offercode",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "Active" ? "green" : "default"} // ✅ green for active, gray(default) for inactive
          style={{
            padding: "2px 8px",
            borderRadius: "8px",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntilaction",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // ✅ Render edit/delete icons with gap
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            // onClick={() => console.log("Edit", record)}
            onClick={() => {
              // Save current row
              setEditingRecord(record);
              // Pre-fill the form
              form.setFieldsValue({
                offerName: record.offerName,
                offerCode: record.offercode,
                offerType:
                  record.type === "flat"
                    ? "flatDiscount"
                    : record.type.toLowerCase(),
                discount: record.discount,
                validUntil: record.validUntil
                  ? dayjs   (record.validUntil, "DD-MM-YYYY")
                  : null,
                status: record.status,
              });
              setDrop(
                record.type === "flat"
                  ? "flatDiscount"
                  : record.type.toLowerCase()
              );
              setIsModalOpen(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => console.log("Delete", record)}
          />
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      offerName: "diwali Bonanza",
      offercode: "d1d",
      type: "Percentage",
      discount: 20,
      status: "Active",
      validUntil: "20-11-2025",
      //   action: [<EditOutlined />, <DeleteOutlined />],
    },
    {
      key: "2",
      offerName: "Summer Sale",
      offercode: "s1s",
      type: "flat",
      discount: "50 off",
      status: "Active",
      validUntil: "20-11-2025",
      //   action: [<EditOutlined />, <DeleteOutlined />],
    },
    {
      key: "3",
      offerName: "Electronics Bundle",
      offercode: "e1b",
      type: "Bundle",
      discount: "laptop + Mouse",
      status: "Inactive",
      validUntil: "20-11-2025",
      //   action: [<EditOutlined />, <DeleteOutlined />],
    },
  ];
  //select
  const handleChange = (value) => {
    console.log(value.key); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    setDrop(value.key);
  };
  return (
    <div>
      <Card
        // style={{ marginBottom: "1.5rem", }}
        title={
          <div className="flex justify-between">
            <span className="text-xl leading-7 font-bold">Active Offers</span>
            <Button type="primary" onClick={showModal}>
              + Add Offer
            </Button>
            <Modal
              title="Add New Expense"
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Save Expenses"
            >
              <Form
                form={form}
                name="trigger"
                style={{ maxWidth: 600 }}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={{
                  offerType: {
                    value: "flatDiscount",
                    label: "Flat Discount",
                  },
                }} // Default category
              >
                <Form.Item
                  label="Offer Name"
                  name="offerName"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Offer name!",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Summer Sale" />
                </Form.Item>
                <Form.Item
                  //   hasFeedback
                  label="Offer Code"
                  name="offerCode"
                  rules={[
                    {
                      required: true,
                      message: "Please input Offer code!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  //   hasFeedback
                  label="Offer Type"
                  name="offerType"
                  rules={[
                    {
                      required: true,
                      message: "Please select a category!",
                    },
                  ]}
                >
                  <Select
                    labelInValue
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "flatDiscount",
                        label: "Flat Discount",
                      },
                      {
                        value: "percentage",
                        label: "Percentage",
                      },
                      {
                        value: "bundle",
                        label: "Bundle",
                      },
                    ]}
                  />
                </Form.Item>
                {drop === "percentage" ? (
                  <Form.Item
                    //   hasFeedback
                    label="percentage"
                    name="discount"
                    rules={[
                      {
                        required: true,
                        message: "Please input Discount!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="0.00"
                      addonAfter="%"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                ) : drop === "flatDiscount" ? (
                  <Form.Item
                    //   hasFeedback
                    label="Flat Discount"
                    name="discount"
                    rules={[
                      {
                        required: true,
                        message: "Please input Discount!",
                      },
                    ]}
                  >
                    <InputNumber
                      addonBefore="$"
                      style={{ width: "100%" }}
                      placeholder="e.g., 50 off"
                    />
                  </Form.Item>
                ) : drop === "bundle" ? (
                  <Form.Item
                    //   hasFeedback
                    label="Bundle"
                    name="discount"
                    rules={[
                      {
                        required: true,
                        message: "Please input Discount!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={200}
                      placeholder="e.g., Buy 1 Laptop, Get 1 Mouse free"
                    />
                  </Form.Item>
                ) : null}
                <Form.Item
                  //   hasFeedback
                  label="Valid Until"
                  name="validUntil"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Valid until!",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="dd/mm/yyyy"
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                  {/* <Input.TextArea showCount maxLength={100} /> */}
                </Form.Item>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select status!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="Active">Active</Radio>
                    <Radio value="Inactive">Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        }
      >
        <div
          style={{
            height: 450,
            //   backgroundColor: "#f0f2f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Table
            className="w-full h-full"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }} // ✅ optional: paginates rows
            scroll={{ x: true, y: 300 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Offers;

import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "../api/axiosInstance";

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

const Expenses = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]); // ✅ start empty, no static data
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axiosInstance.get("/api/expenses/viewExpense");
        if (res?.status === 200) {
          const formatted = res.data.map((item) => ({
            key: item._id,
            date: item.date.substring(0, 10),
            category: item.category,
            amount: item.amount,
            notes: item.notes,
            action: (
              <DeleteOutlined
                onClick={() => handleDelete(item._id)}
                style={{ color: "red", cursor: "pointer" }}
              />
            ),
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Delete expense
  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/expenses/${id}`);
      if (res?.status === 200) {
        alert("Expense deleted successfully");
        setData((prev) => prev.filter((item) => item.key !== id));
      }
    } catch (error) {
      alert("Failed to delete expense");
      console.error(error);
    }
  };

  // Modal handlers
  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = () => form.submit();
  const handleCancel = () => setIsModalOpen(false);

  // Add expense
  const onFinish = async (values) => {
    const newExpense = {
      date: values.date.format("YYYY-MM-DD"),
      category: values.category.label,
      amount: values.amount,
      notes: values.notes,
    };

    try {
      await axiosInstance
        .post("/api/expenses/addExpense", newExpense)
        .then((res) => {
          alert("Expense added successfully");

          // update local state with backend response
          setData((prev) => [
            ...prev,
            {
              key: res.data.data._id, // backend returns saved expense
              date: res.data.data.date.substring(0, 10),
              category: res.data.data.category,
              amount: res.data.data.amount,
              notes: res.data.data.notes,
              action: (
                <DeleteOutlined
                  onClick={() => handleDelete(res.data.data._id)}
                  style={{ color: "red", cursor: "pointer" }}
                />
              ),
            },
          ]);

          setIsModalOpen(false);
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to add expense");
        });
    } catch (error) {
      console.log(error);
      alert("Unexpected error occurred");
    }
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
    { title: "Action", dataIndex: "action", key: "action" },
  ];

  // Pie Chart data
  const categories = [
    "Office Supplies",
    "Utilities",
    "Marketing",
    "Rent",
    "Salaries",
    "Other",
    "Laptop",
  ];
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categories.map((cat) =>
          data
            .filter((item) => item.category === cat)
            .reduce((sum, item) => sum + item.amount, 0),
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#00C49F",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div>
      <Row gutter={[20, 20]}>
        <Col lg={16} className="rounded-[10px]">
          <Card
            title={
              <div className="flex justify-between">
                <span className="text-xl leading-7 font-bold">
                  Recent Expenses
                </span>
                <Button type="primary" onClick={showModal}>
                  + Add Expense
                </Button>
                <Modal
                  title="Add New Expense"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText="Save Expenses"
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Date"
                      name="date"
                      rules={[
                        { required: true, message: "Please input date!" },
                      ]}
                    >
                      <DatePicker
                        placeholder="dd/mm/yyyy"
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Category"
                      name="category"
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
                        options={[
                          {
                            value: "Office Supplies",
                            label: "Office Supplies",
                          },
                          { value: "Utilities", label: "Utilities" },
                          { value: "Marketing", label: "Marketing" },
                          { value: "Rent", label: "Rent" },
                          { value: "Salaries", label: "Salaries" },
                          { value: "Other", label: "Other" },
                          { value: "Laptop", label: "Laptop" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Amount"
                      name="amount"
                      rules={[
                        { required: true, message: "Please input Amount!" },
                      ]}
                    >
                      <InputNumber
                        placeholder="0.00"
                        style={{ width: "100%" }}
                        addonAfter="$"
                      />
                    </Form.Item>

                    <Form.Item label="Notes" name="notes">
                      <Input.TextArea showCount maxLength={100} />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            }
          >
            <Table
              className="w-full h-full"
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true, y: 300 }}
            />
          </Card>
        </Col>

        <Col
          lg={8}
          className="bg-[white] rounded-[10px] p-3 !flex flex-col items-center"
        >
          <h1 className="text-xl leading-7 font-bold">Expense Breakdown</h1>
          <div style={{ height: "300px", width: "100%" }}>
            <Pie
              data={pieData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Expenses;

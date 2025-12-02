import { DollarOutlined } from "@ant-design/icons";
// import { Typography } from "antd";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
const { Text } = Typography;
import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import axiosInstance from "../api/axiosInstance";

import ghrap from "../assets/dash.jpg";

function Dashboard() {
  const [token, setToken] = useState();

  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  //recently table
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    setToken(userToken);

    // Fetch recent bills
    const fetchRecentBills = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/bills/recentBills");
        setRecentBills(response.data);
      } catch (error) {
        console.error("Error fetching recent bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBills();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",

      render: (text) => <a>{text}</a>,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];
  // const data = [
  //   {
  //     key: "1",
  //     date: "2024-12-10",
  //     product: "Laptop",
  //     quantity: 2,
  //     price: 1200,
  //     total: 2400,
  //   },
  //   {
  //     key: "2",
  //     date: "2024-12-10",
  //     product: "Laptop",
  //     quantity: 2,
  //     price: 1200,
  //     total: 2400,
  //   },
  //   {
  //     key: "3",
  //     date: "2024-12-10",
  //     product: "Laptop",
  //     quantity: 2,
  //     price: 1200,
  //     total: 2400,
  //   },
  // ];
  return (
    <div style={{ width: "100%" }}>
      <Content style={{ minHeight: 280 }}>
        {/* <Title level={2}>Hello , </Title> */}
        <Title level={2}>Dashboard</Title>
        {/* {token ? <button>Logout</button> : <button>login</button>} */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Total Sales */}
          <div className="bg-white  p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100  text-emerald-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Sales
              </p>
              <p className="text-2xl font-bold">120,000</p>
            </div>
            <p className="ml-auto text-sm font-semibold text-emerald-500 overflow-y-auto">
              +10%
            </p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white  p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100  text-red-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold">30,000</p>
            </div>
            <p className="ml-auto text-sm font-semibold text-red-500 overflow-y-auto">
              -5%
            </p>
          </div>

          {/* Net Profit */}
          <div className="bg-white  p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-100  text-indigo-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Net Profit
              </p>
              <p className="text-2xl font-bold">90,000</p>
            </div>
            <p className="ml-auto text-sm font-semibold text-emerald-500 overflow-y-auto">
              +15%
            </p>
          </div>
        </div>
        {/* <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  size={50}
                  icon={<DollarOutlined />}
                  style={{ backgroundColor: "#e6fffb", color: "#1890ff" }}
                />
                <div>
                  <Text type="secondary">Total Expenses</Text>
                  <Title level={4}>$30,000</Title>
                </div>
                <Text style={{ color: "#f5222d" }}>-5%</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  size={50}
                  icon={<DollarOutlined />}
                  style={{ backgroundColor: "#fff0f6", color: "#eb2f96" }}
                />
                <div>
                  <Text type="secondary">Total Expenses</Text>
                  <Title level={4}>$30,000</Title>
                </div>
                <Text style={{ color: "#f5222d" }}>-5%</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Avatar
                  size={50}
                  icon={<DollarOutlined />}
                  style={{ backgroundColor: "#e6f7ff", color: "#2db7f5" }}
                />
                <div>
                  <Text type="secondary">Net Profit</Text>
                  <Title level={4}>$90,000</Title>
                </div>
                <Text style={{ color: "#52c41a" }}>+15%</Text>
              </div>
            </Card>
          </Col>
        </Row> */}
        <Card
          style={{ marginBottom: "1.5rem" }}
          title={
            <span className="text-xl leading-7 font-bold">Sales Overview</span>
          }
        >
          {/* Placeholder for your chart component */}
          <div
            style={{
              height: 350,
              //   backgroundColor: "#f0f2f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={ghrap}
              alt=""
              // style={{ width: "75%" }}
            />
          </div>
        </Card>
        <Card
          style={{ marginBottom: "1.5rem" }}
          title={
            <span className="text-xl leading-7 font-bold">
              Recent Transactions
            </span>
          }
        >
          <div
            style={{
              height: 450,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Table
              className="w-full h-full"
              columns={columns}
              dataSource={recentBills}
              loading={loading}
              pagination={false} // Disable pagination since we're showing only 5 items
              scroll={{ x: true, y: 300 }}
              locale={{
                emptyText: loading
                  ? "Loading..."
                  : "No recent transactions found",
              }}
            />
          </div>
        </Card>
      </Content>
    </div>
  );
}

export default Dashboard;

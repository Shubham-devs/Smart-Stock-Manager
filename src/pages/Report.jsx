import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Input, Space, Card } from "antd";
import axios from "axios";

const { Search } = Input;

const Report = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch All Bills
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/bills/allBills");
      setBills(res.data.allBills);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  // Pay Bill Function
  const payBill = async (record) => {
    try {
      await axios.put(`http://localhost:5001/api/bills/payBill/${record._id}`);
      fetchBills(); // refresh table
    } catch (err) {
      console.log("Payment Error:", err);
    }
  };

  // Search Filter
  const filteredBills = bills.filter((bill) => {
    const s = search.toLowerCase();
    return (
      (bill.customerName || "").toLowerCase().includes(s) ||
      (bill.billId || "").toLowerCase().includes(s)
    );
  });
  const columns = [
    {
      title: "Bill ID",
      dataIndex: "billId",
      key: "billId",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `${amt}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "paid" ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="red">Unpaid</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "unpaid" ? (
          <Button type="primary" danger onClick={() => payBill(record)}>
            Pay Bill
          </Button>
        ) : (
          <Button disabled>Paid</Button>
        ),
    },
  ];

  return (
    <Card style={{ padding: 20 }}>
      <h2 className="text-xl font-bold mb-4">Billing Reports</h2>

      {/* Search */}
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="Search by Bill ID or Customer Name"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 350 }}
        />
      </Space>

      {/* Billing Table */}
      <Table
        columns={columns}
        dataSource={filteredBills}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 6 }}
        scroll={{ x: "max-content" }} // 🔥 ADD THIS LINE
      />
    </Card>
  );
};

export default Report;

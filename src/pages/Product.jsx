import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Card,
  Table,
  Row,
  Col,
  Space,
  Select,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import axios, { Axios } from "axios";
import Search from "antd/es/transfer/search";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";

const Product = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [huband, setwife] = useState();
  const [Rid, setRid] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [search, setSearch] = useState("");

  // Filter Products by name, retail price, purchase price, date
  const filteredProducts =
    huband?.data?.allProduct?.filter((item) => {
      const s = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(s) ||
        item.retailPrice.toString().includes(s) ||
        item.purchasePrice.toString().includes(s) ||
        (item.purchaseDate && item.purchaseDate.toLowerCase().includes(s))
      );
    }) || [];

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/viewProduct");
      let allProducts = res.data.allProduct;

      // Automatically delete products with stock 0
      const zeroStockProducts = allProducts.filter(
        (p) => Number(p.stock) === 0
      );
      for (const product of zeroStockProducts) {
        try {
          await axiosInstance.delete(`/product/delProduct/${product._id}`);
        } catch (err) {
          console.log("Failed to delete product", product.name, err);
        }
      }

      // Fetch again after deletion to update state
      const updatedRes = await axiosInstance.get("/product/viewProduct");
      setwife(updatedRes);
    } catch (error) {
      console.log(error);
    }

    // Filter Products by name, retail price, purchase price, date
    const filteredProducts =
      huband?.data?.allProduct?.filter((item) => {
        const s = search.toLowerCase();

        return (
          item.name.toLowerCase().includes(s) ||
          item.retailPrice.toString().includes(s) ||
          item.purchasePrice.toString().includes(s) ||
          (item.purchaseDate && item.purchaseDate.toLowerCase().includes(s))
        );
      }) || [];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // modal form
  const onFinish = async (values) => {
    try {
      await axiosInstance.post("/product/addProduct", values);
    } catch (error) {
      console.log(error);
    }
    console.log("Form Values:", values); // <-- print values in console
    setIsModalOpen(false); // close modal after submission
    fetchProducts(); //refresh table
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // modal add

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // modal edit
  const onFinish1 = async (values) => {
    try {
      await axiosInstance
        .put(`/product/editProduct/${Rid}`, values)
        .then((res) => {
          console.log(res);
          console.log("Form Values:", values); // <-- print values in console
          setIsModalOpen1(false); // close modal edit after submission
          fetchProducts(); //refresh table
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // findOneProduct
  const findOneProduct = async (record) => {
    try {
      await axiosInstance
        .get(`/product/findOneProduct/${record._id}`)
        .then((res) => {
          setRid(record._id);
          console.log(res.data.getProduct);

          form1.setFieldsValue({
            name: res.data.getProduct.name,
            purchasePrice: res.data.getProduct.purchasePrice,
            retailPrice: res.data.getProduct.retailPrice,
            wholesalePrice: res.data.getProduct.wholesalePrice,
            stock: res.data.getProduct.stock,
            purchaseDate: res.data.getProduct.purchaseDate
              ? dayjs(res.data.getProduct.purchaseDate)
              : null,
            expiryDate: res.data.getProduct.expiryDate
              ? dayjs(res.data.getProduct.expiryDate)
              : null,
          });
          setIsChanged(false); // ✅ disable OK initially
          // ✅ Open modal after data is set
          setIsModalOpen1(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //delproduct
  const delProduct = async (record) => {
    try {
      await axiosInstance
        .delete(`/product/delProduct/${record._id}`)
        .then((res) => {
          console.log(res);
          fetchProducts(); //refresh table
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
    },
    {
      title: "Retail Price",
      dataIndex: "retailPrice",
      key: "retailPrice",
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholesalePrice",
      key: "wholesalePrice",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => findOneProduct(record)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => delProduct(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Content style={{ minHeight: 280 }}>
        <Title level={2}>
          <div className="flex justify-between">
            <div>Product</div>
            <div>
              <Button type="primary" onClick={showModal}>
                + Add Product
              </Button>

              {/* add modal */}
              <Modal
                title="Add Product"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form
                  name="basic"
                  form={form}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input product name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Purchase Price"
                    name="purchasePrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input purchase price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Retail Price"
                    name="retailPrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input Retail price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Wholesale Price"
                    name="wholesalePrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input wholesale price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[
                      {
                        required: true,
                        message: "Please input stock number!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Purchase Date"
                    name="purchaseDate"
                    rules={[
                      {
                        required: true,
                        message: "Please input purchase date!",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current.isBefore(
                          dayjs().subtract(1, "week").startOf("day"),
                          "day"
                        ) || current.isAfter(dayjs().startOf("day"), "day")
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Expiry Date"
                    name="expiryDate"

                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input expiry date!",
                    //   },
                    // ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>

              {/* Edit modal */}
              <Modal
                title="Edit Product"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen1}
                onOk={() => form1.submit()}
                onCancel={() => setIsModalOpen1(false)}
                okButtonProps={{ disabled: !isChanged }}
              >
                <Form
                  name="edit"
                  form={form1}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  onFinish={onFinish1}
                  onFinishFailed={onFinishFailed}
                  onValuesChange={() => setIsChanged(true)}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input product name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Purchase Price"
                    name="purchasePrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input purchase price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Retail Price"
                    name="retailPrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input Retail price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Wholesale Price"
                    name="wholesalePrice"
                    rules={[
                      {
                        required: true,
                        message: "Please input wholesale price!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[
                      {
                        required: true,
                        message: "Please input stock number!",
                      },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                  <Form.Item
                    label="Purchase Date"
                    name="purchaseDate"
                    rules={[
                      {
                        required: true,
                        message: "Please input purchase date!",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current.isBefore(
                          dayjs().subtract(1, "week").startOf("day"),
                          "day"
                        ) || current.isAfter(dayjs().startOf("day"), "day")
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Expiry Date"
                    name="expiryDate"

                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input expiry date!",
                    //   },
                    // ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        </Title>
        {/* //table */}
        <Card
          style={{ marginBottom: "1.5rem" }}
          title={
            <Row gutter={[16, 16]} className="my-3">
              <Col xs={24} md={12} lg={8}>
                <Search
                  placeholder="Search products by name, price, date..."
                  allowClear
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                />
              </Col>
              {/* <Col xs={24} md={14} lg={17} className="!flex lg:justify-end">
                <Space size="small">
                  <Select
                    initialValue="all-categories"
                    style={{ minWidth: 150 }}
                  >
                    <Option value="all-categories">All Categories</Option>
                    <Option value="electronics">Electronics</Option>
                    <Option value="accessories">Accessories</Option>
                  </Select>
                  <Select
                    placeholder="Sort"
                    style={{ minWidth: 150 }}
                    // onChange={handleSortChange}
                    allowClear
                  >
                    <Option value="name-ascend">Name (A-Z)</Option>
                    <Option value="name-descend">Name (Z-A)</Option>
                    <Option value="purchasePrice-ascend">
                      Purchase Price (Low to High)
                    </Option>
                    <Option value="purchasePrice-descend">
                      Purchase Price (High to Low)
                    </Option>
                    <Option value="stock-ascend">Stock (Low to High)</Option>
                    <Option value="stock-descend">Stock (High to Low)</Option>
                  </Select>
                  <Button
                    icon={<ImportOutlined />}
                    // onClick={handleImport}
                  >
                    Import
                  </Button>
                  <Button
                    icon={<ExportOutlined />}
                    // onClick={handleExport}
                  >
                    Export
                  </Button>
                </Space>
              </Col> */}
            </Row>
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
              dataSource={filteredProducts}
              pagination={{ pageSize: 5 }} // ✅ optional: paginates rows
              scroll={{ x: true, y: 300 }}
            />
          </div>
        </Card>
      </Content>
    </div>
  );
};

export default Product;

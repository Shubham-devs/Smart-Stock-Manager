import {
  DeleteOutlined,
  PrinterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import QRCode from "qrcode";
import namelogo from "../assets/name logo.png"; // your shop logo

const Billing = () => {
  //useStates
  const [billSaved, setBillSaved] = useState(false);

  const [products, setProducts] = useState([]); // fetched product list
  const [cart, setCart] = useState([]); // added to cart
  const [value, setValue] = useState("flat");
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productSearch, setProductSearch] = useState(""); //search

  useEffect(() => {
    if (billSaved) {
      console.log("Bill saved → refreshing products...");

      allProduct(); // 🔥 Re-fetch updated stock
      setBillSaved(false); // Reset so it doesn't run again
    }
  }, [billSaved]);

  // search
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Inside your Billing component
  const [billStatus, setBillStatus] = useState("unpaid");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const plainOptions = ["flat", "offer"];
  const [form] = Form.useForm();

  const options = [
    { label: "flat", value: "flat", className: "label-1" },
    { label: "offer", value: "offer", className: "label-2" },
  ];

  const onChange = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setValue(value);
  };

  //fetch all product
  const allProduct = async () => {
    try {
      await axiosInstance
        .get("/product/viewProduct")
        .then((res) => {
          setProducts(res.data.allProduct);
          // console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allProduct();
  }, []);

  // ✅ Update totals automatically
  useEffect(() => {
    setTotal(subtotal - discount);
  }, [cart, discount]);

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

  // ✅ Add product to cart
  const handleAddToCart = (product, qty = 1) => {
    const existing = cart.find((item) => item._id === product._id);
    // const existing = cart.find((item) => item._id ===  product._id);

    // ✅ Check if product exists in cart
    if (existing) {
      // If trying to add more than available stock
      if (existing.qty + qty > product.stock) {
        // toast(
        //   `You can't add more than ${product.stock} items for ${product.name}.`
        // );

        alert(`Now you only add ${product.stock - existing.qty} product`);
        return; // Stop function here
      }

      // ✅ Otherwise, update the cart quantity
      // if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: item.qty + qty,
                total: (item.qty + qty) * item.retailPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty,
          price: product.retailPrice,
          discount: 0,
          total: product.retailPrice * qty,
        },
      ]);
    }

    toast.success(`${product.name} added to cart`);
  };

  // ✅ Remove from cart
  const handleRemove = (record) => {
    setCart(cart.filter((item) => item._id !== record._id));
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      render: (qty, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={qty}
          size="small"
          style={{ width: "60px" }}
          onChange={(value) => {
            setCart(
              cart.map((item) =>
                item._id === record._id
                  ? { ...item, qty: value, total: item.price * value }
                  : item
              )
            );
          }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record)}
        />
      ),
    },
  ];

  //discount input

  const dis = (value) => {
    if (value.discountAmount) {
      setDiscount(discount + value.discountAmount);
    }
    form.resetFields();
  };

  // ✅ Function to generate and open PDF
  const generatePDF = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // ✅ Check if customer name is empty
    if (!customerName || customerName.trim() === "") {
      alert("Please enter customer name");
      return;
    }

    try {
      // Generate invoice number ONCE
      const invoiceNumber = "INV-" + Date.now();
      // Create billData object with all necessary information
      const billData = {
        billId: invoiceNumber, // SAVE INVOICE NUMBER
        customerName,
        customerEmail, // <-- ADD THIS
        products: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          total: item.total,
        })),
        subtotal,
        discount,
        total,
        status: billStatus,
        paymentMethod: billStatus === "paid" ? paymentMethod : undefined,
        date: new Date().toISOString(),
      };

      // Save bill data to the database
      try {
        const response = await axiosInstance.post("/bills/saveBill", billData);
        console.log(response);
        console.log("Bill saved to database:", response.data);
        toast.success("Bill saved successfully!");
        setBillSaved(true); // 🔥 Trigger useEffect
      } catch (error) {
        console.error("Error saving bill:", error);
        toast.error("Failed to save bill data");
        return; // 🚫 STOP EXECUTION HERE
        // Continue with PDF generation even if saving fails
      }

      const doc = new jsPDF();

      // Create a new image element
      const img = new Image();
      img.src = namelogo;
      img.crossOrigin = "Anonymous"; // Important for cross-origin images

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => {
          console.error("Failed to load the logo image");
          resolve(); // Continue even if the image fails to load
        };
      });

      // Add the image to the PDF if it loaded successfully
      doc.addImage(img, "PNG", 15, 10, 50, 20);

      // Add shop details
      doc.setFontSize(18);
      doc.text("SMARTSTOCK SUPER SHOP", 70, 18);
      doc.setFontSize(11);
      doc.text("Address: Shiv nagar, Noida, India", 70, 25);
      doc.text("Phone: 9876985985", 70, 30);
      doc.text("Email: support@smartstock.com", 70, 35);

      // Add invoice header
      doc.setFillColor(240, 240, 240);
      doc.rect(14, 42, 182, 10, "F");
      doc.setFontSize(14);
      doc.text("INVOICE", 105, 49, { align: "center" });

      // Add invoice details
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoiceNumber}`, 14, 60);
      doc.text(`Date: ${new Date().toLocaleString()}`, 150, 60);
      doc.text(`Customer Name: ${customerName}`, 14, 68);

      // Add bill status and payment method
      doc.text(`Bill Status: ${billStatus}`, 14, 74);
      if (billStatus === "paid") {
        doc.text(`Payment Method: ${paymentMethod}`, 14, 80);
      }

      // Add table for products
      const tableColumn = ["#", "Item", "Qty", "Price", "Total"];
      const tableRows = cart.map((item, index) => [
        index + 1,
        item.name,
        item.qty,
        `${item.price.toFixed(2)}`,
        `${item.total.toFixed(2)}`,
      ]);
      autoTable(doc, {
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          halign: "center",
        },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { halign: "center" },
          3: { halign: "right" },
          4: { halign: "right" },
        },
      });
      // doc.autoTable({
      //   startY: 90,
      //   head: [tableColumn],
      //   body: tableRows,
      //   theme: "striped",
      //   headStyles: {
      //     fillColor: [0, 102, 204],
      //     textColor: 255,
      //     halign: "center",
      //   },
      //   styles: { fontSize: 10 },
      //   columnStyles: {
      //     0: { halign: "center", cellWidth: 10 },
      //     1: { cellWidth: 60 },
      //     2: { halign: "center" },
      //     3: { halign: "right" },
      //     4: { halign: "right" },
      //   },
      // });

      // Add totals section
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Subtotal:", 140, finalY);
      doc.text(`${subtotal.toFixed(2)}`, 190, finalY, { align: "right" });
      doc.text("Discount:", 140, finalY + 8);
      doc.text(`${discount.toFixed(2)}`, 190, finalY + 8, { align: "right" });
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text("Total:", 140, finalY + 16);
      doc.text(`${total.toFixed(2)}`, 190, finalY + 16, { align: "right" });

      // Add footer
      doc.setDrawColor(220, 220, 220);
      doc.line(14, 285, 195, 285);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for shopping with SmartStock Super Shop!", 14, 291);
      doc.text("Visit Again", 14, 296);

      // Open PDF in new tab
      const blob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF: " + error.message);
    }
  };

  // Add QR code for payment (optional)
  // if (billStatus === "paid") {
  //   const qrText = `Payment of ₹${total.toFixed(2)} via ${paymentMethod}`;
  //   const qrData = await QRCode.toDataURL(qrText);
  //   doc.addImage(qrData, "PNG", 15, finalY + 20, 30, 30);
  //   doc.setFontSize(10);
  //   doc.text("Payment Confirmation", 17, finalY + 55);
  // }

  // const pay = async () => {
  //   try {
  //     const payload = {
  //       customerName: customerName,
  //       cart: cart.map((item) => ({
  //         name: item.name,
  //         qty: item.qty,
  //         price: item.price,
  //         total: item.total,
  //       })),
  //       discount,
  //       total,
  //     };
  //     const response = await axiosInstance.post("/payment/payBill", payload);
  //     if (response.data.url) {
  //       window.location.href = response.data.url; // Redirect to Stripe
  //     }
  //     if (response.data?.success) {
  //       alert("Bill Pay Successful!");
  //       // Optionally, save the bill ID for later use
  //       const billId = response.data.billId;
  //       // You can also clear the cart or reset the form here if needed
  //       // setCart([]);
  //       // setCustomerName("");
  //       // setDiscount(0);
  //     } else {
  //       alert("Payment failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     alert("Payment failed. Please try again., check all detaild filed");
  //   }
  // };

  return (
    <div>
      <Row gutter={[20, 20]}>
        {/* Left Section — Product List */}
        <Col
          lg={12}
          style={{ background: "white", height: "750px", width: "100%" }}
          className="p-6"
        >
          <Search
            placeholder="Search products..."
            onChange={(e) => setProductSearch(e.target.value)}
            className="[&_.ant-input]:!bg-gray-100 w-full mb-4"
          />

          {/* ✅ Display all products dynamically */}
          <div className="overflow-y-auto h-[400px]">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-4 p-4 mb-4 bg-gray-100 rounded"
                >
                  <div className="flex-1">
                    <h2 className="font-medium">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      In Stock: {item.stock}
                    </p>
                  </div>
                  <InputNumber
                    min={1}
                    max={item.stock}
                    defaultValue={1}
                    onChange={(value) => (item.qty = value)}
                    size="small"
                    style={{
                      borderRadius: "10px",
                      width: "50px",
                      height: "35px",
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleAddToCart(item, item.qty || 1)}
                  >
                    + Add
                  </Button>
                  <ToastContainer />
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                Loading products...
              </p>
            )}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Press 'Enter' to add item to cart.
          </p>
        </Col>

        {/* Right Section — Current Order */}
        <Col
          lg={12}
          style={{ background: "white", height: "750px" }}
          className="p-6"
        >
          <h2 className="text-xl font-bold mb-4">Current Order</h2>
          <div className="flex justify-between text-base mb-3">
            <p>Customer Name</p>
            <Input
              placeholder="Enter customer name"
              style={{
                width: "60%",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "6px",
              }}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-base mb-3">
            <p>Customer Email</p>
            <Input
              placeholder="Enter customer email"
              style={{
                width: "60%",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "6px",
              }}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={cart}
            pagination={false}
            rowKey="_id"
            scroll={{ x: true, y: 300 }}
          />
          <div className="border-t border-gray-200 pt-4 mt-auto space-y-3">
            <div className="flex justify-between text-base">
              <p>Subtotal</p>
              <p className="font-medium">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-base">
              <p>Discount</p>
              <p className="font-medium text-green-600">
                ₹{discount.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <p>Total</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-base">
              <p>Discount</p>
              <Radio.Group
                options={plainOptions}
                onChange={onChange}
                value={value}
              />
            </div>
            <div className="flex justify-between text-base">
              <Form
                form={form}
                layout="inline"
                onFinish={dis}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Form.Item
                  name={value === "offer" ? "offerCode" : "discountAmount"}
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Please enter a value!" }]}
                >
                  {value === "offer" ? (
                    <Input
                      placeholder="Enter offer code"
                      style={{
                        border: "2px solid black",
                        width: "90%",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    />
                  ) : (
                    <InputNumber
                      prefix="₹"
                      min={0}
                      max={total}
                      defaultValue={0}
                      style={{
                        border: "2px solid black",
                        width: "90%",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      padding: "17px 25px",
                      background: "blue",
                      color: "white",
                      borderRadius: "15px",
                    }}
                  >
                    Apply
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          {/* // Inside the return statement of your Billing component */}
          <div className="border-t border-gray-200 pt-4 mt-auto space-y-3">
            {/* Bill Status Radio Buttons */}
            <div className="flex justify-between text-base">
              <p>Bill Status</p>
              <Radio.Group
                onChange={(e) => setBillStatus(e.target.value)}
                value={billStatus}
              >
                <Radio value="paid">Paid</Radio>
                <Radio value="unpaid">Unpaid</Radio>
              </Radio.Group>
            </div>

            {/* Payment Method Radio Buttons (only show if bill status is "paid") */}
            {billStatus === "paid" && (
              <div className="flex justify-between text-base">
                <p>Payment Method</p>
                <Radio.Group
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                >
                  <Radio value="cash">Cash</Radio>
                  <Radio value="card">Card</Radio>
                  <Radio value="upi">UPI</Radio>
                </Radio.Group>
              </div>
            )}

            {/* Generate PDF Button */}
            <Button
              style={{ padding: "18px 0", background: "green", color: "white" }}
              className="w-full rounded-2xl mt-4"
              onClick={generatePDF}
            >
              <PrinterOutlined /> Generate Bill (Ctrl+P)
            </Button>
          </div>
          {/* pay or print pdf btn */}
          {/* <Button
            style={{ padding: "18px 0", background: "Red", color: "white" }}
            className="w-full rounded-2xl mt-4"
            onClick={pay}
          >
            Pay Bill
          </Button>
          <Button
            style={{ padding: "18px 0", background: "green", color: "white" }}
            className="w-full rounded-2xl mt-4"
            onClick={generatePDF}
          >
            <PrinterOutlined /> Generate Bill (Ctrl+P)
          </Button> */}
        </Col>
      </Row>
    </div>
  );
};

export default Billing;

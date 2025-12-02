import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  HomeFilled,
  WalletFilled,
  CreditCardFilled,
  SettingFilled,
  VideoCameraOutlined,
  BellOutlined,
  UserOutlined,
  MessageFilled,
  FileTextFilled,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Switch,
  theme,
  Input,
  Badge,
  Dropdown,
  Avatar,
  Typography,
} from "antd";
import Dashboard from "./pages/Dashboard";
import namelogo from "./assets/name logo.png";
import Product from "./pages/Product";
import Billing from "./pages/Billing";
import Expenses from "./pages/Expenses";
import Offers from "./pages/Offers";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Mailer from "./pages/Mailer";
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
import * as jwt_decode from "jwt-decode";

const App = () => {
  const [keys, setkey] = useState("1");
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      const decoded = jwt_decode.default(token); // decode JWT
      // console.log(decoded);   // payload, e.g. { id: 1, username: "shubham", iat: 1690000000, exp: 1690003600 }
      // alert(decoded);
      setUser(decoded);
    }
  }, []);
  useEffect(() => {
    // ✅ Check for params in URL
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    const status = params.get("payment_status");
    console.log(key, status);

    if (key && status) {
      // ✅ Convert key to string for comparison
      setkey(String(key));

      if (status === "success") {
        alert("✅ Payment successful! Thank you for your purchase.");
      } else if (status === "cancel") {
        alert("❌ Payment cancelled. Please try again.");
      }

      // ✅ Optional: clear the query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // alert(user);
  const handleMenu = (item) => {
    console.log("click", item.key);
    setkey(item.key);
  };

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenu = (
    <Menu>
      {/* <Menu.Item key="1">Profile</Menu.Item> */}
      <Menu.Item
        key="1"
        onClick={() => {
          setkey("8");
        }}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          localStorage.removeItem("userToken");
          navigate("/login");
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
  // console.log(user.name);
  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          style={{
            background: "#ffffff",
          }}
        >
          <div className=" h-auto m-4 rounded-md text-[white] ">
            <img src={namelogo} alt="logo" />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            className="py-2 !px-5"
            onClick={handleMenu}
            items={[
              {
                key: "1",
                icon: <HomeFilled />,
                label: "Dashboard",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Products",
              },
              {
                key: "3",
                icon: <CreditCardFilled />,
                label: "Billing",
              },
              {
                key: "4",
                icon: <WalletFilled />,
                label: "Expenses",
              },
              {
                key: "5",
                icon: <WalletFilled />,
                label: "Offers",
              },
              {
                key: "6",
                icon: <FileTextFilled />,
                label: "Reports",
              },
              {
                key: "7",
                icon: <MessageFilled />,
                label: "Mailer",
              },
              {
                key: "8",
                icon: <SettingFilled />,
                label: "Settings",
              },
            ]}
          />
          {/* <div style={{ padding: "16px", color: "white" }}>
            <Switch
              checkedChildren="Dark Mode"
              unCheckedChildren="Light Mode"
              // checked={darkMode}
              // onChange={setDarkMode}
            />
          </div> */}
        </Sider>
        <Layout>
          <Header
            style={{ padding: 0, background: colorBgContainer }}
            className="w-full"
          >
            <div className="flex ">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 24px",
                  width: "100%",
                }}
              >
                <text
                  // placeholder="Search..."
                  style={{
                    width: 300,
                    // background: "rgb(243 244 246)", // ✅ white search box
                    // borderRadius: 8,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // marginLeft: "300px",
                  }}
                >
                  {/* <Badge count={5} dot style={{ marginRight: "20px" }}> */}
                  <BellOutlined
                    style={{
                      fontSize: "20px",
                      marginRight: "20px",
                      color: "#555",
                    }}
                  />
                  {/* </Badge> */}
                  <Dropdown
                    overlay={userMenu}
                    placement="bottomRight"
                    // trigger={["click"]}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      className="!hover"
                    >
                      <Avatar
                        src="https://example.com/john-doe.jpg"
                        icon={<UserOutlined />}
                      />
                      <Text strong style={{ marginLeft: "10px" }}>
                        Hi {user?.name}
                        {/* {console.log(user)} */}
                      </Text>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              // minHeight: 0, // ✅ allow flexible height
              height: "calc(100vh - 112px)", // ✅ 64px header + 48px margin roughly
              overflow: "auto", // ✅ scroll if content is tall
              background: "rgb(243 244 246)",
              borderRadius: borderRadiusLG,
            }}
          >
            {keys === "1" ? (
              <div>
                <Dashboard />
              </div>
            ) : keys === "2" ? (
              <div>
                <Product />
              </div>
            ) : keys === "3" ? (
              <div>
                <Billing />
              </div>
            ) : keys === "4" ? (
              <div>
                <Expenses />
              </div>
            ) : keys === "5" ? (
              <div>
                <Offers />
              </div>
            ) : keys === "6" ? (
              <div>
                <Report />
              </div>
            ) : keys === "7" ? (
              <div>
                <Mailer />
              </div>
            ) : keys === "8" ? (
              <div>
                <Settings />
              </div>
            ) : (
              <h1>View Categories</h1>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;

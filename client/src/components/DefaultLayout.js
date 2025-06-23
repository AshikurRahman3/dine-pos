import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Badge } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout className="default-layout">
      {loading && <Spinner />}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        className="neon-sider"
      >
        <div className="logo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1 className="logo-text" style={{ margin: 0 }}>POS</h1>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[window.location.pathname]}
          className="custom-menu"
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="neon-header">
          <button
            className="neon-trigger-btn"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="trigger-icon" />
            ) : (
              <MenuFoldOutlined className="trigger-icon" />
            )}
          </button>

          <div
            className="neon-cart"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/cart")}
            onKeyPress={(e) => {
              if (e.key === "Enter") navigate("/cart");
            }}
            aria-label={`Cart with ${cartItems.length} items`}
          >
            <Badge count={cartItems.length} size="small" offset={[4, -4]}>
              <ShoppingCartOutlined className="cart-icon" />
            </Badge>
          </div>
        </Header>

        <Content className="site-layout-background content-area">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;

import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, value);
      dispatch({ type: "HIDE_LOADING" });
      message.success("User logged in successfully");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //currently logged in user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dine POS</h1>
        <h3 style={styles.subtitle}>Login Page</h3>
        <Form layout="vertical" onFinish={handleSubmit} style={{ width: "100%" }}>
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: "User ID is required" }]}
          >
            <Input style={styles.input} placeholder="Enter your User ID" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password style={styles.input} placeholder="Enter your Password" />
          </Form.Item>

          <div style={styles.footer}>
            <p style={styles.text}>
              Not a user?{" "}
              <Link to="/register" style={styles.link}>
                Register Here!
              </Link>
            </p>
            <Button
              type="primary"
              htmlType="submit"
              style={styles.button}
              size="large"
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 50%, #bcccdc 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  card: {
    width: 400,
    maxWidth: "100%",
    background: "#ffffff",
    borderRadius: 20,
    padding: 40,
    boxShadow:
      "0 8px 24px rgba(0, 102, 204, 0.1), 0 0 16px rgba(0, 102, 204, 0.05)",
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00509e",
    marginBottom: 8,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 20,
    color: "#4a6fa5",
    marginBottom: 32,
    fontWeight: 500,
  },
  input: {
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 16,
    borderColor: "#a8b9cc",
    transition: "border-color 0.3s ease",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  text: {
    fontSize: 14,
    color: "#657d95",
    margin: 0,
  },
  link: {
    color: "#00509e",
    fontWeight: "600",
    textDecoration: "none",
  },
  button: {
    borderRadius: 16,
    background:
      "linear-gradient(90deg, #00509e 0%, #004080 100%)",
    border: "none",
    fontWeight: "700",
    fontSize: 16,
    padding: "8px 24px",
    color: "#ffffff",
    boxShadow:
      "0 6px 18px rgba(0, 80, 158, 0.4)",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Login;

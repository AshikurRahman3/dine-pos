import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "../styles/InvoiceStyles.css";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Contact No", dataIndex: "customerNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total Amount", dataIndex: "totalAmount" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <EyeOutlined
          className="action-icon"
          onClick={() => {
            setSelectedBill(record);
            setPopupModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="page-header">
        <h1>Invoice List</h1>
      </div>

      <Table
        columns={columns}
        dataSource={billsData}
        bordered
        rowClassName="bill-row"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        width={480}
        title="Invoice Details"
        visible={popupModal}
        onCancel={() => setPopupModal(false)}
        footer={null}
        bodyStyle={{ padding: "20px 30px" }}
        className="invoice-modal"
      >
        {selectedBill && (
          <>
            <div id="invoice-POS" ref={componentRef}>
              <header className="invoice-header">
                <div className="logo" />
                <div className="info">
                  <h2>Food House</h2>
                  <p>Contact: 123456 | Chittagong, Bangladesh</p>
                </div>
              </header>

              <section className="invoice-info">
                <p>
                  <b>Customer Name:</b> {selectedBill.customerName} <br />
                  <b>Phone No:</b> {selectedBill.customerNumber} <br />
                  <b>Date:</b> {new Date(selectedBill.date).toLocaleDateString()}
                </p>
              </section>

              <section className="invoice-items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.cartItems.map((item) => (
                      <tr key={item._id || item.name}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>Tk. {item.price.toFixed(2)}</td>
                        <td>Tk. {(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="summary-row">
                      <td colSpan="2"></td>
                      <td>Tax</td>
                      <td>Tk. {selectedBill.tax.toFixed(2)}</td>
                    </tr>
                    <tr className="summary-row grand-total">
                      <td colSpan="2"></td>
                      <td>Grand Total</td>
                      <td>Tk. {selectedBill.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <footer className="invoice-footer">
                <p>
                  <strong>Thank you for your order!</strong> 10% VAT added on total
                  amount. For assistance, email: <a href="mailto:abc@food.com">abc@food.com</a>
                </p>
              </footer>
            </div>

            <div className="print-button-wrapper">
              <Button type="primary" block onClick={handlePrint}>
                Print Invoice
              </Button>
            </div>
          </>
        )}
      </Modal>
    </DefaultLayout>
  );
};

export default BillsPage;

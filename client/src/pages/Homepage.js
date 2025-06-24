import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ItemList from "../components/ItemList";


const categories = [
  {
    name: "Drinks",
    imageUrl: "/drinks.jpg",
  },
  {
    name: "Rice",
    imageUrl: "/biriyani.jpg",
  },
  {
    name: "Noodles",
    imageUrl: "snacks.jpg",
  },
];

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Drinks");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading); // assuming you have a loading reducer

  useEffect(() => {
    const fetchItems = async () => {
      dispatch({ type: "SHOW_LOADING" });
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/items/get-item`);
        setItemsData(data);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ type: "HIDE_LOADING" });
      }
    };
    fetchItems();
  }, [dispatch]);

  return (
    <DefaultLayout>
      <section className="homepage-container">
        <div className="categories">
          {categories.map(({ name, imageUrl }) => (
            <button
              key={name}
              className={`category-card ${selectedCategory === name ? "active" : ""
                }`}
              onClick={() => setSelectedCategory(name)}
              aria-pressed={selectedCategory === name}
              type="button"
            >
              <img
                src={imageUrl}
                alt={`${name} icon`}
                className="category-icon"
                loading="lazy"
              />
              <span className="category-name">{name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-container">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]} className="items-grid">
            {itemsData
              .filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase())
              .map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <ItemList item={item} />
                </Col>
              ))}
          </Row>
        )}
      </section>
    </DefaultLayout>
  );
};

export default Homepage;

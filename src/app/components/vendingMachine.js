"use client";
import React, { useState, useEffect } from "react";
import styles from "./components.module.css";
import axios from "axios";

const denominations = [1, 5, 10, 20, 50, 100, 500, 1000];

const VendingMachine = () => {
  const [selectedProduct, setSelectedProduct] = useState({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
  });
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [change, setChange] = useState(0);
  const [changeToGive, setChangeToGive] = useState({});
  const [productStock, setProductStock] = useState([]);

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3500/products");
      console.log("response", response);
      if (response.status === 200) {
        setProductStock(response.data);
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleSelectProduct = (product) => {
    if (product.stock > 0) {
      setSelectedProduct(product);
    } else {
      alert("Product out of stock");
    }
  };

  const handleInsertMoney = (amount) => {
    setInsertedMoney(insertedMoney + amount);
  };

  const handlePurchase = async () => {
    if (selectedProduct.id === 0) return;

    const totalCost = selectedProduct.price;

    if (insertedMoney < totalCost) {
      alert("Not enough money inserted");
      return;
    }

    try {
      const data = {
        productId: selectedProduct.id,
        amountPaid: insertedMoney,
      };
      const response = await axios.post("http://localhost:3500/purchase", data);
      console.log("response purchase", response);
      if (response.status === 200) {
        alert(`Purchase successful!`);
        handleGetProducts();
        setInsertedMoney(0);
        setSelectedProduct({
          id: 0,
          name: "",
          price: 0,
          stock: 0,
        });
        setChange(response.data.change.changeNeeded);
        setChangeToGive(response.data.change.changeToGive);
      }
    } catch (e) {
      console.log("err purchase", e);
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <div style={{ textAlign: "center" }}>
        <h1>Blue Vending Machine</h1>
      </div>
      <h2>Products</h2>
      <div className={styles.rowWrap}>
        {productStock.map((product) => (
          <div className={styles.itemWidth} key={product.id}>
            <div
              className={
                product.id === selectedProduct.id
                  ? styles.borderItemActive
                  : styles.borderItemInactive
              }
            >
              <span>{product.name}</span>
            </div>
            <div className={styles.divColumn}>
              <span>Stock: {product.stock}</span>
              <button onClick={() => handleSelectProduct(product)}>
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>Insert Money</h2>
      {denominations.map((denom) => (
        <button
          className={
            denom === 1 || denom === 5 || denom === 10
              ? styles.coins
              : styles.banknotes
          }
          key={denom}
          onClick={() => handleInsertMoney(denom)}
        >
          {denom} THB
        </button>
      ))}

      <h2>Inserted Money: {insertedMoney} THB</h2>
      <h2>
        Selected Product:{" "}
        {selectedProduct.id !== 0 ? selectedProduct.name : "None"}
      </h2>
      {change > 0 && (
        <div className={styles.divColumn}>
          <h2>Change to Return: {change} THB</h2>
          {Object.keys(changeToGive).map((key, index) => (
            <span key={index}>
              {key} THB : {changeToGive[key]} banknote
            </span>
          ))}
        </div>
      )}
      <div className={styles.footer}>
        <button className={styles.btnPurchase} onClick={handlePurchase}>
          Purchase
        </button>
      </div>
    </div>
  );
};

export default VendingMachine;

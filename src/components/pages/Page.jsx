import styles from "./Page.module.css";
import { useState, useRef, useEffect } from "react";
import List from "../molecules/List/List";
import NavBar from "../atoms/Navbar/NavBar";
const Page = () => {
  return (
    <>
      <div className={styles.header}>
        <div style={{ width: "100%" }}><NavBar/></div>
      </div>
      <List />
    </>
  );
};

export default Page;

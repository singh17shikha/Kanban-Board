import {
  MdAdd,
  MdMoreHoriz,
  MdOutlineClose,
  MdOutlineStarBorderPurple500,
  MdOutlinePeopleOutline,
  MdFilterList,
  MdOutlineRocketLaunch,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { ImPower } from "react-icons/im";
import styles from "./list.module.css";
import Card from "../Card/Card";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { ImageUrl } from "../../../../src/Constant/constImage";
import { colors } from "../../../../src/Constant/constColor";
const List = () => {
  const [isAddTitle, setIsAddTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [isAddList, setIsAddList] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const innerContentRef = useRef(null);
  const [isBackgroundClicked, setIsBackgroundClicked] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [isbgColorApplied, setIsBgColorApplied] = useState();
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const storedIsBgColorApplied = localStorage.getItem("isbgColorApplied");
    setIsBgColorApplied(storedIsBgColorApplied === "true");
  }, []);

  useEffect(() => {
    const storedBgColor = localStorage.getItem("bgColor");
    const storedBgImage = localStorage.getItem("bgImage");

    if (isbgColorApplied) {
      setBgColor(storedBgColor || "");
    } else {
      setBgImage(storedBgImage || "");
    }

    localStorage.setItem("isbgColorApplied", isbgColorApplied);
  }, [isbgColorApplied]);

  useEffect(() => {
    innerContentRef.current.scrollLeft = innerContentRef.current.scrollWidth;
  }, [divisions]);

  useEffect(() => {
    getAllCards();
  }, []);

  const handleCustomization = () => {
    setIsBackgroundClicked(true);
  };

  const handleChangeBgColor = (index) => {
    setBgColor(colors[index].color);
    setIsBgColorApplied(true);
    localStorage.setItem("bgColor", colors[index].color);
  };

  const handleSubmitUrl = () => {
    if (inputUrl !== "") {
      setBgImage(inputUrl);
      setIsBgColorApplied(false)
      localStorage.setItem("bgImage", inputUrl);
      setInputUrl("");
    }
  };

  const handleChangeBgImage = (index) => {
    setIsBgColorApplied(false);
    setBgImage(ImageUrl[index].url);

    localStorage.setItem("bgImage", ImageUrl[index].url);
    
  };

  const getAllCards = async () => {
    try {
      const response = await axios.get("http://localhost:4000/cards");
      setDivisions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddList = async () => {
    const newCard = {
      id: uuidv4(),
      title: title,
      task: [],
    };

    try {
      const response = await axios.post("http://localhost:4000/cards", newCard);
      console.log("Data written to JSON file:", response.data);
    } catch (error) {
      console.error("Error writing to JSON file:", error);
    }

    const updatedDivisions = [...divisions, newCard];
    if (title !== "") setDivisions(updatedDivisions);
    setTitle("");
    setIsAddList(true);
  };



  return (
    <>
      <div
        className={styles["inner-content"]}
        ref={innerContentRef}
        style={
          isbgColorApplied
            ? { background: bgColor }
            : { background: `url(${bgImage})` }
        }
      >
        <div className={styles["task-board"]}>
          <div className={styles["left-wrapper"]}>
            <div className={styles["board-name"]}>Task Managment</div>
            <div>
              <MdOutlineStarBorderPurple500
                size={18}
                className={styles["star-icon"]}
              />
            </div>
            <div className={styles["work-items"]}>
              <span>
                <MdOutlinePeopleOutline className={styles["people-icon"]} />{" "}
              </span>
              <span className={styles["work-space"]}>Workspace visible</span>
            </div>
            <div className={styles.board}>Board</div>
            <div>
              <MdKeyboardArrowDown size={30} className={styles["down-icon"]} />
            </div>
          </div>

          <div className={styles["right-wrapper"]}>
            <div className={styles["right-items"]}>
              <MdOutlineRocketLaunch className={styles["powerUp-icon"]} />{" "}
              Power-Ups
            </div>
            <div className={styles["right-items"]}>
              <ImPower className={styles["automation-icon"]} />
              Automation
            </div>
            <div className={styles["right-items"]}>
              <MdFilterList className={styles["filter-icon"]} />
              Filters
            </div>
            <div onClick={handleCustomization} className={styles["change-bg"]}>
              Change background
            </div>
            <div onClick={handleCustomization}>
              <MdMoreHoriz size={25} />
            </div>
          </div>
        </div>

        {isBackgroundClicked && (
          <div className={styles.menu}>
            <div className={styles["menu-heading"]}>
              Change background{" "}
              <span
                className={styles.bgColse}
                onClick={() => setIsBackgroundClicked(!isBackgroundClicked)}
              >
                <MdOutlineClose size={25} />
              </span>
            </div>
            <input
              placeholder="Enter Image url"
              className={styles["input-url"]}
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <button className={styles["apply-btn"]} onClick={handleSubmitUrl}>
              Apply
            </button>
            <div className={styles["select-text"]}>Choose Image</div>
            <div className={styles["choose-image"]}>
              {ImageUrl.map((image, index) => (
                <div key={index} className={styles["image-wrapper"]}>
                  <img
                    src={image.url}
                    className={styles.image}
                    onClick={() => handleChangeBgImage(index)}
                  />
                </div>
              ))}
            </div>
            <div className={styles["select-text"]}>Choose Color</div>
            <div className={styles["choose-color"]}>
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleChangeBgColor(index)}
                  className={styles.color1}
                  style={{ backgroundColor: color.color }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {divisions.map((division, index) => (
          <Card
            key={division.id}
            title={division.title}
            data={division}
            cardId={division.id}
            index={index}
          />
        ))}

        {isAddTitle ? (
          <div className={styles["add-title"]}>
            <div>
              <input
                placeholder="Enter list title..."
                value={title}
                className={styles["add-input"]}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <button className={styles["add-btn"]} onClick={handleAddList}>
                Add List
              </button>{" "}
              <span onClick={() => setIsAddTitle(!isAddTitle)}>
                <MdOutlineClose size={25} className={styles["close-btn"]} />
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div>
          <div
            className={styles["add-list"]}
            onClick={() => setIsAddTitle(!isAddTitle)}
          >
            <MdAdd size={25} className={styles["add-icon"]} />
            <span style={{ marginLeft: "2rem" }}>Add another list</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import "./Desc.css";
import {
  EditIcon,
  ViewIcon,
  HamburgerIcon,
  RepeatClockIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import TextEditor from "../../atoms/TextEditor/TextEditor";
import axios from "axios";
import { Avatar, Tooltip, Wrap, WrapItem } from "@chakra-ui/react";
const Desc = () => {
  const card = useSelector((state) => state.kanbanData.card);

  let { taskId } = useParams();

  let filterTask = card.task.filter((task) => task.id === taskId);
  const navigate = useNavigate();
  const [descFocus, setDescFocus] = useState(false);
  const [ActiFocus, setActiveFocus] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [task, setTask] = useState(filterTask[0].taskName);
  const [description, setDescription] = useState(filterTask[0].taskDescription);
  const [cardData, setCardData] = useState(card);

  let found = cardData.task.find((task) => task.id === taskId);
  console.log("found", found);
  const editCardData = () => {
    let editedTasks = cardData.task.map((task) => {
      if (task.id === taskId) {
        return (task = found);
      }
      return task;
    });

    return { ...cardData, task: editedTasks };
  };

  const updateTask = async () => {
    let data = editCardData();
    await axios
      .put(`http://localhost:4000/cards/${card.id}`, data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  // Edit the task
  const handleEditTask = () => {
    found = { ...found, taskName: task };
    updateTask();
    setEditTask(false);
  };

  const tempElement = document.createElement("div");
  tempElement.innerHTML = description;
  const innerText = tempElement.textContent;

  const handleEditDescription = () => {
    found = { ...found, taskDescription: innerText };
    updateTask();
    setDescFocus(false);
    console.log(found);
  };

  return (
    <div className="Desc-page">
      <div className="Desc-container">
        <div className="closeBtn">
          <CloseIcon onClick={() => navigate("/")} />
        </div>
        <div className="Task-div">
          <EditIcon onClick={() => setEditTask(!editTask)} />
          {editTask ? (
            <>
              <input value={task} onChange={(e) => setTask(e.target.value)} />
              <button onClick={handleEditTask}>Save</button>
            </>
          ) : (
            <h3>{task}</h3>
          )}
        </div>
        <div className="Notification">
          <br />
          <p>Notifications</p>
          <button className="Notification-icon">{<ViewIcon />}</button>
        </div>
        <div className="Desc-box">
          <div className="Task-div">
            <HamburgerIcon />
            <h3>Description</h3>
          </div>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
          <div>
            {descFocus ? (
              <div className="Editor">
                <TextEditor
                  description={description}
                  setDescription={setDescription}
                />
                <div className="Editor-button">
                  <button onClick={handleEditDescription}>Save</button>
                  <button
                    onClick={() => {
                      setDescFocus(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Add Description Here..."
                onFocus={() => setDescFocus(true)}
                onBlur={() => setDescFocus(false)}
              />
            )}
            {/* <div dangerouslySetInnerHTML={{__html: this.state.content}}></div> */}
          </div>
          <div>
            <div className="Task-div">
              <RepeatClockIcon />
              <h3>Activity</h3>
            </div>
            <div
              style={{
                height: "100px",
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              {found.activity.map((activity) => {
                return (
                  <div>
                    <div className="activity-div">
                      <Wrap>
                        <WrapItem>
                          <Avatar
                            bg="teal"
                            size="sm"
                            name="Harshit Sachan"
                            src="https://bit.ly/tioluwani-kolawole"
                          />
                        </WrapItem>
                      </Wrap>
                      {activity.status ?
                        <p>{activity.status}</p> :
                        <p>Harshit Sachan created this card</p>
                      }
                    </div>
                    <p className="time-stamp">{activity.timeStamp}</p>
                  </div>
                );
              })}
            </div>
            {/* <div>
              {ActiFocus ? (
                <div className="Editor">
                  <TextEditor />
                  <div className="Editor-button">
                    <button onClick={() => setActiveFocus(false)}>Save</button>
                    <button onClick={() => setActiveFocus(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Add Activity Here..."
                  onFocus={() => setActiveFocus(true)}
                  onBlur={() => setActiveFocus(false)}
                />
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desc;

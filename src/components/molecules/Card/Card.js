import { MdMoreHoriz, MdAdd, MdClose, MdDescription, MdOutlineDelete } from "react-icons/md";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { setCardObject } from "../../../redux/reducers/reducers"
import styles from "./card.module.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Card = ({ title, cardId }) => {
	const [isAddTitle, setIsAddTitle] = useState(false);
	const [addTitle, setAddTitle] = useState("");
	const [tasks, setTasks] = useState([]);
	const [editedTaskName, setEditedTaskName] = useState('')
	const [isMoreClicked, setIsMoreClicked] = useState(false)
	const [cardDeleted, setCardDeleted] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch()

	useEffect(() => {
		fetchTasks();
	}, [cardId]);

	//This function is used to call the json file for fetching the data
	const fetchTasks = async () => {
		try {
			const response = await axios.get("http://localhost:4000/cards");
			const tasksData = response.data;
			setTasks(tasksData);
		} catch (error) {
			console.error("Error fetching tasks data:", error);
		}
	};

	// This function is used to add/update the task to the particular card task list
	const handleAddUpdateTask = async () => {
		if (addTitle.trim() !== "") {
			const newTask = {
				id: uuidv4(),
				taskName: addTitle.charAt(0).toUpperCase() + addTitle.slice(1).trim(),
				taskDescription: '',
				activity: []
			};
			const updatedTasks = tasks.map((task) => {
				if (task.id === cardId) {
					return {
						...task,
						task: [...task.task, newTask],
					};
				}
				return task;
			});

			try {
				const changedTaskIndex = updatedTasks.findIndex((task) => task.id === cardId);
				await axios.put(`http://localhost:4000/cards/${cardId}`, updatedTasks[changedTaskIndex]);
				setTasks((prevState) => {
					const updatedState = [...prevState];
					updatedState[changedTaskIndex] = updatedTasks[changedTaskIndex];
					return updatedState;
				});
				setAddTitle("");
				setIsAddTitle(false);
			} catch (error) {
				console.error("Error updating task data:", error);
			}
		}
	};

	//This is used to bind the task to the particular card
	const filteredTasks = tasks.find((task) => task.id === cardId)?.task || [];

	// This function is used to route to a particular page based on the task id
	const handleRouteClick = (taskId) => {
		let particularTaskObj = filteredTasks.find((task) => task.id === taskId);
		let cardObject = tasks.find((card) => card.id === cardId);
		dispatch(setCardObject(cardObject));
		navigate(`/description/${taskId}/${particularTaskObj.taskName}`);
	};

	const handleMoreIcon = () => {
		setIsMoreClicked(true)
	}

	// This method is used to delete the particular card
	const handleDeleteCard = async () => {
		try {
			await axios.delete(`http://localhost:4000/cards/${cardId}`);
			setTasks(prevTasks => prevTasks.filter(card => card.id !== cardId));
			setCardDeleted(true);
		} catch (error) {
			console.error("Error deleting card:", error);
		}
	};

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const { source, destination } = result;
		const updatedTasks = [...tasks];

		const sourceTaskIndex = updatedTasks.findIndex((task) => task.id === cardId);
		const sourceTask = updatedTasks[sourceTaskIndex];
		const updatedTaskList = Array.from(sourceTask.task);

		const [draggedTask] = updatedTaskList.splice(source.index, 1);
		updatedTaskList.splice(destination.index, 0, draggedTask);

		const updatedSourceTask = {
			...sourceTask,
			task: updatedTaskList.map((task, index) => {
				if (task.id === draggedTask.id) {
					return {
						...task,
						activity: [
							...task.activity,
							{
								status: `Moved from position ${source.index} to position ${destination.index}`,
								timeStamp: new Date().toLocaleString(),
							},
						],
					};
				}
				return task;
			}),
		};

		updatedTasks.splice(sourceTaskIndex, 1, updatedSourceTask);

		try {
			await axios.put(`http://localhost:4000/cards/${cardId}`, updatedSourceTask);
			setTasks(updatedTasks);
		} catch (error) {
			console.error("Error updating task order:", error);
		}
	};

	// This method is used to delete a particular task of a particular card
	const handleTaskDelete = async (taskId) => {
		try {
			const card = tasks.find((card) => card.id === cardId);
			if (card) {
				const taskIndex = card.task.findIndex((task) => task.id === taskId);
				if (taskIndex !== -1) {
					delete card.task[taskIndex];
					card.task = card.task.filter(Boolean)
					await axios.put(`http://localhost:4000/cards/${cardId}`, card);
					fetchTasks();
				}
			}
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	return (
		!cardDeleted && (
			<div className={styles["add-Card"]}>
				<div className={styles["title-more-icon"]}>
					<span className={styles.title}>{title}</span>
					<span onClick={handleMoreIcon}>
						<MdMoreHoriz className={isMoreClicked ? styles["more-icon-hidden"] : styles["more-icon"]} />
					</span>
					{isMoreClicked && <div onClick={handleDeleteCard}><MdOutlineDelete className={styles["delete-icon"]} size={25} /></div>}
				</div>

				<DragDropContext onDragEnd={handleDragEnd}>
					<div className={styles["task-container"]}>
						<Droppable droppableId="card-droppable">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={styles["task-container"]}
								>
									{filteredTasks.map((subTask, index) => (
										<Draggable
											key={subTask.id}
											draggableId={subTask.id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
													className={styles["task-item"]}
												>
													<span style={{ marginLeft: "1rem" }} className={`${styles["task-name"]}`}>{subTask.taskName}</span>
													<span style={{ marginRight: "0.3rem" }}>
														<MdDescription size={20} onClick={() => handleRouteClick(subTask.id)} />
													</span>
													<span style={{ marginRight: "0.3rem" }}>
														<MdOutlineDelete size={20} onClick={() => handleTaskDelete(subTask.id)} />
													</span>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</DragDropContext>



				{isAddTitle && (
					<div className={styles["add-title"]}>
						<div>
							<FloatingLabel controlId="floatingTextarea2">
								<Form.Control
									as="textarea"
									placeholder="Enter a title for this card..."
									style={{ minHeight: '300px', overflow: 'hidden' }}
									className={styles["add-input"]}
									value={editedTaskName !== "" ? editedTaskName : addTitle}
									onChange={(e) => setAddTitle(e.target.value)}
								/>
							</FloatingLabel>
						</div>

						<div>
							<button className={styles["add-btn"]} onClick={handleAddUpdateTask}>
								Add task
							</button>

							<span onClick={() => setIsAddTitle(false)}>
								<MdClose size={25} className={styles["close-btn"]} />
							</span>
						</div>
					</div>
				)}

				{!isAddTitle && (
					<div onClick={() => setIsAddTitle(true)}>
						<div className={styles["add-list"]}>
							<MdAdd className={styles["add-icon"]} size={25} />
							<span className={styles["add-text"]}>Add task</span>
						</div>
					</div>
				)}

			</div>
		)
	);
};

export default Card;

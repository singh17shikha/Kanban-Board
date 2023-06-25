import { createSlice } from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
  name: "kanban",
  initialState: {
    tasks: [],
    card: {},
  },
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action) {
      const { id, title, description } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.title = title;
        task.description = description;
      }
    },
    deleteCard: (state, action) => {
      const cardId = action.payload;
      return state.filter((card) => card.id !== cardId);
    },
    setCardObject: (state, action) => {
      state.card = action.payload;
    },
  },
});

export const { addTask, deleteCard, updateTask, setCardObject } =
  kanbanSlice.actions;
export default kanbanSlice.reducer;

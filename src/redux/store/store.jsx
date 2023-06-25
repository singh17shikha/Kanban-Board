import { configureStore } from "@reduxjs/toolkit";
import kanbanSlice from "../reducers/reducers";
export const store = configureStore({
  reducer: { kanbanData: kanbanSlice },
});

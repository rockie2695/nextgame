import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import socketConnectionReducer from "../features/socketConnection/socketConnectionSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    socketConnection: socketConnectionReducer,
  },
});

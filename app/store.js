import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import socketConnectionReducer from "../features/socketConnection/socketConnectionSlice";
import addRoomValueReducer from "../features/addRoomValue/addRoomValueSlice";
import handCardReducer from "../features/handCard/handCardSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    socketConnection: socketConnectionReducer,
    addRoomValue: addRoomValueReducer,
    handCard: handCardReducer,
  },
});

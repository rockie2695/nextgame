import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import socketConnectionReducer from "../features/socketConnection/socketConnectionSlice";
import addRoomValueReducer from "../features/addRoomValue/addRoomValueSlice";
import handCardReducer from "../features/handCard/handCardSlice";
import handCardLengthReducer from "../features/handCard/handCardLengthSlice";
import cardLengthReducer from "../features/card/cardLengthSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    socketConnection: socketConnectionReducer,
    addRoomValue: addRoomValueReducer,
    handCard: handCardReducer,
    handCardLength: handCardLengthReducer,
    cardLength: cardLengthReducer,
  },
});

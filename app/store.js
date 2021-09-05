import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import socketConnectionReducer from "../features/socketConnection/socketConnectionSlice";
import addRoomValueReducer from "../features/addRoomValue/addRoomValueSlice";
import handCardReducer from "../features/handCard/handCardSlice";
import handCardLengthReducer from "../features/handCard/handCardLengthSlice";
import cardLengthReducer from "../features/card/cardLengthSlice";
import orderReducer from "../features/order/orderSlice";
import enemyEmailReducer from "../features/enemyEmail/enemyEmailSlice";
import bloodReducer from "../features/blood/bloodSlice";
import deadCardReducer from "../features/deadCard/deadCardSlice";
import boardActionReducer from "../features/boardAction/boardActionSlice";
import roundReducer from "../features/round/roundSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    socketConnection: socketConnectionReducer,
    addRoomValue: addRoomValueReducer,
    handCard: handCardReducer,
    handCardLength: handCardLengthReducer,
    cardLength: cardLengthReducer,
    order: orderReducer,
    enemyEmail: enemyEmailReducer,
    blood: bloodReducer,
    deadCard: deadCardReducer,
    boardAction: boardActionReducer,
    round: roundReducer,
  },
});

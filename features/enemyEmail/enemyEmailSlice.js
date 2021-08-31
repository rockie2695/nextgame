import { createSlice } from "@reduxjs/toolkit";

export const enemyEmailSlice = createSlice({
  name: "enemyEmailSlice",
  initialState: {
    value: "",
  },
  reducers: {
    setEnemyEmail: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEnemyEmail } = enemyEmailSlice.actions;

export const findEnemyEmail = (order, email) => (dispatch, getState) => {
  myOrderIndex = order.indexOf(email);
  if (myOrderIndex == 0) {
    dispatch(setEnemyEmail(order[1]));
  }
  if (myOrderIndex == 1) {
    dispatch(setEnemyEmail(order[0]));
  }
  //dispatch(findEnemyEmail(message.order,session.user.email));
};

export default enemyEmailSlice.reducer;

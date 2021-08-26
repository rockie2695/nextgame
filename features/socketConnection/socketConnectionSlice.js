import { createSlice } from "@reduxjs/toolkit";

export const socketConnectionSlice = createSlice({
  name: "socketConnection",
  initialState: {
    value: true,
  },
  reducers: {
    successConnect: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true;
    },
    failConnect: (state) => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { successConnect, failConnect } = socketConnectionSlice.actions;

export default socketConnectionSlice.reducer;

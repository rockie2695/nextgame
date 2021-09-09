import { createSlice } from "@reduxjs/toolkit";

export const boardActionSlice = createSlice({
  name: "boardAction",
  initialState: {
    value: {},
  },
  reducers: {
    setBoardAction: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    initBoardAction: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBoardAction, initBoardAction } = boardActionSlice.actions;

export default boardActionSlice.reducer;

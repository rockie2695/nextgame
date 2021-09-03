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
  },
});

// Action creators are generated for each case reducer function
export const { setBoardAction } = boardActionSlice.actions;

export default boardActionSlice.reducer;

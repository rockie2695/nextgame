import { createSlice } from "@reduxjs/toolkit";

export const roundSlice = createSlice({
  name: "round",
  initialState: {
    value: {},
  },
  reducers: {
    setRound: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    initRound: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRound, initRound } = roundSlice.actions;

export default roundSlice.reducer;

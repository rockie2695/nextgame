import { createSlice } from "@reduxjs/toolkit";

export const cardLengthSlice = createSlice({
  name: "cardLength",
  initialState: {
    value: {},
  },
  reducers: {
    changeCardLength: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    initCardLength: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeCardLength, initCardLength } = cardLengthSlice.actions;

export default cardLengthSlice.reducer;

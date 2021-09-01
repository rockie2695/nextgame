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
  },
});

// Action creators are generated for each case reducer function
export const { changeCardLength } = cardLengthSlice.actions;

export default cardLengthSlice.reducer;

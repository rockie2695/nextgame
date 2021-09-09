import { createSlice } from "@reduxjs/toolkit";

export const handCardLengthSlice = createSlice({
  name: "handCardLength",
  initialState: {
    value: {},
  },
  reducers: {
    changeHandCardLength: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    initHandCardLength: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeHandCardLength, initHandCardLength } =
  handCardLengthSlice.actions;

export default handCardLengthSlice.reducer;

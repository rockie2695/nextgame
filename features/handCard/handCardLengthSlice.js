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
  },
});

// Action creators are generated for each case reducer function
export const { changeHandCardLength } = handCardLengthSlice.actions;

export default handCardLengthSlice.reducer;

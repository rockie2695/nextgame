import { createSlice } from "@reduxjs/toolkit";

export const handCardLengthSlice = createSlice({
  name: "handCardLength",
  initialState: {
    value: {},
  },
  reducers: {
    changehandCardLength: (state, action) => {
      return { ...state.value, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { changehandCardLength } = handCardLengthSlice.actions;

export default handCardLengthSlice.reducer;

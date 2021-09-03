import { createSlice } from "@reduxjs/toolkit";

export const bloodSlice = createSlice({
  name: "blood",
  initialState: {
    value: {},
  },
  reducers: {
    setBlood: (state, action) => {
      state.value = {...state.value, ...action.payload};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBlood } = bloodSlice.actions;

export default bloodSlice.reducer;

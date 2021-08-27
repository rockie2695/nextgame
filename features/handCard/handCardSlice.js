import { createSlice } from "@reduxjs/toolkit";

export const handCardSlice = createSlice({
  name: "handCard",
  initialState: {
    value: [],
  },
  reducers: {
    setHandCard: (state, action) => {
      state.value = [...state.value, ...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHandCard } = handCardSlice.actions;

export default handCardSlice.reducer;

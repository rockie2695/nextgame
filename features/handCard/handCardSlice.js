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
    
    initHandCard: (state, action) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHandCard, initHandCard } = handCardSlice.actions;

export default handCardSlice.reducer;

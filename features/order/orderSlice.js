import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    value: [],
  },
  reducers: {
    setOrder: (state, action) => {
      state.value = [...state.value, ...action.payload];
    },
    initOrder: (state, action) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrder, initOrder } = orderSlice.actions;

export default orderSlice.reducer;

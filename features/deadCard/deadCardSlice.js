import { createSlice } from "@reduxjs/toolkit";

export const deadCardSlice = createSlice({
  name: "deadCard",
  initialState: {
    value: {},
  },
  reducers: {
    setDeadCard: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDeadCard } = deadCardSlice.actions;

export default deadCardSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const groundCardSlice = createSlice({
  name: "groundCard",
  initialState: {
    value: {},
  },
  reducers: {
    setGroundCard: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    addGroundCard: (state, action) => {
      state.value = {
        ...state.value,
        [action.payload.key]: [
          ...state.value[action.payload.key],
          ...action.payload.value,
        ],
      };
    },
    initGroundCard: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGroundCard, initGroundCard, addGroundCard } =
  groundCardSlice.actions;

export default groundCardSlice.reducer;

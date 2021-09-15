import { createSlice } from "@reduxjs/toolkit";

export const boardActionSlice = createSlice({
  name: "boardAction",
  initialState: {
    value: {},
  },
  reducers: {
    setBoardAction: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    changeBoardAction: (state, action) => {
      state.value = {
        ...state.value,
        [action.payload.key]:
          state.value[action.payload.key] + action.payload.value,
      };
    },
    initBoardAction: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBoardAction, initBoardAction, changeBoardAction } =
  boardActionSlice.actions;

export default boardActionSlice.reducer;

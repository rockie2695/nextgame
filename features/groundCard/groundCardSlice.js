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
        [action.payload.email]: [
          ...state.value[action.payload.email],
          action.payload.value,
        ],
      };
    },
    initGroundCard: (state, action) => {
      state.value = {};
    },
    putGroundCardAttr: (state, action) => {
      let Index = state.value[action.payload.email].findIndex(
        (row) => row.cardId === action.payload.value.cardId
      );
      state.value[action.payload.email][Index] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setGroundCard,
  initGroundCard,
  addGroundCard,
  putGroundCardAttr,
} = groundCardSlice.actions;

export default groundCardSlice.reducer;

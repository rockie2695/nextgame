import { createSlice } from "@reduxjs/toolkit";
import { isArray } from "lodash";

export const handCardSlice = createSlice({
  name: "handCard",
  initialState: {
    value: [],
  },
  reducers: {
    setHandCard: (state, action) => {
      state.value = [...state.value, ...action.payload];
    },
    removeHandCard: (state, action) => {
      if (isArray(action.payload)) {
        for (const row of action.payload) {
          state.value = state.value.filter(
            ({ cardId }) => cardId !== row.cardId
          );
        }
      } else {
        state.value = state.value.filter(
          ({ cardId }) => cardId !== action.payload.cardId
        );
      }
    },
    initHandCard: (state, action) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHandCard, initHandCard, removeHandCard } =
  handCardSlice.actions;

export default handCardSlice.reducer;

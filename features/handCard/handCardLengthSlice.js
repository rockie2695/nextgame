import { createSlice } from "@reduxjs/toolkit";

export const handCardLengthSlice = createSlice({
  name: "handCardLength",
  initialState: {
    value: {},
  },
  reducers: {
    setHandCardLength: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    changeHandCardLength: (state, action) => {
      state.value = {
        ...state.value,
        [action.payload.key]:
          state.value[action.payload.key] + action.payload.value,
      };
    },
    initHandCardLength: (state, action) => {
      state.value = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHandCardLength, changeHandCardLength, initHandCardLength } =
  handCardLengthSlice.actions;

export default handCardLengthSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const addRoomValueSlice = createSlice({
  name: "addRoomValue",
  initialState: {
    value: "",
  },
  reducers: {
    changeAddRoomValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeAddRoomValue } = addRoomValueSlice.actions;

export default addRoomValueSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userFields: [],
    otherFields: []
};
  
  const fieldSlice = createSlice({
    name: 'field',
    initialState,
    reducers: {
      setOtherFields(state, action) {
        state.otherFields = action.payload;
      },
      setUserFields(state, action) {
        state.userFields = action.payload;
      },
      addField(state, action) {
        state.userFields.push(action.payload);
      },
      updateField(state, action) {
        const index = state.userFields.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.userFields[index] = action.payload;
      },
      deleteField(state, action) {
        state.userFields = state.userFields.filter(item => item._id !== action.payload);
      },
    },
  });
  
  export const { setUserFields, setOtherFields, addField, updateField, deleteField } = fieldSlice.actions;
  export default fieldSlice.reducer;
  
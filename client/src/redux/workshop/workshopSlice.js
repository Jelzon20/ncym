import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentWorkshop: null,
  error: null,
  loading: false,
};

const registerSlice = createSlice({
  name: 'workshop',
  initialState,
  reducers: {
    
  },
});

export const {
    
    
} = workshopSlice.actions;

export default workshopSlice.reducer;
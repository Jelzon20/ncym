import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRegister: null,
  error: null,
  loading: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.currentRegister = action.payload;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRegistrationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRegistrationSuccess: (state, action) => {
      state.currentRegister = action.payload;
      state.loading = false;
      state.error = null;
    },
    getRegistrationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateRegStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRegSuccess: (state, action) => {
      state.currentRegister = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateRegFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearRegSuccess: (state) => {
      state.currentRegister = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
    registerStart,
    registerSuccess,
    registerFailure,
    getRegistrationStart,
    getRegistrationSuccess,
    getRegistrationFailure,
    updateRegStart,
    updateRegSuccess,
    updateRegFailure,
    clearRegSuccess
    
} = registerSlice.actions;

export default registerSlice.reducer;
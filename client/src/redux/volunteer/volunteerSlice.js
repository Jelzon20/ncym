import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVolunteer: null,
  error: null,
  loading: false,
};

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    volunteerSignInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    volunteerSignInSuccess: (state, action) => {
      state.currentVolunteer = action.payload;
      state.loading = false;
      state.error = null;
    },
    volunteerSignInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // updateStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // updateSuccess: (state, action) => {
    //   state.currentUser = action.payload;
    //   state.loading = false;
    //   state.error = null;
    // },
    // updateFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },
    // deleteUserStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // deleteUserSuccess: (state) => {
    //   state.currentUser = null;
    //   state.loading = false;
    //   state.error = null;
    // },
    // deleteUserFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },
    volunteerSignoutSuccess: (state) => {
      state.currentVolunteer = null;
      state.error = null;
      state.loading = false;
    },
    // updateOtherUserStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // updateOtherUserSuccess: (state, action) => {
    //   state.loading = false;
    //   state.error = null;
    // },
    // updateOtherUserFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },
  },
});

export const {
  volunteerSignInStart,
  volunteerSignInSuccess,
  volunteerSignInFailure,
  volunteerSignoutSuccess
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   updateOtherUserStart,
//   updateOtherUserSuccess,
//   updateOtherUserFailure
} = volunteerSlice.actions;

export default volunteerSlice.reducer;
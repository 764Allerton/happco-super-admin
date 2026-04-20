import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "Rtk/services/user";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    // Additional state properties can be defined here if needed
  },
  reducers: {
    clearUserData: (state) => {
      state.userData = {};
    },
    resetApiState: (state, action) => {
      const tagName = action.payload;

      if (tagName === 'Company') {
        // Reset logic for the Company tag
        state.userData = {}; // Clear specific data related to Company if needed
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserData.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload.data;
      }
    );
  }
});

// Export actions
export const { clearUserData, resetApiState } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
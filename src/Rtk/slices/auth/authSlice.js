import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../../services/auth'
import { profileApi } from 'Rtk/services/profile'

const authSlice = createSlice({
  name: 'auth',
  initialState: { authData: {}, adminData: {} },
  reducers: {
    clearAuthData: state => {
      state.authData = null
      state.adminData = {}
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        // Store the entire payload in authData
        state.authData = payload.data
        // Extract full_name and profile_pic for adminData
        state.adminData = {
          first_name: payload?.data?.first_name, // Using full_name for the name
          last_name: payload?.data?.last_name, // Using full_name for the name
          profile_pic: payload?.data.profile_pic // Using profile_pic for the image
        }
      }
    );
    builder.addMatcher(
      profileApi.endpoints.updateAdminData.matchFulfilled,
      (state, { payload }) => {
        state.adminData = {
          first_name: payload.data.first_name,
          last_name: payload?.data?.last_name,
          profile_pic: payload.data.profile_pic,
        };
      }
    );
  }
})

export const { clearAuthData } = authSlice.actions

export default authSlice.reducer


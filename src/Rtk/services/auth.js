import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoints } from 'Utils/ApiEndpoints';

const baseUrl = process.env.REACT_APP_BASE_URL
export const authApi = createApi({
    baseQuery: fetchBaseQuery({
        reducerPath: 'authApi',
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => {
                return ({
                    url: apiEndpoints?.loginUrl,
                    method: "POST",
                    body: credentials
                })
            }
        }),
        signUp: builder.mutation({
            query: (userData) => ({
                url: apiEndpoints?.signUpUrl,
                method: 'POST',
                body: userData
            })
        }),
        forgetPassword: builder.mutation({
            query: (credentials) => ({
                url: apiEndpoints?.forgetUrl,
                method: 'POST',
                body: { ...credentials }
            })
        }),
        verifyOtp: builder.mutation({
            query: (otpData) => ({
                url: apiEndpoints?.otpVerifyUrl,
                method: 'POST',
                body: otpData
            })
        }),
        resendOtp: builder.mutation({
            query: (credentials) => ({
                url: apiEndpoints?.resendOtpUrl,
                method: 'POST',
                body: { ...credentials }
            })
        }),
        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: apiEndpoints?.resetPasswordUrl,
                method: 'POST',
                body: resetData
            })
        }),
        getUserProfile: builder.query({
            query: () => ({
                url: apiEndpoints?.profileUrl,
                method: 'GET',
            }),
        }),
        
    })
});

export const {
    useLoginMutation,
    useForgetPasswordMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useSignUpMutation
    } = authApi;

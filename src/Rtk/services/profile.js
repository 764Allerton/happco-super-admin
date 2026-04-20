import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoints } from 'Utils/ApiEndpoints';

const baseUrl = process.env.REACT_APP_BASE_URL

const baseQueryWithReauth = async (args, api, extraOptions) => {

    const token = api.getState().auth?.authData?.token;

    // If token is invalid, stop execution and return an error-like object
    if (!token || token === '' || token === null || token === undefined) {
        console.warn("No valid token found. Aborting API call.");
        return {
            error: {
                status: 401,
                data: { message: 'Unauthorized: No valid token provided' }
            }
        };
    }

    let result = await fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${token}`);
            if (!(args.body instanceof FormData)) {
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    })(args, api, extraOptions);

    if (result?.error && result?.error.status === 401) {
        localStorage.clear();
        window.location.href = '/';
    }

    return result;
};

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getDataProfile: builder.query({
            query: () => ({
                url: `${apiEndpoints?.getProfileData}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.updatePassword,
                method: "POST",
                body: data
            }),
            providesTags: ['User'],
        }),
        updateAdminData: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.updateAdmin,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        getDashboard: builder.query({
            query: () => ({
                url: `${apiEndpoints?.getDashboardUrl}`,
                method: 'POST',
            }),
        }),
        getDashboardGraph: builder.query({
            query: () => ({
                url: `${apiEndpoints?.getDashboardGraphUrl}`,
                method: 'GET',
            }),
        }),
    })
});

export const {
    useUpdatePasswordMutation, useUpdateAdminDataMutation, useGetDataProfileQuery, useGetDashboardQuery, useGetDashboardGraphQuery
} = profileApi;
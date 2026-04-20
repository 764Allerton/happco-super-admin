import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoints } from 'Utils/ApiEndpoints';
const baseUrl = process.env.REACT_APP_BASE_URL

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.authData?.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    })(args, api, extraOptions);

    if (result?.error && result?.error.status === 401) {
        window.location.href = '/'
    }
    return result;
};

export const hcApi = createApi({
    reducerPath: 'hcApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getHcData: builder.query({
            query: ({ page, limit, type, searchData = '' }) => ({
                url: `${apiEndpoints?.hcGetUrl}?page=${page}&limit=${limit}&type=${type ?? ''}&searchQuery=${searchData}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getHcDetails: builder.query({
            query: (userId) => ({
                url: `${apiEndpoints?.hcDetailsUrl}?id=${userId}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        hcAddDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.hcAddDetailsUrl,
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['User'],
        }),
        updateHcDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.hcUpdateDetailsUrl,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    })
});

export const {
    useGetHcDataQuery, 
    useGetHcDetailsQuery, 
    useUpdateHcDetailsMutation, 
    useHcAddDetailsMutation
} = hcApi;

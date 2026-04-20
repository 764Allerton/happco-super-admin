import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiEndpoints } from 'Utils/ApiEndpoints';
import Toast from 'Utils/Toast';

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
                Toast('e',result?.error?.message )
    }
    return result;
};

export const cltApi = createApi({
    reducerPath: 'cltApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getCltData: builder.query({
            query: ({ page, limit, type, searchData="" }) => ({
                url: `${apiEndpoints?.cltGetUrl}?page=${page}&limit=${limit}&type=${type ?? ''}&searchQuery=${searchData}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getCltList: builder.query({
            query: ({ page, limit, type, searchData="" }) => ({
                url: `${apiEndpoints?.cltGetUrl}?type=${type ?? ''}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getCltDetails: builder.query({
            query: (userId) => ({
                url: `${apiEndpoints?.cltDetailsUrl}?id=${userId}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        addCltDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.cltAddDetailsUrl,
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['User'],
        }),
        updateCltDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.cltUpdateDetailsUrl,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    })
});

export const {
    useGetCltDataQuery, useGetCltListQuery, useGetCltDetailsQuery, useUpdateCltDetailsMutation, useAddCltDetailsMutation
} = cltApi;

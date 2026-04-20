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

export const happCoachApi = createApi({
    reducerPath: 'happCoachApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getHappCoachData: builder.query({
            query: ({ page, limit, type ,searchData = ''}) => ({
                url: `${apiEndpoints?.happcoachGetUrl}?page=${page}&limit=${limit}&type=${type ?? ''}&searchQuery=${searchData}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getHappCoachList: builder.query({
            query: ({ page, limit, type ,searchData = ''}) => ({
                url: `${apiEndpoints?.happcoachGetUrl}?type=${type ?? ''}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getHappCoachDetails: builder.query({
            query: ({id}) => ({
                url: `${apiEndpoints?.happcoachDetailsUrl}?Id=${id}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        addHappCoachDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.happcoachAddDetailsUrl,
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['User'],
        }),
        updateHappCoachDetails: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.happcoachUpdateDetailsUrl,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    })
});

export const {
    useGetHappCoachDataQuery, 
    useGetHappCoachListQuery, 
    useGetHappCoachDetailsQuery, 
    useUpdateHappCoachDetailsMutation, 
    useAddHappCoachDetailsMutation
} = happCoachApi;

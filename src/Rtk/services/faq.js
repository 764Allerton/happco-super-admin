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

export const faqApi = createApi({
    reducerPath: 'faqApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Faq'],
    endpoints: (builder) => ({
        getFaqData: builder.query({
            query: ({ page, limit, searchData }) => ({
                url: `${apiEndpoints?.faqGetUrl}`,
                method: 'GET',
            }),
            providesTags: ['Faq'],
        }),
        updateFaq: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.faqUpdateUrl,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Faq'],
        }),
        addFaq: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.addFaqUrl,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Faq'],
        }),
    })
});

export const {
    useGetFaqDataQuery, useUpdateFaqMutation
} = faqApi;

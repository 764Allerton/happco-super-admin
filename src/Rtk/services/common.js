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

            if (!(args.body instanceof FormData)) {
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    })(args, api, extraOptions);

    if (result?.error && result?.error.status === 401) {
        window.location.href = '/'
    }
    return result;
};

export const commonApi = createApi({
    reducerPath: 'commonApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.imageUploadUrl,
                method: "POST",
                body: data,
                // isFormData: true
            }),
        }),
    })
});

export const {
    useUploadImageMutation
} = commonApi;

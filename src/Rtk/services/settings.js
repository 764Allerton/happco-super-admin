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

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getSettingsData: builder.query({
            query: () => ({
                url: `${apiEndpoints?.settingsGetUrl}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateSettings: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.settingsUpdateUrl,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
    })
});

export const {
    useGetSettingsDataQuery,useUpdateSettingsMutation
} = settingsApi;

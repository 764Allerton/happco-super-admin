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

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUserData: builder.query({
            query: ({ page, limit, searchData }) => ({
                url: `${apiEndpoints?.userGetUrl}?page=${page}&limit=${limit}&search_key=${searchData ?? ''}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        getUserDataDetails: builder.query({
            query: (userId) => ({
                url: `${apiEndpoints?.userDetailsUrl}?user_id=${userId}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserStatus: builder.mutation({
            query: (data) => ({
                url: apiEndpoints?.userStatusUrl,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        getDashboardData: builder.query({
            query: () => ({
                url: `${apiEndpoints?.userDashboardUrl}`,
                method: 'GET',
            }),
        }),
        AssignedMemberListing: builder.query({
            query: ({ page, limit, userId, role, divisionId, departmentId }) => ({
                url: `${apiEndpoints?.AssignedMemberListing}?page=${page}&limit=${limit}&userId=${userId}&role=${role}&divisionId=${divisionId}&departmentId=${departmentId}`,
                method: 'GET',
            }),
        }),
        actionList: builder.query({
            query: ({ user_id, type, startDate, endDate }) => {
                if (!type || !user_id) {
                    return null;
                } else if (!startDate || !endDate) {
                    return {
                        url: `${apiEndpoints?.getActionCountAdmin}?userId=${user_id}&type=${type}`,
                        method: 'GET'
                    }
                } else {
                    return {
                        url: `${apiEndpoints?.getActionCountAdmin}?userId=${user_id}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
                        method: 'GET'
                    }
                }
            },
            providesTags: ['Company']
        }),
        getEmpDropdown: builder.query({
            query: ({ user_id }) => ({
                url: `${apiEndpoints?.getUserDropdownById}?userId=${user_id}`,
                method: 'GET'
            }),
            providesTags: ['Company']
        }),
        getHCListByType: builder.query({
            query: ({ type }) => {
                if (!type) return null;
                return {
                    url: `${apiEndpoints?.getCommonHCList}?type=${type}`,
                    method: 'GET'
                }
            },
            providesTags: ['Company']
        }),
        getMemberDetailById: builder.query({
            query: ({ userId }) => {
                if (!userId) return null;
                return {
                    url: `${apiEndpoints?.companygetEmpByEmpIdUrl}?user_id=${userId}`,
                    method: 'GET'
                }
            },
            providesTags: ['Company']
        }),
    })
});

export const {
    useGetUserDataQuery,
    useGetUserDataDetailsQuery,
    useUpdateUserStatusMutation,
    useGetDashboardDataQuery,
    useAssignedMemberListingQuery,
    useActionListQuery,
    useGetEmpDropdownQuery,
    useGetHCListByTypeQuery,
    useGetMemberDetailByIdQuery
} = userApi;

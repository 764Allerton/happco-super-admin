import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiEndpoints } from 'Utils/ApiEndpoints'

const baseUrl = process.env.REACT_APP_BASE_URL

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.authData?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      if (args.body instanceof FormData) {
        headers.set('Content-Type', 'multipart/form-data')
      } else {
        headers.set('Content-Type', 'application/json')
      }
      return headers
    }
  })(args, api, extraOptions)

  if (result?.error && result?.error.status === 401) {
    window.location.href = '/'
  }
  return result
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Company'],
  endpoints: builder => ({
    getCompanyData: builder.query({
      query: ({ page, limit, type, searchData = '' }) => ({
        url: `${apiEndpoints?.getCompanyUrl}?page=${page}&limit=${limit}&type=${type ?? ''
          }&searchQuery=${searchData}`,
        method: 'GET'
      }),
      providesTags: ['Company']
    }),
    getCompanyDetails: builder.query({
      query: CompanyId => ({
        url: `${apiEndpoints?.getCompanyDetailUrl}?id=${CompanyId}`,
        method: 'GET'
      })
    }),
    companyAddDetails: builder.mutation({
      query: data => ({
        url: apiEndpoints?.addCompanyUrl,
        method: 'POST',
        body: { ...data },
        isFormData: true
      }),
      invalidatesTags: ['Company']
    }),
    addCompanyDetails: builder.mutation({
      query: data => ({
        url: apiEndpoints?.addDetailCompanyUrl,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Company']
    }),
    getCompanyList: builder.query({
      query: () => ({
        url: apiEndpoints?.getCompanyListing,
        method: 'GET'
      }),
      providesTags: ['Company']
    }),
    addCompanyDivision: builder.mutation({
      query: data => ({
        url: apiEndpoints?.addCompanyDivision,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Company']
    }),
    updateCompanyDetails: builder.mutation({
      query: data => ({
        url: apiEndpoints?.updateCompanyStatus,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Company']
    }),
    getDeptList: builder.query({
      query: ({ divisionId }) => {
        if (!divisionId) {
          return null;
        } else {
          return {
            url: `${apiEndpoints?.getDeptListUrl}?divisionId=${divisionId}`,
            method: 'GET'
          }
        }
      },
      providesTags: ['Company']
    }),
    getCompanyDetailsGraphActiveUSers: builder.query({
      query: ({ divisionId, companyId, startDate, endDate }) => {
        if (startDate == null || endDate == null ) {
          return {
            url: `${apiEndpoints?.companyDetailsGraphActiveUSersUrl}?companyId=${companyId}&divisionId=${divisionId}`,
            method: 'GET'
          }
        } else {
          return {
            url: `${apiEndpoints?.companyDetailsGraphActiveUSersUrl}?companyId=${companyId}&divisionId=${divisionId}&startDate=${startDate}&endDate=${endDate}`,
            method: 'GET'
          }
        }
      },
      providesTags: ['Company']
    }),
    getCompanyDetailsGraphDrAction: builder.query({
      query: ({ type, divisionId, companyId }) => ({
        url: `${apiEndpoints?.companyDetailsGraphDrActionUrl}?companyId=${companyId}&divisionId=${divisionId}`,
        method: 'GET'
      }),
      providesTags: ['Company']
    }),
    getEmpByType: builder.query({
      query: ({ divisionId, companyId, page, limit, type, departmentId }) => ({
        url: `${apiEndpoints?.companygetEmpByType}?companyId=${companyId}&divisionId=${divisionId}&page=${page}&limit=${limit}&type=${type}&departmentId=${departmentId}`,
        method: 'GET'
      })
      // providesTags: ['Company'],
    }),
    getEmpByEmpId: builder.query({
      query: ({ user_id }) => ({
        url: `${apiEndpoints?.companygetEmpByEmpIdUrl}?user_id=${user_id}`,
        method: 'GET'
      }),
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
    getActionCountUsersAdmin: builder.query({
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
    getActionCountHappcoachUsers: builder.query({
      query: ({ user_id, type, startDate, endDate }) => {
        if (!type || !user_id) {
          return null;
        } else if (!startDate || !endDate) {
          return {
            url: `${apiEndpoints?.getActionCounHappCoach}?userId=${user_id}&type=${type}`,
            method: 'GET'
          }
        } else {
          return {
            url: `${apiEndpoints?.getActionCounHappCoach}?userId=${user_id}&type=${type}&startDate=${startDate}&endDate=${endDate}`,
            method: 'GET'
          }
        }
      },
      providesTags: ['Company']
    }),
    getdivisionEmpTypeCount: builder.query({
      query: ({ divisionId, companyId }) => ({
        url: `${apiEndpoints?.divisionEmpTypeCount}?companyId=${companyId}&divisionId=${divisionId}`,
        method: 'GET'
      }),
      providesTags: ['Company']
    }),
    resetHrCode: builder.mutation({
      query: data => ({
        url: `${apiEndpoints?.resetHrcodeUrl}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Company']
    }),
    divisionDetailsById: builder.query({
      query: ({ divisionId }) => ({
        url: `${apiEndpoints?.divisionDetailByIdUrl}?Id=${divisionId}`,
        method: 'GET'
      }),
      providesTags: ['Company']
    })
  })
})

export const {
  useGetCompanyDataQuery,
  useGetDeptListQuery,
  useGetCompanyListQuery,
  useGetCompanyDetailsQuery,
  useAddCompanyDetailsMutation,
  useCompanyAddDetailsMutation,
  useAddCompanyDivisionMutation,
  useUpdateCompanyDetailsMutation,
  useGetCompanyDetailsGraphActiveUSersQuery,
  useGetCompanyDetailsGraphDrActionQuery,
  useGetEmpByTypeQuery,
  useGetEmpByEmpIdQuery,
  useGetEmpDropdownQuery,
  useGetHCListByTypeQuery,
  useGetActionCountUsersAdminQuery,
  useGetdivisionEmpTypeCountQuery,
  useResetHrCodeMutation,
  useSendMailQuery,
  useDivisionDetailsByIdQuery,
  useGetActionCountHappcoachUsersQuery
} = companyApi

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
      if (!(args.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      return headers
    }
  })(args, api, extraOptions)

  if (result?.error && result?.error.status === 401) {
    window.location.href = '/'
  }
  return result
}

export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Message'],
  endpoints: builder => ({
    getMessageUserData: builder.query({
      query: ({ page, limit, type }) => {
        if (type == 4 || type == '' || type == null || type == undefined) {
          return null; // Skip execution
        }
        return {
          url: `${apiEndpoints?.messageGetUrl}?page=${page}&limit=${limit}&type=${type ?? ''}`,
          method: 'GET'
        }
      },
      providesTags: ['Message']
    }),

    uploadChatFile: builder.mutation({
      query: (data) => ({
        url: apiEndpoints?.updateChatFileUrl,
        method: "POST",
        body: data
      }),
      invalidatesTags: ['User'],
    }),
  })
})

export const { useGetMessageUserDataQuery, useUploadChatFileMutation } = messagingApi
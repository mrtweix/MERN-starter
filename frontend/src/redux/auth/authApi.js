import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authActions } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASEURL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth.token;
    if (!token) return headers;
    headers.set('Authorization', `Bearer ${token}`);
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args); // request url, method, body
  // console.log(api); // signal, dispatch, getState()
  // console.log(extraOptions); //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);
  // console.log(result);

  // If you want, handle other status codes, too
  // if (result?.error?.status === 403) {
  //   console.log('sending refresh token');

  //   // send refresh token to get new access token
  //   const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

  //   if (refreshResult?.data) {
  //     // store the new token
  //     api.dispatch(setCredentials({ ...refreshResult.data }));

  //     // retry original query with new access token
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     if (refreshResult?.error?.status === 403) {
  //       refreshResult.error.data.message = 'Your login has expired.';
  //     }
  //     return refreshResult;
  //   }
  // }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({})
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (details) => ({
        url: '/auth/signup',
        method: 'POST',
        body: { ...details }
      })
    }),
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    userLogout: builder.mutation({
      query: (token) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { ...token }
      })
    }),
    userDetails: builder.mutation({
      query: (token) => ({
        url: '/auth/me',
        method: 'GET'
      })
    })
  })
});

export default authApiSlice;

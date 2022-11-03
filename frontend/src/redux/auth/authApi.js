import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authActions } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASEURL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (!token) return headers;
    headers.set('Authorization', `Bearer ${token}`);
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log(result);
  // if (result?.error?.originalStatus >= 403) {
  //   console.log('sending refresh token');
  //   // send refresh token to get new access token
  //   const refreshResult = await baseQuery('/refreshToken', api, extraOptions);
  //   console.log(refreshResult);
  //   if (refreshResult?.success) {
  //     const user = api.getState().auth.user;
  //     // store the new token
  //     api.dispatch(authActions.setCredentils({ ...refreshResult.result, user }));
  //     // retry the original query with new access token
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     api.dispatch(authActions.logout());
  //   }
  // }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials }
      })
    })
  })
});

export default apiSlice;

// export const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: builder => ({
//     login: builder.mutation({
//       query: credentials => ({
//         url: '/auth',
//         method: 'POST',
//         body: { ...credentials }
//       })
//     })
//   })
// });

// export const { useLoginMutation } = authApiSlice;

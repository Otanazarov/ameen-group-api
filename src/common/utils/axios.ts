import * as axiosI from 'axios';
import { env } from '../config';

export const atmosApi = axiosI.default.create({
  baseURL: 'https://partner.atmos.uz',
  headers: { 'Content-Type': 'application/json' },
});

atmosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      try {
        let refreshedToken = (
          await atmosApi.post(
            '/token',
            new URLSearchParams({
              grant_type: 'client_credentials',
            }),
            {
              headers: {
                Authorization: `Basic ${Buffer.from(`${env.ATMOS_CONSUMER_KEY}:${env.ATMOS_CONSUMER_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
        ).data.token;
        console.log(refreshedToken);
        atmosApi.defaults.headers.common['Authorization'] =
          `Bearer ${refreshedToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${refreshedToken}`;
        return atmosApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

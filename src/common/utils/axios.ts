import * as axiosI from 'axios';
import { env } from '../config';

export const atmosApi = axiosI.default.create({
  baseURL: 'https://partner.atmos.uz',
  headers: { 'Content-Type': 'application/json' },
});

atmosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      try {
        let data = await atmosApi.post(
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
        );
        let token = data.data.access_token;
        atmosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        const { method, url, data: requestData, headers } = originalRequest;

        const res = atmosApi({
          method,
          url,
          data: requestData,
          headers,
        });
        return res;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

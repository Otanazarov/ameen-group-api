"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atmosApi = void 0;
const axiosI = require("axios");
const config_1 = require("../config");
exports.atmosApi = axiosI.default.create({
    baseURL: 'https://partner.atmos.uz',
    headers: { 'Content-Type': 'application/json' },
});
exports.atmosApi.interceptors.response.use((response) => response, async (error) => {
    if (error.response?.status === 401) {
        const originalRequest = error.config;
        try {
            const data = await exports.atmosApi.post('/token', new URLSearchParams({
                grant_type: 'client_credentials',
            }), {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${config_1.env.ATMOS_CONSUMER_KEY}:${config_1.env.ATMOS_CONSUMER_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const token = data.data.access_token;
            exports.atmosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            const { method, url, data: requestData, headers } = originalRequest;
            const res = (0, exports.atmosApi)({
                method,
                url,
                data: requestData,
                headers,
            });
            return res;
        }
        catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
//# sourceMappingURL=axios.js.map
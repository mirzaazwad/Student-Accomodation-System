import Axios from "axios";

class RequestHandler {
  constructor() {
    this.axiosInstance = Axios.create();

    this.axiosInstance.interceptors.request.use(
      function AuthTokenInject(requestConfig) {
        const token = localStorage.getItem("access");
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        requestConfig.baseURL = import.meta.env.VITE_APP_API_URL;
        return requestConfig;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response?.status === 401) {
          console.log("Unauthorized");
        }
        return Promise.reject(error);
      }
    );
  }

  get(url, config) {
    return this.axiosInstance.get(url, config);
  }

  post(url, data, config) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url, data, config) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url, config) {
    return this.axiosInstance.delete(url, config);
  }
}

export const axios = new RequestHandler();

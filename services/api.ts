import axios from "axios";

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    // You can attach headers, tokens, or perform request logging here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Standardization
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = "An unexpected error occurred.";
    let status: number | undefined;
    let data: unknown;

    if (error.response) {
      status = error.response.status;
      data = error.response.data;
      
      if (data && typeof data === "object" && "message" in data) {
        const dataObj = data as { message?: string };
        message = dataObj.message || error.message || message;
      } else {
        message = error.message || message;
      }
    } else if (error.request) {
      message = "No response received from the server. Please check your connection.";
    } else {
      message = error.message;
    }

    return Promise.reject(new ApiError(message, status, data));
  }
);

export const api = client;

export async function apiGet<T>(url: string): Promise<T> {
  const response = await client.get<T>(url);
  return response.data;
}

export async function apiPost<T, R = unknown>(url: string, data: R): Promise<T> {
  const response = await client.post<T>(url, data);
  return response.data;
}

// config/constants.js
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const API_BASE_URL = `${backendUrl}`;

export const API_ENDPOINTS = {
  UPLOAD: "/upload",
  USER: "/user",
  LECTURE: "/lecture",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred",
  UPLOAD_FAILED: "Failed to upload file",
  USER_FETCH_FAILED: "Failed to fetch user details",
};

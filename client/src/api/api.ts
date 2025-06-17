import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response;
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response;
};

// Profile API functions
export const getUserProfile = async () => {
  const response = await api.get("/profile");
  return response;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.post("/profile/upload-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteProfilePicture = async () => {
  const response = await api.delete("/profile/delete-picture");
  return response;
};

// Journal API functions
export const createJournalEntry = async (title: string, content: string) => {
  const response = await api.post("/journal/create", {
    title,
    content,
  });
  return response;
};

export const updateJournalEntry = async (
  note_id: number,
  title: string,
  content: string
) => {
  const response = await api.put("/journal/update", {
    note_id,
    title,
    content,
  });
  return response;
};

export const getJournalEntries = async () => {
  const response = await api.get("/journal/view");
  return response;
};

export const deleteJournalEntry = async (note_id: number) => {
  const response = await api.delete("/journal/delete", {
    data: { note_id },
  });
  return response;
};

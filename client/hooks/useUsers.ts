import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../lib/api";

// ✅ Types
export interface RegisterRequest {
  id?: string;
  userName: string;
  email: string;
  passwordHash: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

interface User {
  id: string;
  userName: string;
  email: string;
}

interface LoginResponse {
  status: number;
  token: string;
  user: User;
}


// 📌 Register User
export const useRegisterUser = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (user: RegisterRequest) => {
      const { data } = await api.post<RegisterResponse>("/api/User/register", user);
      return data;
    },
  });
};

// ✅ Get All Users
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await api.get("/api/User/all");
      return data; // هيرجع List<User>
    },
  });
};

// 📌 Login User
export const useLoginUser = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<LoginResponse>("/api/User/login", credentials);
      return data;
    },
  });
};

// 📌 Get User by Id
export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/User/${id}`);
      return data as { id: string; username: string; email: string }; // حط type مناسب
    },
    enabled: !!id,
  });
};
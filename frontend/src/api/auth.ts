import client from "./client";
import type { LoginRequest, LoginResponse } from "@/types";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await client.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  logout: async () => {
    // If there is a server-side logout, call it here. Otherwise, client-side only.
    // await client.post("/auth/logout");
  }
};

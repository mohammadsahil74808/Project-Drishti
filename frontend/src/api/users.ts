import client from "./client";

export const usersApi = {
  changePassword: async (payload: any) => {
    const { data } = await client.post("/users/me/change-password", payload);
    return data;
  }
};

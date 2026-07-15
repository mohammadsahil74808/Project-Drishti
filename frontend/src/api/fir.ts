import client from "./client";

export const firApi = {
  createFir: async (payload: any) => {
    const { data } = await client.post("/fir", payload);
    return data;
  },
  getFirs: async (params?: any) => {
    const { data } = await client.get("/fir", { params });
    return data;
  }
};

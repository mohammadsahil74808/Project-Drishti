import client from "./client";

export const firApi = {
  createFir: async (payload: any) => {
    const { data } = await client.post("/fir", payload);
    return data;
  }
};

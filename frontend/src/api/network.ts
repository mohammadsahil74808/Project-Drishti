import client from "./client";

export const networkApi = {
  getGraph: async (districtId?: string) => {
    const params = districtId ? { district_id: districtId } : {};
    const { data } = await client.get("/network/graph", { params });
    return data;
  }
};

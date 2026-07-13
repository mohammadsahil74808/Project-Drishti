import client from "./client";

export const geoApi = {
  getHotspots: async (districtId?: string) => {
    const params = districtId ? { district_id: districtId } : {};
    const { data } = await client.get("/geo/hotspots", { params });
    return data;
  },
  getDistricts: async () => {
    const { data } = await client.get("/geo/districts");
    return data;
  }
};

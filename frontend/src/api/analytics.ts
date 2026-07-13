import client from "./client";

export const analyticsApi = {
  getTrend: async (granularity: string = "daily") => {
    const { data } = await client.get("/analytics/trend", { params: { granularity } });
    return data;
  }
};

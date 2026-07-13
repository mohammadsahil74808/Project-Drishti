import client from "./client";

export const dashboardApi = {
  getSummary: async () => {
    const { data } = await client.get("/dashboard/summary");
    return data;
  }
};

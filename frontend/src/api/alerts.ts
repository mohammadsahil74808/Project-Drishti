import client from "./client";

export const alertsApi = {
  getAlerts: async () => {
    const { data } = await client.get("/alerts");
    return data;
  }
};

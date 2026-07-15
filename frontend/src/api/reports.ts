import client from "./client";

export const reportsApi = {
  getReports: async () => {
    const { data } = await client.get("/reports");
    return data;
  },
  createReport: async (payload: any) => {
    const { data } = await client.post("/reports/generate", payload);
    return data;
  },
  downloadReport: async (reportId: string) => {
    const { data } = await client.get(`/reports/${reportId}/download`, { responseType: 'blob' });
    return data;
  }
};

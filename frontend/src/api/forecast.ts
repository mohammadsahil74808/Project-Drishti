import client from "./client";

export const forecastApi = {
  getForecast: async (districtId: string, crimeType?: string) => {
    const params = crimeType ? { crime_type: crimeType } : {};
    const { data } = await client.get(`/forecast/${districtId}`, { params });
    return data;
  }
};

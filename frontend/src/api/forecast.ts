import client from "./client";

export const forecastApi = {
  getForecast: async (districtId: string, crimeType?: string, horizonDays?: number) => {
    const params: any = {};
    if (crimeType) params.crime_type = crimeType;
    if (horizonDays) params.horizon = horizonDays;
    
    const { data } = await client.get(`/forecast/${districtId}`, { params });
    return data;
  }
};

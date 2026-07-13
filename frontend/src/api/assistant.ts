import client from "./client";

export const assistantApi = {
  chat: async (query: string, districtId?: string) => {
    const payload: any = { query };
    if (districtId) {
        payload.district_id = districtId;
    }
    const { data } = await client.post("/assistant/chat", payload);
    return data;
  }
};

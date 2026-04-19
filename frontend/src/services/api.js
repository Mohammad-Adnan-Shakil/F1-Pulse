import api from "../utils/axios";

export const getPredictions = async () => {
  const response = await api.get("/races");
  return response.data;
};

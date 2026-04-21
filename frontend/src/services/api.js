import api from "../utils/axios";

export default api;

export const getPredictions = async () => {
  const response = await api.get("/races");
  return response.data;
};

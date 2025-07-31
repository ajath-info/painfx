import axios from "axios";
import BASE_URL from "../config";

export const getPrescriptions = async ({ page = 1, limit = 10, status = 1, prescribed_to, token }) => {
  const response = await axios.get(
    `${BASE_URL}/prescription/get-by-filter`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit, status, prescribed_to }
    }
  );
  return response.data?.payload || { data: [], total: 0 };
};
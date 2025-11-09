import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const getOrders = async (status = "all") => {
  const res = await axios.get(`${API_URL}?status=${status}`);
  return res.data;
};

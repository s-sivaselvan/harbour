import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ---------------- AUTH INTERCEPTOR ---------------- */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ---------------- CARGO ---------------- */
export const getAllCargo = () => API.get("/cargo");

export const createCargo = (data) =>
  API.post("/cargo", data); // ✅ FIXED

export const updateCargoStatus = (data) =>
  API.put("/cargo/status", data);

export const deleteCargo = (cargoId) =>
  API.delete(`/cargo/${cargoId}`);

/* ---------------- SHIPS ---------------- */
export const getAllShips = () =>
  API.get("/ships");

/* ---------------- BILLS ---------------- */
export const getAllBills = () =>
  API.get("/bills");

export const generateBill = (data) =>
  API.post("/bills", data);

export const downloadBillPDF = (id) =>
  API.get(`/bills/${id}/pdf`, {
    responseType: "blob", // ✅ REQUIRED
  });

export default API;

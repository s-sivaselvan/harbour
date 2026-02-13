import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [ships, setShips] = useState([]);
  const [berths, setBerths] = useState([]);

  const [shipId, setShipId] = useState("");
  const [berthId, setBerthId] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH DATA ---------------- */

  const fetchBills = useCallback(async () => {
    try {
      const res = await API.get("/bills");

      const billsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.bills)
        ? res.data.bills
        : [];

      setBills(billsArray);
    } catch {
      setError("Failed to load bills");
      setBills([]);
    }
  }, []);

  const fetchShips = async () => {
    try {
      const res = await API.get("/ships");
      setShips(res.data || []);
    } catch {
      console.error("Failed to load ships");
    }
  };

  const fetchBerths = async () => {
    try {
      const res = await API.get("/berths");
      setBerths(res.data || []);
    } catch {
      console.error("Failed to load berths");
    }
  };

  useEffect(() => {
    fetchBills();
    fetchShips();
    fetchBerths();
  }, [fetchBills]);

  /* ---------------- CREATE BILL ---------------- */

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setError("");

    if (!shipId || !berthId || !amount) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/bills", {
        shipId,
        berthId,
        amount: Number(amount),
      });

      setShipId("");
      setBerthId("");
      setAmount("");
      fetchBills();
    } catch {
      setError("Failed to generate bill");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DOWNLOAD PDF ---------------- */

  const handleDownloadPDF = async (billId) => {
    try {
      const res = await API.get(`/bills/${billId}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `bill-${billId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bills Management</h1>
          <p className="text-gray-600 mt-1">
            Generate, view and download bills
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* CREATE BILL FORM */}
        <form
          onSubmit={handleGenerateBill}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Generate New Bill
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Ship
              </label>
              <select
                value={shipId}
                onChange={(e) => setShipId(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Ship</option>
                {ships.map((ship) => (
                  <option key={ship._id} value={ship._id}>
                    {ship.shipName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Berth
              </label>
              <select
                value={berthId}
                onChange={(e) => setBerthId(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Berth</option>
                {berths.map((berth) => (
                  <option key={berth._id} value={berth._id}>
                    Berth {berth.berthNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium shadow"
            >
              {loading ? "Generating..." : "Generate Bill"}
            </button>
          </div>
        </form>

        {/* BILLS TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Ship
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Berth
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {bills.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No bills found
                  </td>
                </tr>
              )}

              {bills.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {b.ship?.shipName || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {b.berth?.berthNumber ?? "Not Allocated"}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{Number(b.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDownloadPDF(b._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Bills;

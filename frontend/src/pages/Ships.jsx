import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

const Ships = () => {
  const [ships, setShips] = useState([]);
  const [berths, setBerths] = useState([]);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    shipName: "",
    imoNumber: "",
    captainName: "",
    arrivalTime: "",
  });

  const [editingShip, setEditingShip] = useState(null);
  const [editData, setEditData] = useState({
    shipName: "",
    imoNumber: "",
    captainName: "",
    arrivalTime: "",
    berthId: "",
  });

  /* ================= FETCH ================= */

  const fetchShips = useCallback(async () => {
    try {
      const res = await API.get("/ships");
      setShips(res.data);
    } catch {
      setError("Failed to load ships");
    }
  }, []);

  const fetchBerths = useCallback(async () => {
    try {
      const res = await API.get("/berths");
      setBerths(res.data.filter(b => b.status === "Available"));
    } catch {
      setError("Failed to load berths");
    }
  }, []);

  useEffect(() => {
    fetchShips();
    fetchBerths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= CREATE ================= */

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/ships", formData);
      setShowCreate(false);
      setFormData({
        shipName: "",
        imoNumber: "",
        captainName: "",
        arrivalTime: "",
      });
      fetchShips();
      setError("");
    } catch {
      setError("Create failed");
    }
  };

  /* ================= EDIT ================= */

  const openEdit = (ship) => {
    setEditingShip(ship);
    setEditData({
      shipName: ship.shipName,
      imoNumber: ship.imoNumber,
      captainName: ship.captainName,
      arrivalTime: ship.arrivalTime?.slice(0, 16) || "",
      berthId: ship.berth?._id || "",
    });
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Update ship details
      await API.put(`/ships/${editingShip._id}`, {
        shipName: editData.shipName,
        imoNumber: editData.imoNumber,
        captainName: editData.captainName,
        arrivalTime: editData.arrivalTime,
      });

      // 2️⃣ Allocate berth (if selected)
      if (editData.berthId) {
        await API.post("/berths/allocate", {
          shipId: editingShip._id,
          berthId: editData.berthId,
        });
      }

      setShowEdit(false);
      setEditingShip(null);
      fetchShips();
      fetchBerths();
      setError("");
    } catch {
      setError("Update failed");
    }
  };

  /* ================= DEPART ================= */

  const handleDepart = async (berthId) => {
    try {
      await API.post("/berths/deallocate", { berthId });
      fetchShips();
      fetchBerths();
      setError("");
    } catch {
      setError("Departure failed");
    }
  };

  /* ================= UI ================= */

  const getStatusBadge = (status) => {
    const statusColors = {
      Docked: "bg-green-100 text-green-800 border-green-200",
      Anchored: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Departed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Ship Management
          </h1>
          <p className="text-slate-600 text-lg">Manage your fleet operations and berth allocations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Add Ship Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Ship
          </button>
        </div>

        {/* Ships Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Ship Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">IMO Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Captain</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Berth</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {ships.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No ships in the system</p>
                        <p className="text-sm">Click "Add New Ship" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  ships.map((s, idx) => (
                    <tr
                      key={s._id}
                      className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-slate-800">{s.shipName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">{s.imoNumber}</td>
                      <td className="px-6 py-4 text-slate-700">{s.captainName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {s.berth?.berthNumber ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {s.berth.berthNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No berth</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-md flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>

                          {s.status === "Docked" && s.berth?._id && (
                            <button
                              onClick={() => handleDepart(s.berth._id)}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-md flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Depart
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREATE FORM */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Ship
                </h2>
              </div>

              <form onSubmit={handleCreate} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ship Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Enter ship name"
                    value={formData.shipName}
                    onChange={(e) =>
                      setFormData({ ...formData, shipName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    IMO Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono"
                    placeholder="Enter IMO number"
                    value={formData.imoNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, imoNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Captain Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Enter captain name"
                    value={formData.captainName}
                    onChange={(e) =>
                      setFormData({ ...formData, captainName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Arrival Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={formData.arrivalTime}
                    onChange={(e) =>
                      setFormData({ ...formData, arrivalTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT FORM */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Ship Details
                </h2>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ship Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                    placeholder="Enter ship name"
                    value={editData.shipName}
                    onChange={(e) =>
                      setEditData({ ...editData, shipName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    IMO Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all font-mono"
                    placeholder="Enter IMO number"
                    value={editData.imoNumber}
                    onChange={(e) =>
                      setEditData({ ...editData, imoNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Captain Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                    placeholder="Enter captain name"
                    value={editData.captainName}
                    onChange={(e) =>
                      setEditData({ ...editData, captainName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Arrival Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                    value={editData.arrivalTime}
                    onChange={(e) =>
                      setEditData({ ...editData, arrivalTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Berth Assignment
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all bg-white"
                    value={editData.berthId}
                    onChange={(e) =>
                      setEditData({ ...editData, berthId: e.target.value })
                    }
                  >
                    <option value="">-- Select Berth (Optional) --</option>
                    {berths.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.berthNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Update Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEdit(false);
                      setEditingShip(null);
                    }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ships;
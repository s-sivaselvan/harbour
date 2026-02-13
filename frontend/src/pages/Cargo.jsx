import { useEffect, useState, useCallback } from "react";
import {
  getAllCargo,
  updateCargoStatus,
  deleteCargo,
  createCargo,
  getAllShips
} from "../api/api";

const Cargo = () => {
  const [cargoList, setCargoList] = useState([]);
  const [ships, setShips] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    shipId: "",
    cargoType: "",
    quantity: "",
  });

  const fetchCargo = useCallback(async () => {
    const res = await getAllCargo();
    setCargoList(res.data);

    const map = {};
    res.data.forEach((c) => (map[c._id] = c.status));
    setStatusMap(map);
  }, []);

  const fetchShips = useCallback(async () => {
    const res = await getAllShips();
    setShips(res.data);
  }, []);

  useEffect(() => {
    fetchCargo();
    fetchShips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (id, value) => {
    setStatusMap({ ...statusMap, [id]: value });
  };

  const handleUpdate = async (id, status) => {
    if (!status) return alert("Status missing");

    await updateCargoStatus({
      cargoId: id,
      status,
    });

    fetchCargo();
    window.confirm("Status Updated!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cargo?")) return;
    await deleteCargo(id);
    fetchCargo();
  };

  const handleAddCargo = async (e) => {
    e.preventDefault();
    await createCargo(formData);
    setShowModal(false);
    setFormData({ shipId: "", cargoType: "", quantity: "" });
    fetchCargo();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Loading":
        return "bg-yellow-100 text-yellow-700";
      case "Unloading":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cargo Management</h2>
            <p className="text-gray-600 text-sm mt-1">Track and manage cargo operations</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Cargo
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {cargoList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="font-medium">No cargo found</p>
                      <p className="text-sm text-gray-400 mt-1">Add your first cargo to get started</p>
                    </td>
                  </tr>
                ) : (
                  cargoList.map((cargo) => (
                    <tr key={cargo._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {cargo.ship?.shipName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cargo.cargoType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cargo.quantity.toLocaleString()} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={statusMap[cargo._id]}
                          onChange={(e) => handleStatusChange(cargo._id, e.target.value)}
                          className={`px-3 py-1.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(statusMap[cargo._id])}`}
                        >
                          <option value="Loading">Loading</option>
                          <option value="Unloading">Unloading</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(cargo._id, statusMap[cargo._id])}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(cargo._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-green-600 px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-white">Add New Cargo</h3>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddCargo} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Ship
                </label>
                <select
                  required
                  value={formData.shipId}
                  onChange={(e) => setFormData({ ...formData, shipId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a ship...</option>
                  {ships.map((ship) => (
                    <option key={ship._id} value={ship._id}>
                      {ship.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Electronics, Food, Raw Materials"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (units)
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                >
                  Add Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cargo;
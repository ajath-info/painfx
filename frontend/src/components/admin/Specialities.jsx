import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import BASE_URL from "../../config";
const IMAGE_BASE_URL = 'http://localhost:5000'

const token = localStorage.getItem("token");

const SortIcon = () => (
  <svg
    className="inline w-4 h-4 ml-1 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
);

const SpecialtiesManagement = () => {
  const [specialtyData, setSpecialtyData] = useState([]);
  const [totalSpecialties, setTotalSpecialties] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    image: "",
    imageFile: null, // Added imageFile to initial state
    status: "Active",
    doctors: 0,
  });
  const [formErrors, setFormErrors] = useState({
    code: "",
    name: "",
    image: "",
    doctors: "",
  });

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/specialty/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: entriesPerPage,
          status: 1,
        },
      });
      const result = response.data.payload;
      setSpecialtyData(result.data);
      setTotalSpecialties(result.total);
    } catch (error) {
      console.error("Failed to fetch specialties:", error);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, [currentPage, entriesPerPage]);

  const totalPages = Math.ceil(totalSpecialties / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentSpecialties = specialtyData.slice(0, entriesPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (spec) => {
    setCurrentSpecialty(spec);
    setFormData({
      code: spec.code || "",
      name: spec.name || "",
      image: spec.image_url ? (
        spec.image_url.startsWith("http") 
          ? spec.image_url 
          : `${IMAGE_BASE_URL}${spec.image_url}`
      ) : "",
      imageFile: null, // Reset imageFile for editing
      status: spec.status === "1" || spec.status === 1 ? "Active" : "Inactive",
      doctors: spec.doctor_count || 0,
    });
    setFormErrors({ code: "", name: "", image: "", doctors: "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this specialty?")) {
      try {
        await axios.put(`${BASE_URL}/specialty/toggle-status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchSpecialties();
      } catch (error) {
        console.error("Failed to delete specialty:", error);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }

      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: previewURL,
        imageFile: file,
      }));
      
      // Clear any previous image errors
      setFormErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { code: "", name: "", image: "", doctors: "" };

    if (!formData.name.trim()) {
      errors.name = "Specialty name is required";
      isValid = false;
    }

    if (!formData.code.trim()) {
      errors.code = "Specialty code is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("code", formData.code);
    payload.append("status", formData.status === "Active" ? "1" : "0");

    // Append image file if selected
    if (formData.imageFile) {
      payload.append("image", formData.imageFile);
    }

    // 🔥 Add ID if editing an existing specialty
    if (currentSpecialty?.id) {
      payload.append("id", currentSpecialty.id);
    }

    // Always use POST for both add and update
    await axios.post(`${BASE_URL}/specialty/add-or-update`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchSpecialties();
    handleModalClose();
  } catch (error) {
    console.error("Failed to save specialty:", error);
    alert("Failed to save specialty. Please try again.");
  }
};

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentSpecialty(null);
    setFormData({
      code: "",
      name: "",
      image: "",
      imageFile: null, // Reset imageFile
      status: "Active",
      doctors: 0,
    });
    setFormErrors({ code: "", name: "", image: "", doctors: "" });
  };

  const handleAddSpecialty = () => {
    setCurrentSpecialty(null);
    setFormData({
      code: "",
      name: "",
      image: "",
      imageFile: null, // Reset imageFile for new specialty
      status: "Active",
      doctors: 0,
    });
    setFormErrors({ code: "", name: "", image: "", doctors: "" });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Specialties Management
          </h2>
          <p className="text-gray-600 text-sm">Dashboard / Specialties</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={handleAddSpecialty}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Add Specialty
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty Code
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty Name
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctors
                    <SortIcon />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                    <SortIcon />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSpecialties.map((spec, idx) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {spec.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      {spec.image_url && (
                        <img
                          src={
                            spec.image_url?.startsWith("http")
                              ? spec.image_url
                              : `${IMAGE_BASE_URL}${spec.image_url}`
                          }
                          alt={`${spec.name} icon`}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer mr-3"
                          onClick={() =>
                            setSelectedImage(
                              spec.image_url?.startsWith("http")
                                ? spec.image_url
                                : `https://painfx-2.onrender.com${spec.image_url}`
                            )
                          }
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      {spec.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          spec.status === "1" || spec.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {spec.status === "1" || spec.status === 1
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {spec.doctor_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                      <button
                        onClick={() => handleEdit(spec)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(spec.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentSpecialties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No specialties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, specialtyData.length)} of{" "}
              {totalSpecialties} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                {currentPage}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {currentSpecialty ? "Edit Specialty" : "Add New Specialty"}
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., #SP001"
                  />
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.code}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., Cardiology"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {formErrors.image && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.image}
                    </p>
                  )}
                </div>

                {formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    {currentSpecialty ? "Save Changes" : "Add Specialty"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white p-4 rounded-lg shadow-lg max-w-xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Full View"
                className="w-full h-auto object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SpecialtiesManagement;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import axios from "axios";
import BASE_URL from "../../config";
import { PlusCircle } from "lucide-react";

const AddPrescription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [prescriptionText, setPrescriptionText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const appointmentId = state?.appointmentId;

  const handleTextChange = (e) => {
    setPrescriptionText(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || (!prescriptionText && !image)) return;

    const formData = new FormData();
    formData.append("appointment_id", appointmentId);
    formData.append("prescription_text", prescriptionText);
    if (image) formData.append("prescription_image", image);

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/prescription/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Failed to add prescription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">Add Prescription</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription Text
            </label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="5"
              value={prescriptionText}
              onChange={handleTextChange}
              placeholder="Enter prescription details..."
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Prescription Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 disabled:bg-gray-400 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>{image || prescriptionText ? "Update" : "Add"} Prescription</span>
              </>
            )}
          </button>
        </form>
      </div>
    </DoctorLayout>
  );
};

export default AddPrescription;
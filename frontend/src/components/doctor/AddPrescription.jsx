import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import axios from "axios";
import BASE_URL from "../../config";
import { PlusCircle } from "lucide-react";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPrescription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [prescriptionText, setPrescriptionText] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const appointment = state?.appointment;

  const handleTextChange = (e) => {
    setPrescriptionText(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Determine file type
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      setFileType(extension === "pdf" ? "pdf" : "image");
    } else {
      setFile(null);
      setFileType(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!appointment?.id || (!prescriptionText && !file)) {
      toast.error("Appointment ID and at least one of prescription text or file is required");
      return;
    }

    const formData = new FormData();
    formData.append("appointment_id", appointment.id);
    formData.append("prescribed_to", appointment.userId);
    formData.append("notes", prescriptionText);
    if (file) {
      formData.append("file", file);
      formData.append("file_type", fileType);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/prescription/add-or-update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      navigate("/doctor/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add prescription";
      toast.error(errorMessage);
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
              Upload Prescription File (Image or PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 disabled:bg-gray-400 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Add Prescription</span>
              </>
            )}
          </button>
        </form>
      </div>
    </DoctorLayout>
  );
};

export default AddPrescription;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';
import BASE_URL from '../../config';



const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DoctorSchedule = () => {
  const [slotDuration, setSlotDuration] = useState(30);
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [availability, setAvailability] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [slotInputs, setSlotInputs] = useState([{ start_time: '', end_time: '' }]);

  const token = localStorage.getItem('token');

  // Fetch availability on load
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/availability/get-availability`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = {};
      res.data.payload.forEach(item => {
        mapped[item.day] = {
          slots: item.slots || [],
          slotData: item.slotData || [],
        };
      });
      setAvailability(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const openAddSlotModal = () => {
    // Get existing slots for the selected day
    const existingSlots = availability[selectedDay]?.slots || [];
    
    if (existingSlots.length > 0) {
      // Convert existing slots to the format expected by slotInputs
      const convertedSlots = existingSlots.map(slot => ({
        start_time: slot.from,
        end_time: slot.to
      }));
      setSlotInputs(convertedSlots);
    } else {
      // If no existing slots, show empty input
      setSlotInputs([{ start_time: '', end_time: '' }]);
    }
    
    setShowModal(true);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slotInputs];
    updated[index][field] = value;
    setSlotInputs(updated);
  };

  const addSlotField = () => {
    setSlotInputs([...slotInputs, { start_time: '', end_time: '' }]);
  };

  const removeSlotField = (index) => {
    const updated = [...slotInputs];
    updated.splice(index, 1);
    setSlotInputs(updated);
  };

  const saveSlots = async () => {
    try {
      const payload = {
        day: selectedDay,
        slot_duration: slotDuration,
        slot: slotInputs,
      };
      await axios.post(`${BASE_URL}/availability/add-or-update-availability`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchAvailability();
    } catch (err) {
      console.error('Save slot error:', err);
    }
  };

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Schedule Timings</h2>

        {/* Slot Duration */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Timing Slot Duration</label>
          <select
            className="w-1/3 p-2 border rounded"
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
          >
            <option value={15}>15 mins</option>
            <option value={30}>30 mins</option>
            <option value={45}>45 mins</option>
            <option value={60}>60 mins</option>
          </select>
        </div>

        {/* Days */}
        <div className="flex flex-wrap gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              className={`px-4 py-2 rounded-lg ${selectedDay === day ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Time Slots Display */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Time Slots</h3>
            <button onClick={openAddSlotModal} className="text-blue-500 hover:underline"> Edit</button>
          </div>

          {availability[selectedDay]?.slots?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {availability[selectedDay].slots.map((slot, idx) => (
                <span
                  key={idx}
                  className="bg-red-100 text-red-700 border border-red-500 px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition"
                >
                  {slot.from} - {slot.to}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Not Available</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Time Slots</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            {slotInputs.map((slot, index) => (
              <div className="mb-4" key={index}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={slot.start_time}
                      onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                    >
                      <option value="">Select Start Time</option>
                      {generateTimes()}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={slot.end_time}
                      onChange={(e) => handleSlotChange(index, 'end_time', e.target.value)}
                    >
                      <option value="">Select End Time</option>
                      {generateTimes()}
                    </select>
                  </div>
                  {slotInputs.length > 1 && (
                    <button 
                      onClick={() => removeSlotField(index)} 
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-6"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              onClick={addSlotField} 
              className="text-blue-500 hover:underline mb-4 flex items-center"
            >
              + Add More
            </button>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveSlots}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
};

// Helper to generate time options
const generateTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hr = h < 10 ? '0' + h : h;
      const min = m < 10 ? '0' + m : m;
      times.push(
        <option key={`${hr}:${min}`} value={`${hr}:${min}`}>
          {`${hr}:${min}`}
        </option>
      );
    }
  }
  return times;
};

export default DoctorSchedule;
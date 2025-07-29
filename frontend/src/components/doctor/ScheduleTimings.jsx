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
  const [slotInputs, setSlotInputs] = useState([]);
  const token = localStorage.getItem('token');

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
    const existingSlotData = availability[selectedDay]?.slotData || [];
    
    if (existingSlotData.length > 0) {
      const convertedSlots = existingSlotData.map(slot => ({
        id: slot.id,
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        slot_duration: slot.slot_duration
      }));
      setSlotInputs(convertedSlots);
    } else {
      setSlotInputs([]);
    }
    
    setShowModal(true);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slotInputs];
    updated[index][field] = field === 'slot_duration' ? Number(value) : value;
    setSlotInputs(updated);
  };

  const addSlotField = () => {
    setSlotInputs([...slotInputs, { start_time: '', end_time: '', slot_duration: slotDuration }]);
  };

  const removeSlotField = (index) => {
    const updated = [...slotInputs];
    updated.splice(index, 1);
    setSlotInputs(updated);
  };

  const timeToMinutes = (time) => {
    if (!time) return Infinity; // Use Infinity for empty times to avoid false positives
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isTimeInRange = (time, ranges, currentIndex, currentId) => {
    const timeInMinutes = timeToMinutes(time);
    return ranges.some((range, idx) => {
      if (currentIndex !== null && idx === currentIndex) return false; // Skip current slot in slotInputs
      if (currentId && range.id === currentId) return false; // Skip same slot when updating
      const start = timeToMinutes(range.start_time);
      const end = timeToMinutes(range.end_time);
      return timeInMinutes >= start && timeInMinutes <= end;
    });
  };

  const generateStartTimes = (index, slotId) => {
    const times = [];
    const existingSlotData = availability[selectedDay]?.slotData || [];
    // Only include existing slots that are still in slotInputs (not removed)
    const activeSlotIds = slotInputs.map(slot => slot.id).filter(id => id);
    const existingRanges = existingSlotData
      .filter(slot => !slot.id || activeSlotIds.includes(slot.id))
      .map(slot => ({
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        id: slot.id
      }));

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hr = h < 10 ? '0' + h : h;
        const min = m < 10 ? '0' + m : m;
        const time = `${hr}:${min}`;
        const isDisabled = isTimeInRange(time, slotInputs, index, slotId) || 
                          isTimeInRange(time, existingRanges, null, slotId);
        
        times.push(
          <option key={time} value={time} disabled={isDisabled}>
            {time}
          </option>
        );
      }
    }
    return times;
  };

  const generateEndTimes = (startTime, index, slotId) => {
    const times = [];
    const startMinutes = timeToMinutes(startTime);
    const existingSlotData = availability[selectedDay]?.slotData || [];
    // Only include existing slots that are still in slotInputs (not removed)
    const activeSlotIds = slotInputs.map(slot => slot.id).filter(id => id);
    const existingRanges = existingSlotData
      .filter(slot => !slot.id || activeSlotIds.includes(slot.id))
      .map(slot => ({
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        id: slot.id
      }));

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hr = h < 10 ? '0' + h : h;
        const min = m < 10 ? '0' + m : m;
        const time = `${hr}:${min}`;
        const timeMinutes = timeToMinutes(time);
        const isDisabled = timeMinutes <= startMinutes || 
                          isTimeInRange(time, slotInputs, index, slotId) || 
                          isTimeInRange(time, existingRanges, null, slotId);
        
        times.push(
          <option key={time} value={time} disabled={isDisabled}>
            {time}
          </option>
        );
      }
    }
    return times;
  };

  const validateSlots = () => {
    if (slotInputs.length === 0) {
      alert('At least one time slot is required to save');
      return false;
    }

    const existingSlotData = availability[selectedDay]?.slotData || [];
    // Only validate against existing slots that are still in slotInputs
    const activeSlotIds = slotInputs.map(slot => slot.id).filter(id => id);
    const existingRanges = existingSlotData
      .filter(slot => !slot.id || activeSlotIds.includes(slot.id))
      .map(slot => ({
        start_time: slot.start_time.slice(0, 5),
        end_time: slot.end_time.slice(0, 5),
        id: slot.id
      }));

    for (let i = 0; i < slotInputs.length; i++) {
      const slot = slotInputs[i];
      if (!slot.start_time || !slot.end_time || !slot.slot_duration) {
        alert('Please fill all fields for each time slot');
        return false;
      }
      const start = timeToMinutes(slot.start_time);
      const end = timeToMinutes(slot.end_time);
      if (start >= end) {
        alert('End time must be after start time');
        return false;
      }
      // Check for overlaps with other slots in slotInputs
      for (let j = 0; j < slotInputs.length; j++) {
        if (i !== j) {
          const other = slotInputs[j];
          const otherStart = timeToMinutes(other.start_time);
          const otherEnd = timeToMinutes(other.end_time);
          if (start <= otherEnd && end >= otherStart) {
            alert('Time slots cannot overlap with other new or updated slots');
            return false;
          }
        }
      }
      // Check for overlaps with existing slots (unless updating the same slot)
      for (const existing of existingRanges) {
        if (slot.id && slot.id === existing.id) continue; // Skip if updating the same slot
        const existingStart = timeToMinutes(existing.start_time);
        const existingEnd = timeToMinutes(existing.end_time);
        if (start <= existingEnd && end >= existingStart) {
          alert('Time slots cannot overlap with existing saved slots');
          return false;
        }
      }
    }
    return true;
  };

  const saveSlots = async () => {
    if (!validateSlots()) return;

    try {
      const payload = {
        day: selectedDay,
        slotData: slotInputs.map(slot => ({
          id: slot.id || null,
          start_time: `${slot.start_time}:00`,
          end_time: `${slot.end_time}:00`,
          slot_duration: slot.slot_duration
        }))
      };
      await axios.post(`${BASE_URL}/availability/add-or-update-availability`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchAvailability();
    } catch (err) {
      console.error('Save slot error:', err);
      alert('Failed to save slots');
    }
  };

  return (
    <DoctorLayout>
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Schedule Timings</h2>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Default Slot Duration</label>
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

        <div className="flex flex-wrap gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              className={`px-4 py-2 rounded-lg ${selectedDay === day ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800 cursor-pointer'}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.toUpperCase()}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Time Slots</h3>
            <button onClick={openAddSlotModal} className="text-cyan-500 hover:underline cursor-pointer">
              {availability[selectedDay]?.slots?.length > 0 ? 'Edit' : 'Add New'}
            </button>
          </div>

          {availability[selectedDay]?.slots?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {availability[selectedDay].slots.map((slot, idx) => (
                <span
                  key={idx}
                  className=" text-cyan-700 border border-cyan-500 px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md hover:bg-cyan-500 hover:text-white cursor-pointer transition"
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

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Time Slots for {selectedDay}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-red-900 hover:text-red-700 text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {slotInputs.length === 0 && (
              <p className="text-gray-500 mb-4">No slots added yet. Click "Add More" to create a new slot.</p>
            )}
            
            {slotInputs.map((slot, index) => (
              <div className="mb-4" key={index}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={slot.start_time}
                      onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                    >
                      <option value="">Select Start Time</option>
                      {generateStartTimes(index, slot.id)}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={slot.end_time}
                      onChange={(e) => handleSlotChange(index, 'end_time', e.target.value)}
                    >
                      <option value="">Select End Time</option>
                      {generateEndTimes(slot.start_time, index, slot.id)}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">Duration (mins)</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={slot.slot_duration}
                      onChange={(e) => handleSlotChange(index, 'slot_duration', e.target.value)}
                    >
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => removeSlotField(index)} 
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-6"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={addSlotField} 
              className="text-cyan-500 hover:underline mb-4 flex items-center cursor-pointer"
            >
              + Add More
            </button>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowModal(false)} 
                className="text-cyan-500 px-4 py-2 rounded hover:bg-cyan-500 hover:text-white border border-cyan-500 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveSlots}
                className="px-4 py-2 rounded bg-cyan-500 text-white border border-cyan-500 transition cursor-pointer"
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

export default DoctorSchedule;
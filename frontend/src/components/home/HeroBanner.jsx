import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, ChevronDown } from "lucide-react";
import Capture from "../../images/Capture.webp";
import BASE_URL from "../../config";

const HeroBanner = () => {
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [cities, setCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (location) {
      const filtered = cities.filter((city) =>
        city.city.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [location, cities]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cities`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Transform API response into expected format
      const transformedCities = data.payload.cities.map((cityName) => ({
        city: cityName,
        state: "", // Default empty state
        doctorCount: 0, // Default doctor count
      }));
      setCities(transformedCities);
      setFilteredCities(transformedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      const fallbackCities = [
        {
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          doctorCount: 150,
        },
        {
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          doctorCount: 230,
        },
        { city: "Delhi", state: "Delhi", country: "India", doctorCount: 180 },
        {
          city: "Chennai",
          state: "Tamil Nadu",
          country: "India",
          doctorCount: 120,
        },
        {
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          doctorCount: 95,
        },
      ];
      setCities(fallbackCities);
      setFilteredCities(fallbackCities);
    }
  };

  const handleCitySelect = (city) => {
    setLocation(city.city); // Only set the location state
    setShowCityDropdown(false); // Close the dropdown
  };

  const handleSearch = () => {
    // Navigate to /search with query params
    const query = new URLSearchParams();
    if (location) query.append("location", location);
    if (keyword) query.append("keyword", keyword);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <section className="bg-[#FAFAFC] pt-4 pb-0 relative flex flex-col items-center justify-start overflow-hidden px-2">
      {/* Text Content */}
      <div className="text-center z-10 max-w-4xl mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 leading-tight">
          Search Doctor, Make an Appointment
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-4">
          Discover the best doctors and clinics nearest to you.
        </p>

        {/* Search Box */}
        <div className="bg-gradient-to-b from-[#f9f9ff] to-white rounded-xl p-5 flex flex-col md:flex-row md:items-end items-start justify-between space-y-4 md:space-y-0 md:space-x-4 w-full max-w-7xl">
          {/* Location Input with Dropdown */}
          <div className="flex flex-col items-start w-full md:w-[300px] relative">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 w-full">
              <MapPin className="text-blue-500 mr-3 w-5 h-5" />
              <input
                type="text"
                className="w-full focus:outline-none placeholder-gray-500 text-gray-700 text-base"
                placeholder="Search Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              />
              <ChevronDown className="text-gray-400 w-4 h-4 ml-2" />
            </div>
            <p className="text-sm text-gray-500 mt-2 pl-1">
              Based on your Location
            </p>

            {/* Cities Dropdown */}
            {showCityDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city.city}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700 text-left"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city.city}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-left">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Keyword Input */}
          <div className="flex flex-col items-start w-full md:w-[600px]">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 w-full">
              <Search className="text-blue-500 mr-3 w-5 h-5" />
              <input
                type="text"
                className="w-full focus:outline-none placeholder-gray-500 text-gray-700 text-base"
                placeholder="Search Doctors, Clinics Etc"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 pl-1">
              Ex: Online Mental Health Therapy Consultation 
            </p>
          </div>

          {/* Search Button */}
          <div className="mb-7 w-full md:w-auto flex justify-center md:justify-start">
            <button
              type="button"
              onClick={handleSearch}
              className="cursor-pointer bg-green-500 text-white px-6 py-3 md:py-3.5 rounded-xl hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base font-medium flex items-center gap-2 w-full md:w-auto h-[48px]"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Image */}
      <div className="mt-8">
        <img
          src={Capture}
          alt="Cityscape with Healthcare Elements"
          loading="lazy"
          className="w-full h-auto object-cover "
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/1200x200?text=Cityscape+Image";
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;
